import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../layout/LoadingSpinner';

const PageBuilderManagement = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('home');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    page_name: 'home',
    section_name: '',
    section_type: 'text',
    content: {},
    order: 0,
    visible: true
  });

  const pages = [
    { value: 'home', label: 'Homepage' },
    { value: 'about', label: 'About Page' },
    { value: 'contact', label: 'Contact Page' }
  ];

  const sectionTypes = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'text', label: 'Text Content' },
    { value: 'features', label: 'Features Grid' },
    { value: 'cta', label: 'Call to Action' },
    { value: 'process', label: 'Process Steps' },
    { value: 'services', label: 'Services List' }
  ];

  useEffect(() => {
    fetchSections();
  }, [selectedPage]);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await api.getPageSections(selectedPage);
      setSections(response.data);
    } catch (error) {
      toast.error('Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSection) {
        await api.updatePageSection(editingSection.id, formData);
        toast.success('Section updated successfully');
      } else {
        await api.createPageSection(formData);
        toast.success('Section created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchSections();
    } catch (error) {
      toast.error('Failed to save section');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await api.deletePageSection(id);
        toast.success('Section deleted successfully');
        fetchSections();
      } catch (error) {
        toast.error('Failed to delete section');
      }
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      page_name: section.page_name,
      section_name: section.section_name,
      section_type: section.section_type,
      content: section.content,
      order: section.order,
      visible: section.visible
    });
    setIsDialogOpen(true);
  };

  const toggleVisibility = async (section) => {
    try {
      await api.updatePageSection(section.id, {
        ...section,
        visible: !section.visible
      });
      fetchSections();
      toast.success(section.visible ? 'Section hidden' : 'Section visible');
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const resetForm = () => {
    setFormData({
      page_name: selectedPage,
      section_name: '',
      section_type: 'text',
      content: {},
      order: sections.length,
      visible: true
    });
    setEditingSection(null);
  };

  const renderContentFields = () => {
    const type = formData.section_type;
    const content = formData.content || {};

    const updateContent = (key, value) => {
      setFormData({
        ...formData,
        content: { ...content, [key]: value }
      });
    };

    switch (type) {
      case 'hero':
        return (
          <>
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
                placeholder="Main hero title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Textarea
                value={content.subtitle || ''}
                onChange={(e) => updateContent('subtitle', e.target.value)}
                rows={2}
                placeholder="Hero description"
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={content.button_text || ''}
                onChange={(e) => updateContent('button_text', e.target.value)}
                placeholder="Get Started"
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={content.button_link || ''}
                onChange={(e) => updateContent('button_link', e.target.value)}
                placeholder="/products"
              />
            </div>
            <div>
              <Label>Background Image URL</Label>
              <Input
                value={content.background_image || ''}
                onChange={(e) => updateContent('background_image', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </>
        );
      case 'text':
        return (
          <>
            <div>
              <Label>Heading</Label>
              <Input
                value={content.heading || ''}
                onChange={(e) => updateContent('heading', e.target.value)}
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                rows={6}
              />
            </div>
          </>
        );
      case 'cta':
        return (
          <>
            <div>
              <Label>Heading</Label>
              <Input
                value={content.heading || ''}
                onChange={(e) => updateContent('heading', e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => updateContent('description', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={content.button_text || ''}
                onChange={(e) => updateContent('button_text', e.target.value)}
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={content.button_link || ''}
                onChange={(e) => updateContent('button_link', e.target.value)}
              />
            </div>
          </>
        );
      default:
        return (
          <div>
            <Label>Content (JSON)</Label>
            <Textarea
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  setFormData({ ...formData, content: JSON.parse(e.target.value) });
                } catch (err) {
                  // Invalid JSON, don't update
                }
              }}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        );
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div data-testid="page-builder-management">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Page Builder</h2>
          <p className="text-slate-600">Customize sections for each page</p>
        </div>
        <Select value={selectedPage} onValueChange={setSelectedPage}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pages.map((page) => (
              <SelectItem key={page.value} value={page.value}>{page.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus size={20} className="mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Section Name</Label>
                <Input
                  value={formData.section_name}
                  onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
                  required
                  placeholder="e.g., Hero Section, About Us"
                />
              </div>
              <div>
                <Label>Section Type</Label>
                <Select value={formData.section_type} onValueChange={(value) => setFormData({ ...formData, section_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>
              {renderContentFields()}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                />
                <Label>Visible</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                  <Save size={20} className="mr-2" />
                  {editingSection ? 'Update' : 'Create'} Section
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sections.length === 0 ? (
          <Card className="p-12 text-center text-slate-600">
            No sections yet. Add your first section to customize this page.
          </Card>
        ) : (
          sections.map((section) => (
            <Card key={section.id} className={`p-6 ${!section.visible ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{section.section_name}</h3>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {section.section_type}
                    </span>
                    <span className="text-xs text-slate-500">Order: {section.order}</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {section.content.title || section.content.heading || 'Custom content'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleVisibility(section)}
                    title={section.visible ? 'Hide section' : 'Show section'}
                  >
                    {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(section)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(section.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PageBuilderManagement;
