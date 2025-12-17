import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Image, X, Star } from 'lucide-react';
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

const GalleryManagement = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    featured: false,
    order: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [galleryRes, categoriesRes] = await Promise.all([
        api.getGallery({}),
        api.getGalleryCategories()
      ]);
      setItems(galleryRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error('Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      toast.error('Please provide an image URL');
      return;
    }

    try {
      if (editingItem) {
        await api.updateGalleryItem(editingItem.id, formData);
        toast.success('Gallery item updated successfully');
      } else {
        await api.createGalleryItem({ ...formData, order: items.length });
        toast.success('Gallery item created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to save gallery item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url,
      category: item.category || '',
      featured: item.featured || false,
      order: item.order || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await api.deleteGalleryItem(id);
        toast.success('Gallery item deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete gallery item');
      }
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: '',
      featured: false,
      order: 0
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gallery</h2>
          <p className="text-slate-500">Manage your image gallery</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus size={20} className="mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Image' : 'Add New Image'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Image title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Optional description"
                />
              </div>

              <div>
                <Label>Image *</Label>
                <div className="mt-2 space-y-3">
                  {/* Image Preview */}
                  {formData.image_url && (
                    <div className="relative w-full aspect-video bg-slate-100 rounded-lg overflow-hidden">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  
                  {/* Upload Options */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        value={formData.image_url.startsWith('data:') ? '' : formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="Image URL"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button type="button" variant="outline">
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Products, Facility, Events"
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured (show on homepage)</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                  {editingItem ? 'Update' : 'Add'} Image
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-500">Filter:</span>
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'bg-cyan-600 hover:bg-cyan-700' : ''}
          >
            All ({items.length})
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-cyan-600 hover:bg-cyan-700' : ''}
            >
              {category} ({items.filter(i => i.category === category).length})
            </Button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <Card className="p-12 text-center">
          <Image size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No Images Yet</h3>
          <p className="text-slate-500 mb-4">Add your first gallery image to get started</p>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus size={20} className="mr-2" />
            Add Image
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group relative">
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  onClick={() => handleEdit(item)}
                  className="h-9 w-9"
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  size="icon" 
                  variant="destructive" 
                  onClick={() => handleDelete(item.id)}
                  className="h-9 w-9"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              {/* Featured badge */}
              {item.featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded-full">
                  <Star size={14} />
                </div>
              )}

              {/* Info */}
              <div className="p-3">
                <h4 className="font-medium text-sm truncate">{item.title}</h4>
                {item.category && (
                  <span className="text-xs text-cyan-600">{item.category}</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
