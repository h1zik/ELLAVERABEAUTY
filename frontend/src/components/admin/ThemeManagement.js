import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'sonner';

const ThemeManagement = () => {
  const { theme, updateTheme } = useTheme();
  const [formData, setFormData] = useState({
    primary_color: theme.primary_color,
    accent_color: theme.accent_color,
    background_color: theme.background_color,
    text_color: theme.text_color,
    heading_font: theme.heading_font,
    body_font: theme.body_font
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateTheme(formData);
    setIsSaving(false);
    
    if (result.success) {
      toast.success('Theme updated successfully');
    } else {
      toast.error('Failed to update theme');
    }
  };

  return (
    <div data-testid="theme-management">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Theme Customization</h2>
        <p className="text-slate-600">Customize your website's colors and fonts</p>
      </div>

      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="theme-form">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Colors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Primary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-20 h-10"
                    data-testid="primary-color-input"
                  />
                  <Input
                    type="text"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label>Accent Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="w-20 h-10"
                    data-testid="accent-color-input"
                  />
                  <Input
                    type="text"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label>Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    className="w-20 h-10"
                    data-testid="background-color-input"
                  />
                  <Input
                    type="text"
                    value={formData.background_color}
                    onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label>Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="w-20 h-10"
                    data-testid="text-color-input"
                  />
                  <Input
                    type="text"
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Typography</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Heading Font</Label>
                <Input
                  value={formData.heading_font}
                  onChange={(e) => setFormData({ ...formData, heading_font: e.target.value })}
                  placeholder="Playfair Display"
                  data-testid="heading-font-input"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Body Font</Label>
                <Input
                  value={formData.body_font}
                  onChange={(e) => setFormData({ ...formData, body_font: e.target.value })}
                  placeholder="Inter"
                  data-testid="body-font-input"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 px-8"
            disabled={isSaving}
            data-testid="save-theme-button"
          >
            <Save size={20} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ThemeManagement;
