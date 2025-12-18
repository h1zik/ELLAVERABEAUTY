import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { api } from '../../utils/api';
import { toast } from 'sonner';

const ProofCertificationsEditor = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    try {
      const response = await api.getPageSections('about');
      const proofSection = response.data.find(s => s.section_type === 'proof_certifications');
      if (proofSection) {
        setSection(proofSection);
      } else {
        // Create default section if not exists
        setSection({
          page_name: 'about',
          section_name: 'Proof of Certifications',
          section_type: 'proof_certifications',
          content: {
            heading: 'Proof of Certifications',
            subheading: 'Our official certification documents',
            images: []
          },
          order: 5,
          visible: true
        });
      }
    } catch (error) {
      toast.error('Failed to fetch section');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (section.id) {
        await api.updatePageSection(section.id, section);
      } else {
        const response = await api.createPageSection(section);
        setSection(response.data);
      }
      toast.success('Saved successfully!');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingIndex(index);
    try {
      const response = await api.uploadImage(file);
      const newImages = [...(section.content.images || [])];
      newImages[index] = {
        ...newImages[index],
        image_url: response.data.data_url
      };
      setSection({
        ...section,
        content: { ...section.content, images: newImages }
      });
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const addCertificate = () => {
    const newImages = [...(section.content.images || []), {
      title: '',
      description: '',
      image_url: ''
    }];
    setSection({
      ...section,
      content: { ...section.content, images: newImages }
    });
  };

  const removeCertificate = (index) => {
    const newImages = section.content.images.filter((_, i) => i !== index);
    setSection({
      ...section,
      content: { ...section.content, images: newImages }
    });
  };

  const updateCertificate = (index, field, value) => {
    const newImages = [...section.content.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setSection({
      ...section,
      content: { ...section.content, images: newImages }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-cyan-600" size={32} />
      </div>
    );
  }

  return (
    <div data-testid="proof-certifications-editor">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Proof of Certifications</h2>
          <p className="text-slate-600">Manage certification images for About page</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-cyan-600 hover:bg-cyan-700">
          {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Section Settings */}
      <Card className="p-6 mb-6">
        <h3 className="font-semibold mb-4">Section Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={section.content.heading || ''}
              onChange={(e) => setSection({
                ...section,
                content: { ...section.content, heading: e.target.value }
              })}
              placeholder="Proof of Certifications"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Subheading</Label>
            <Input
              value={section.content.subheading || ''}
              onChange={(e) => setSection({
                ...section,
                content: { ...section.content, subheading: e.target.value }
              })}
              placeholder="Our official certification documents"
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Certificate Images */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Certificate Images</h3>
          <Button onClick={addCertificate} variant="outline" size="sm">
            <Plus size={16} className="mr-1" />
            Add Certificate
          </Button>
        </div>

        {section.content.images?.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <Image size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No certificates added yet</p>
            <Button onClick={addCertificate} variant="outline" size="sm" className="mt-3">
              <Plus size={16} className="mr-1" />
              Add Your First Certificate
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.content.images.map((cert, index) => (
              <Card key={index} className="p-4 border-2 border-slate-200">
                {/* Image Preview */}
                <div className="aspect-[3/4] bg-slate-100 rounded-lg mb-4 relative overflow-hidden">
                  {cert.image_url ? (
                    <img
                      src={cert.image_url}
                      alt={cert.title || `Certificate ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={48} className="text-slate-300" />
                    </div>
                  )}
                  {uploadingIndex === index && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="animate-spin text-cyan-600" size={32} />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="mb-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index)}
                    className="text-sm"
                  />
                </div>

                {/* Title */}
                <div className="mb-3">
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={cert.title || ''}
                    onChange={(e) => updateCertificate(index, 'title', e.target.value)}
                    placeholder="e.g. BPOM Certificate"
                    className="mt-1"
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <Label className="text-xs">Description (optional)</Label>
                  <Input
                    value={cert.description || ''}
                    onChange={(e) => updateCertificate(index, 'description', e.target.value)}
                    placeholder="e.g. Valid until 2025"
                    className="mt-1"
                  />
                </div>

                {/* Remove Button */}
                <Button
                  onClick={() => removeCertificate(index)}
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={14} className="mr-1" />
                  Remove
                </Button>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProofCertificationsEditor;
