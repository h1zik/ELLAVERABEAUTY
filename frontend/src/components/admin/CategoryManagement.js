import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Tag, Package, Newspaper } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../layout/LoadingSpinner';

const CategoryManagement = () => {
  const [productCategories, setProductCategories] = useState([]);
  const [articleCategories, setArticleCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('product');
  const [formData, setFormData] = useState({
    name: '',
    type: 'product',
    description: '',
    order: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const [productRes, articleRes] = await Promise.all([
        api.getCategories({ type: 'product' }),
        api.getCategories({ type: 'article' })
      ]);
      setProductCategories(productRes.data);
      setArticleCategories(articleRes.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        type: activeTab,
        order: activeTab === 'product' ? productCategories.length : articleCategories.length
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, dataToSend);
        toast.success('Category updated successfully');
      } else {
        await api.createCategory(dataToSend);
        toast.success('Category created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Failed to save category');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      description: category.description || '',
      order: category.order || 0
    });
    setActiveTab(category.type);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id, type) => {
    if (window.confirm('Are you sure you want to delete this category? Products/Articles using this category will not be affected.')) {
      try {
        await api.deleteCategory(id);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: activeTab,
      description: '',
      order: 0
    });
  };

  const handleAddNew = (type) => {
    setActiveTab(type);
    resetForm();
    setFormData(prev => ({ ...prev, type }));
    setIsDialogOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  const CategoryList = ({ categories, type }) => (
    <div className="space-y-3">
      {categories.length === 0 ? (
        <Card className="p-8 text-center">
          <Tag size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 mb-4">No {type} categories yet</p>
          <Button onClick={() => handleAddNew(type)} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus size={16} className="mr-2" />
            Add First Category
          </Button>
        </Card>
      ) : (
        <>
          {categories.map((category, index) => (
            <Card key={category.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  {type === 'product' ? (
                    <Package size={20} className="text-cyan-600" />
                  ) : (
                    <Newspaper size={20} className="text-cyan-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-slate-500 line-clamp-1">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 mr-2">#{index + 1}</span>
                <Button variant="outline" size="icon" onClick={() => handleEdit(category)} className="h-8 w-8">
                  <Edit size={14} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleDelete(category.id, type)}
                  className="h-8 w-8 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
          <Button 
            onClick={() => handleAddNew(type)} 
            variant="outline" 
            className="w-full border-dashed"
          >
            <Plus size={16} className="mr-2" />
            Add {type === 'product' ? 'Product' : 'Article'} Category
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Categories</h2>
          <p className="text-slate-500">Manage product and article categories</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="product" className="flex items-center gap-2">
            <Package size={16} />
            Product Categories ({productCategories.length})
          </TabsTrigger>
          <TabsTrigger value="article" className="flex items-center gap-2">
            <Newspaper size={16} />
            Article Categories ({articleCategories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="product">
          <CategoryList categories={productCategories} type="product" />
        </TabsContent>

        <TabsContent value="article">
          <CategoryList categories={articleCategories} type="article" />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : `Add ${activeTab === 'product' ? 'Product' : 'Article'} Category`}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder={activeTab === 'product' ? 'e.g., Skincare, Body Care' : 'e.g., Industry News, Tips'}
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Brief description of this category"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                {editingCategory ? 'Update' : 'Create'} Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
