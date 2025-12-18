import React, { useState, useEffect } from 'react';
import { Save, FileText, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { api } from '../../utils/api';
import { toast } from 'sonner';

const defaultPageTitles = {
  products: { title: "Our Products", subtitle: "Discover our range of quality products" },
  services: { title: "Our Services", subtitle: "Professional solutions for your needs" },
  articles: { title: "Articles & News", subtitle: "Latest updates and insights" },
  gallery: { title: "Gallery", subtitle: "See our work and facilities" },
  clients: { title: "Our Clients", subtitle: "Trusted by leading brands" },
  contact: { title: "Contact Us", subtitle: "Get in touch with our team" },
  about: { title: "About Us", subtitle: "Learn more about our company" }
};

const pageLabels = {
  products: "Products Page",
  services: "Services Page",
  articles: "Articles Page",
  gallery: "Gallery Page",
  clients: "Clients Page",
  contact: "Contact Page",
  about: "About Page"
};

const PageTitlesEditor = () => {
  const [pageTitles, setPageTitles] = useState(defaultPageTitles);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.getSettings();
      if (response.data.page_titles) {
        setPageTitles({ ...defaultPageTitles, ...response.data.page_titles });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSettings({ page_titles: pageTitles });
      toast.success('Page titles saved successfully!');
    } catch (error) {
      toast.error('Failed to save page titles');
    } finally {
      setSaving(false);
    }
  };

  const updatePageTitle = (page, field, value) => {
    setPageTitles(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-cyan-600" size={32} />
      </div>
    );
  }

  return (
    <div data-testid="page-titles-editor">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Page Titles</h2>
          <p className="text-slate-600 text-sm sm:text-base">Customize title and subtitle for each page</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-cyan-600 hover:bg-cyan-700">
          {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {Object.keys(defaultPageTitles).map((pageKey) => (
          <Card key={pageKey} className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <FileText className="text-cyan-600" size={20} />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">{pageLabels[pageKey]}</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Page Title</Label>
                <Input
                  value={pageTitles[pageKey]?.title || ''}
                  onChange={(e) => updatePageTitle(pageKey, 'title', e.target.value)}
                  placeholder={`Enter ${pageLabels[pageKey]} title`}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm">Subtitle / Description</Label>
                <Input
                  value={pageTitles[pageKey]?.subtitle || ''}
                  onChange={(e) => updatePageTitle(pageKey, 'subtitle', e.target.value)}
                  placeholder="Enter short description"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PageTitlesEditor;
