import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../layout/LoadingSpinner';

const ArticleManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    cover_image: '',
    category: '',
    meta_title: '',
    meta_description: '',
    read_time: 5,
    published: false
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.getArticles({});
      setArticles(response.data);
    } catch (error) {
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await api.updateArticle(editingArticle.id, formData);
        toast.success('Article updated successfully');
      } else {
        await api.createArticle(formData);
        toast.success('Article created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      toast.error('Failed to save article');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.deleteArticle(id);
        toast.success('Article deleted successfully');
        fetchArticles();
      } catch (error) {
        toast.error('Failed to delete article');
      }
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      cover_image: article.cover_image || '',
      category: article.category,
      meta_title: article.meta_title || '',
      meta_description: article.meta_description || '',
      read_time: article.read_time,
      published: article.published
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      cover_image: '',
      category: '',
      meta_title: '',
      meta_description: '',
      read_time: 5,
      published: false
    });
    setEditingArticle(null);
  };

  const generateContent = async () => {
    if (!formData.title) {
      toast.error('Please enter a title first');
      return;
    }
    setGenerating(true);
    try {
      const response = await api.generateContent(
        `Write a professional blog article about: "${formData.title}". Make it informative and engaging for the cosmetic industry.`,
        'article'
      );
      setFormData({ ...formData, content: response.data.content });
      toast.success('Content generated!');
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div data-testid="article-management">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Articles</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700" data-testid="add-article-button">
              <Plus size={20} className="mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? 'Edit Article' : 'Add New Article'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="article-form">
              <div>
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required data-testid="article-title-input" />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required data-testid="article-category-input" placeholder="e.g., Industry News, Tips" />
              </div>
              <div>
                <Label>Excerpt</Label>
                <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} required rows={2} data-testid="article-excerpt-input" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label>Content</Label>
                  <Button type="button" size="sm" variant="outline" onClick={generateContent} disabled={generating} data-testid="generate-content-button">
                    <Sparkles size={16} className="mr-2" />
                    {generating ? 'Generating...' : 'AI Generate'}
                  </Button>
                </div>
                <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required rows={8} data-testid="article-content-input" />
              </div>
              <div>
                <Label>Cover Image URL</Label>
                <Input value={formData.cover_image} onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })} data-testid="article-cover-input" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Meta Title</Label>
                  <Input value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })} data-testid="article-meta-title-input" />
                </div>
                <div>
                  <Label>Read Time (minutes)</Label>
                  <Input type="number" value={formData.read_time} onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })} data-testid="article-read-time-input" />
                </div>
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })} rows={2} data-testid="article-meta-desc-input" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={formData.published} onCheckedChange={(checked) => setFormData({ ...formData, published: checked })} data-testid="article-published-switch" />
                <Label>Published</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700" data-testid="save-article-button">{editingArticle ? 'Update' : 'Create'} Article</Button>
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }} data-testid="cancel-article-button">Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="p-6" data-testid={`article-item-${article.id}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{article.title}</h3>
                <p className="text-sm text-slate-600">{article.category}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${article.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                {article.published ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{article.excerpt}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleEdit(article)} data-testid={`edit-article-${article.id}`}><Edit size={16} /></Button>
              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(article.id)} data-testid={`delete-article-${article.id}`}><Trash2 size={16} /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ArticleManagement;
