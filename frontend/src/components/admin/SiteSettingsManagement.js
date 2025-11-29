import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../layout/LoadingSpinner';

const SiteSettingsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.getSettings();
      setSettings(response.data);
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div data-testid="site-settings-management">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Site Settings</h2>
        <p className="text-slate-600">Customize your website's global settings and content</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6 space-y-6">
            <div>
              <Label>Site Name</Label>
              <Input
                value={settings.site_name || ''}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                data-testid="site-name-input"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Site Tagline</Label>
              <Input
                value={settings.site_tagline || ''}
                onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                data-testid="site-tagline-input"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Logo Text</Label>
              <Input
                value={settings.logo_text || ''}
                onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
                data-testid="logo-text-input"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Footer Description</Label>
              <Textarea
                value={settings.footer_text || ''}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                data-testid="footer-text-input"
                rows={3}
                className="mt-1"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="p-6 space-y-6">
            <div>
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                data-testid="contact-email-input"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input
                value={settings.contact_phone || ''}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                data-testid="contact-phone-input"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={settings.contact_address || ''}
                onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                data-testid="contact-address-input"
                className="mt-1"
              />
            </div>
            <div>
              <Label>WhatsApp Number (with country code)</Label>
              <Input
                value={settings.whatsapp_number || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                data-testid="whatsapp-number-input"
                placeholder="6281234567890"
                className="mt-1"
              />
            </div>
            <div>
              <Label>WhatsApp Default Message</Label>
              <Textarea
                value={settings.whatsapp_message || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp_message: e.target.value })}
                data-testid="whatsapp-message-input"
                rows={2}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Google Maps Embed URL</Label>
              <Textarea
                value={settings.google_maps_url || ''}
                onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })}
                data-testid="google-maps-input"
                rows={3}
                className="mt-1"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="p-6 space-y-6">
            <div>
              <Label>Facebook URL</Label>
              <Input
                value={settings.facebook_url || ''}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                data-testid="facebook-url-input"
                placeholder="https://facebook.com/yourpage"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input
                value={settings.instagram_url || ''}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                data-testid="instagram-url-input"
                placeholder="https://instagram.com/yourpage"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Twitter URL</Label>
              <Input
                value={settings.twitter_url || ''}
                onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                data-testid="twitter-url-input"
                placeholder="https://twitter.com/yourpage"
                className="mt-1"
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-cyan-600 hover:bg-cyan-700 px-8"
          data-testid="save-settings-button"
        >
          <Save size={20} className="mr-2" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
};

export default SiteSettingsManagement;
