import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, GripVertical, Edit2, Save, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../layout/LoadingSpinner';

const PageBuilderManagement = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const pages = [
    { value: 'home', label: 'Homepage' },
    { value: 'about', label: 'About Page' },
    { value: 'contact', label: 'Contact Page' }
  ];

  useEffect(() => {
    fetchSections();
  }, [selectedPage]);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await api.getPageSections(selectedPage);
      const sortedSections = response.data.sort((a, b) => a.order - b.order);
      setSections(sortedSections);
    } catch (error) {
      toast.error('Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setSections(updatedItems);

    // Save new order to backend
    try {
      await Promise.all(
        updatedItems.map(item =>
          api.updatePageSection(item.id, {
            page_name: item.page_name,
            section_name: item.section_name,
            section_type: item.section_type,
            content: item.content,
            order: item.order,
            visible: item.visible
          })
        )
      );
      toast.success('Section order updated successfully');
    } catch (error) {
      toast.error('Failed to update section order');
      fetchSections(); // Revert on error
    }
  };

  const toggleVisibility = async (section) => {
    const updatedSection = { ...section, visible: !section.visible };
    
    try {
      await api.updatePageSection(section.id, {
        page_name: updatedSection.page_name,
        section_name: updatedSection.section_name,
        section_type: updatedSection.section_type,
        content: updatedSection.content,
        order: updatedSection.order,
        visible: updatedSection.visible
      });
      
      setSections(sections.map(s => s.id === section.id ? updatedSection : s));
      toast.success(`Section ${updatedSection.visible ? 'shown' : 'hidden'}`);
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData(section.content);
    setIsDialogOpen(true);
  };

  const handleSaveContent = async () => {
    if (!editingSection) return;

    try {
      await api.updatePageSection(editingSection.id, {
        page_name: editingSection.page_name,
        section_name: editingSection.section_name,
        section_type: editingSection.section_type,
        content: formData,
        order: editingSection.order,
        visible: editingSection.visible
      });

      fetchSections();
      setIsDialogOpen(false);
      setEditingSection(null);
      toast.success('Section content updated');
    } catch (error) {
      toast.error('Failed to update content');
    }
  };

  const renderContentEditor = () => {
    if (!editingSection) return null;

    const content = formData;

    return (
      <div className="space-y-4">
        {Object.keys(content).map((key) => {
          const value = content[key];
          
          // Skip complex nested objects
          if (typeof value === 'object' && !Array.isArray(value)) {
            return null;
          }

          return (
            <div key={key}>
              <Label htmlFor={key} className="capitalize">
                {key.replace(/_/g, ' ')}
              </Label>
              {typeof value === 'string' && value.length > 100 ? (
                <Textarea
                  id={key}
                  value={value}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  rows={4}
                />
              ) : (
                <Input
                  id={key}
                  value={value}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                />
              )}
            </div>
          );
        })}  
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Page Builder</h2>
          <p className="text-slate-600">Manage section visibility and order with drag & drop</p>
        </div>
        <div className="w-48">
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pages.map(page => (
                <SelectItem key={page.value} value={page.value}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {sections.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No sections found for this page</p>
                ) : (
                  sections.map((section, index) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white border rounded-lg p-4 flex items-center gap-4 ${
                            snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                          } ${!section.visible ? 'opacity-60' : ''}`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="text-slate-400" size={20} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">
                              {section.section_name}
                            </h3>
                            <p className="text-sm text-slate-500 truncate">
                              {section.section_type} · Order: {section.order}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(section)}
                            >
                              <Edit2 size={16} />
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleVisibility(section)}
                              className={section.visible ? '' : 'text-slate-400'}
                            >
                              {section.visible ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit: {editingSection?.section_name}
            </DialogTitle>
          </DialogHeader>
          
          {renderContentEditor()}

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setEditingSection(null);
              }}
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button
              className="bg-cyan-600 hover:bg-cyan-700"
              onClick={handleSaveContent}
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PageBuilderManagement;
