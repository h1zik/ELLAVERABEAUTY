import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Trash2, Plus, GripVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../layout/LoadingSpinner';
import ArrayItemEditor from './ArrayItemEditor';

const ContentEditor = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('home');
  const [editingSection, setEditingSection] = useState(null);

  const pages = [
    { value: 'home', label: 'Homepage' },
    { value: 'about', label: 'About Page' }
  ];

  useEffect(() => {
    fetchSections();
  }, [selectedPage]);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await api.getPageSections(selectedPage);
      setSections(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    try {
      await api.updatePageSection(section.id, section);
      toast.success('Content saved successfully!');
      setEditingSection(null);
      fetchSections();
    } catch (error) {
      toast.error('Failed to save content');
    }
  };

  const toggleVisibility = async (section) => {
    try {
      await api.updatePageSection(section.id, { ...section, visible: !section.visible });
      toast.success(section.visible ? 'Section hidden' : 'Section visible');
      fetchSections();
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const renderEditor = (section) => {
    const content = section.content || {};

    switch (section.section_type) {
      case 'hero':
        return (
          <div className="space-y-4">
            {content.badge_text !== undefined && (
              <div>
                <Label>Badge Text</Label>
                <Input
                  value={content.badge_text || ''}
                  onChange={(e) => {
                    section.content.badge_text = e.target.value;
                    setSections([...sections]);
                  }}
                />
              </div>
            )}
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => {
                  section.content.title = e.target.value;
                  setSections([...sections]);
                }}
              />
            </div>
            {content.title_highlight !== undefined && (
              <div>
                <Label>Title Highlight</Label>
                <Input
                  value={content.title_highlight || ''}
                  onChange={(e) => {
                    section.content.title_highlight = e.target.value;
                    setSections([...sections]);
                  }}
                />
              </div>
            )}
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => {
                  section.content.description = e.target.value;
                  setSections([...sections]);
                }}
                rows={3}
              />
            </div>
            {content.cta_primary_text !== undefined && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Button Text</Label>
                    <Input
                      value={content.cta_primary_text || ''}
                      onChange={(e) => {
                        section.content.cta_primary_text = e.target.value;
                        setSections([...sections]);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Primary Button Link</Label>
                    <Input
                      value={content.cta_primary_link || ''}
                      onChange={(e) => {
                        section.content.cta_primary_link = e.target.value;
                        setSections([...sections]);
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Secondary Button Text</Label>
                    <Input
                      value={content.cta_secondary_text || ''}
                      onChange={(e) => {
                        section.content.cta_secondary_text = e.target.value;
                        setSections([...sections]);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Secondary Button Link</Label>
                    <Input
                      value={content.cta_secondary_link || ''}
                      onChange={(e) => {
                        section.content.cta_secondary_link = e.target.value;
                        setSections([...sections]);
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <Label>Heading</Label>
              <Input
                value={content.heading || ''}
                onChange={(e) => {
                  section.content.heading = e.target.value;
                  setSections([...sections]);
                }}
              />
            </div>
            <div>
              <Label>Subheading</Label>
              <Textarea
                value={content.subheading || ''}
                onChange={(e) => {
                  section.content.subheading = e.target.value;
                  setSections([...sections]);
                }}
                rows={2}
              />
            </div>

            <ArrayItemEditor
              title="Features"
              items={content.features || []}
              onChange={(newFeatures) => {
                section.content.features = newFeatures;
                setSections([...sections]);
              }}
              itemTemplate={{ title: '', description: '', icon: 'CheckCircle' }}
              renderItem={(feature, index, updateItem) => (
                <>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={feature.title || ''}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                      placeholder="Feature title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={feature.description || ''}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Feature description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={feature.icon || 'CheckCircle'}
                      onValueChange={(value) => updateItem(index, 'icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CheckCircle">CheckCircle</SelectItem>
                        <SelectItem value="Sparkles">Sparkles</SelectItem>
                        <SelectItem value="Star">Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            />
          </div>
        );

      case 'services':
        return (
          <div className="space-y-4">
            <div>
              <Label>Heading</Label>
              <Input
                value={content.heading || ''}
                onChange={(e) => {
                  section.content.heading = e.target.value;
                  setSections([...sections]);
                }}
              />
            </div>
            <div>
              <Label>Subheading</Label>
              <Textarea
                value={content.subheading || ''}
                onChange={(e) => {
                  section.content.subheading = e.target.value;
                  setSections([...sections]);
                }}
                rows={2}
              />
            </div>
            {content.services && content.services.map((service, index) => (
              <Card key={index} className="p-4 bg-slate-50">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Service Name"
                    value={service.name || ''}
                    onChange={(e) => {
                      section.content.services[index].name = e.target.value;
                      setSections([...sections]);
                    }}
                  />
                  <Input
                    placeholder="Description"
                    value={service.description || ''}
                    onChange={(e) => {
                      section.content.services[index].description = e.target.value;
                      setSections([...sections]);
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        );

      case 'process':
        return (
          <div className="space-y-4">
            <div>
              <Label>Heading</Label>
              <Input
                value={content.heading || ''}
                onChange={(e) => {
                  section.content.heading = e.target.value;
                  setSections([...sections]);
                }}
              />
            </div>
            <div>
              <Label>Subheading</Label>
              <Textarea
                value={content.subheading || ''}
                onChange={(e) => {
                  section.content.subheading = e.target.value;
                  setSections([...sections]);
                }}
                rows={2}
              />
            </div>
            {content.steps && content.steps.map((step, index) => (
              <Card key={index} className="p-4 bg-slate-50">
                <h4 className="font-semibold mb-3">Step {step.step}</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Title"
                    value={step.title || ''}
                    onChange={(e) => {
                      section.content.steps[index].title = e.target.value;
                      setSections([...sections]);
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={step.description || ''}
                    onChange={(e) => {
                      section.content.steps[index].description = e.target.value;
                      setSections([...sections]);
                    }}
                    rows={2}
                  />
                </div>
              </Card>
            ))}
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <Label>Heading</Label>
              <Input
                value={content.heading || ''}
                onChange={(e) => {
                  section.content.heading = e.target.value;
                  setSections([...sections]);
                }}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => {
                  section.content.description = e.target.value;
                  setSections([...sections]);
                }}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Button Text</Label>
                <Input
                  value={content.button_text || ''}
                  onChange={(e) => {
                    section.content.button_text = e.target.value;
                    setSections([...sections]);
                  }}
                />
              </div>
              <div>
                <Label>Button Link</Label>
                <Input
                  value={content.button_link || ''}
                  onChange={(e) => {
                    section.content.button_link = e.target.value;
                    setSections([...sections]);
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 'text':
      case 'vision_mission':
        return (
          <div className="space-y-4">
            <div>
              <Label>Heading</Label>
              <Input
                value={content.heading || ''}
                onChange={(e) => {
                  section.content.heading = e.target.value;
                  setSections([...sections]);
                }}
              />
            </div>
            {content.paragraphs && (
              <div>
                <Label>Content (one paragraph per line)</Label>
                <Textarea
                  value={content.paragraphs.join('\n\n')}
                  onChange={(e) => {
                    section.content.paragraphs = e.target.value.split('\n\n').filter(p => p.trim());
                    setSections([...sections]);
                  }}
                  rows={6}
                />
              </div>
            )}
            {content.vision && (
              <>
                <Card className="p-4 bg-slate-50">
                  <h4 className="font-semibold mb-3">Vision</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Vision Title"
                      value={content.vision.title || ''}
                      onChange={(e) => {
                        section.content.vision.title = e.target.value;
                        setSections([...sections]);
                      }}
                    />
                    <Textarea
                      placeholder="Vision Text"
                      value={content.vision.text || ''}
                      onChange={(e) => {
                        section.content.vision.text = e.target.value;
                        setSections([...sections]);
                      }}
                      rows={3}
                    />
                  </div>
                </Card>
                <Card className="p-4 bg-slate-50">
                  <h4 className="font-semibold mb-3">Mission</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Mission Title"
                      value={content.mission.title || ''}
                      onChange={(e) => {
                        section.content.mission.title = e.target.value;
                        setSections([...sections]);
                      }}
                    />
                    <Textarea
                      placeholder="Mission Text"
                      value={content.mission.text || ''}
                      onChange={(e) => {
                        section.content.mission.text = e.target.value;
                        setSections([...sections]);
                      }}
                      rows={3}
                    />
                  </div>
                </Card>
              </>
            )}
          </div>
        );

      default:
        return (
          <div>
            <Label>Content (JSON)</Label>
            <Textarea
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  section.content = JSON.parse(e.target.value);
                  setSections([...sections]);
                } catch (err) {
                  // Invalid JSON
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
    <div data-testid="content-editor">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Page Content Editor</h2>
          <p className="text-slate-600">Edit all content on your pages</p>
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

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.id} className={`p-6 ${!section.visible ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{section.section_name}</h3>
                <p className="text-sm text-slate-600">Type: {section.section_type}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleVisibility(section)}
                  title={section.visible ? 'Hide' : 'Show'}
                >
                  {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </Button>
              </div>
            </div>

            {renderEditor(section)}

            <div className="mt-4 pt-4 border-t">
              <Button
                onClick={() => handleSave(section)}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentEditor;
