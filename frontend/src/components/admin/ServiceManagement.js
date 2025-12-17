import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Sparkles, GripVertical, X } from 'lucide-react';
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

const ICON_OPTIONS = [
  'Sparkles', 'Beaker', 'Package', 'Palette', 'Truck', 'Shield', 
  'Award', 'Leaf', 'Heart', 'Star', 'Zap', 'Target', 'Layers', 'Settings'
];

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [featureInput, setFeatureInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    icon: 'Sparkles',
    image_url: '',
    features: [],
    benefits: '',
    process_steps: '',
    featured: false,
    order: 0
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.getServices({});
      setServices(response.data);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.updateService(editingService.id, formData);
        toast.success('Service updated successfully');
      } else {
        await api.createService({ ...formData, order: services.length });
        toast.success('Service created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      toast.error('Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      short_description: service.short_description,
      description: service.description,
      icon: service.icon || 'Sparkles',
      image_url: service.image_url || '',
      features: service.features || [],
      benefits: service.benefits || '',
      process_steps: service.process_steps || '',
      featured: service.featured || false,
      order: service.order || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.deleteService(id);
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: '',
      short_description: '',
      description: '',
      icon: 'Sparkles',
      image_url: '',
      features: [],
      benefits: '',
      process_steps: '',
      featured: false,
      order: 0
    });
    setFeatureInput('');
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Services</h2>
          <p className="text-slate-500">Manage your service offerings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus size={20} className="mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Product Formulation"
                  />
                </div>
                
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <select
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="short_description">Short Description *</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    required
                    placeholder="Brief description for cards"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    placeholder="Detailed service description"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                {/* Features */}
                <div className="col-span-2">
                  <Label>Features</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      placeholder="Add a feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="outline">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                        {feature}
                        <button type="button" onClick={() => removeFeature(index)} className="hover:text-red-600">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    rows={3}
                    placeholder="Key benefits of this service"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="process_steps">Process Steps</Label>
                  <Textarea
                    id="process_steps"
                    value={formData.process_steps}
                    onChange={(e) => setFormData({ ...formData, process_steps: e.target.value })}
                    rows={3}
                    placeholder="Step-by-step process description"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-3">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Service (show on homepage)</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                  {editingService ? 'Update' : 'Create'} Service
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services List */}
      {services.length === 0 ? (
        <Card className="p-12 text-center">
          <Sparkles size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">No Services Yet</h3>
          <p className="text-slate-500 mb-4">Create your first service to get started</p>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus size={20} className="mr-2" />
            Add Service
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {service.image_url && (
                <div className="aspect-video bg-slate-100">
                  <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Sparkles size={20} className="text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{service.name}</h3>
                      {service.featured && (
                        <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">Featured</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">#{service.order + 1}</span>
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{service.short_description}</p>
                
                {service.features && service.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="text-xs text-slate-400">+{service.features.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)} className="flex-1">
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)} className="text-red-600 hover:bg-red-50">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
