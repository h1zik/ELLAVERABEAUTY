import React, { useState, useEffect } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../layout/LoadingSpinner';
import { useSettings } from '../../context/SettingsContext';

const SiteSettingsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [settings, setSettings] = useState({});
  const { refreshSettings } = useSettings();

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
      // Refresh settings globally so Header updates immediately
      await refreshSettings();
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
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
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
              <Label>Logo Image</Label>
              <div className="mt-2 space-y-3">
                {settings.logo_url && (
                  <div className="relative inline-block">
                    <img
                      src={settings.logo_url}
                      alt="Logo"
                      className="h-20 w-auto object-contain border-2 border-slate-200 rounded-lg p-2 bg-white"
                    />
                  </div>
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      if (file.size > 2 * 1024 * 1024) {
                        toast.error('Image size must be less than 2MB');
                        return;
                      }

                      setUploadingLogo(true);
                      try {
                        const response = await api.uploadImage(file);
                        setSettings({ ...settings, logo_url: response.data.data_url });
                        toast.success('Logo uploaded! Click Save to apply.');
                      } catch (error) {
                        toast.error('Failed to upload logo');
                      } finally {
                        setUploadingLogo(false);
                      }
                    }}
                    data-testid="logo-upload-input"
                    className="mt-1"
                    disabled={uploadingLogo}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Upload PNG, JPG or SVG (max 2MB). Recommended size: 200x60px
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label>Logo Text (Fallback)</Label>
              <Input
                value={settings.logo_text || ''}
                onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
                data-testid="logo-text-input"
                className="mt-1"
                placeholder="Used when no logo image is set"
              />
            </div>

            <div>
              <Label>Favicon (Browser Tab Icon)</Label>
              <div className="mt-2 space-y-3">
                {settings.favicon_url && (
                  <div className="relative inline-block">
                    <img
                      src={settings.favicon_url}
                      alt="Favicon"
                      className="h-10 w-10 object-contain border-2 border-slate-200 rounded-lg p-1 bg-white"
                    />
                  </div>
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      if (file.size > 500 * 1024) {
                        toast.error('Favicon size must be less than 500KB');
                        return;
                      }

                      try {
                        const response = await api.uploadImage(file);
                        setSettings({ ...settings, favicon_url: response.data.data_url });
                        toast.success('Favicon uploaded! Click Save to apply.');
                      } catch (error) {
                        toast.error('Failed to upload favicon');
                      }
                    }}
                    data-testid="favicon-upload-input"
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Upload PNG or ICO (max 500KB). Recommended size: 32x32px or 64x64px
                  </p>
                </div>
              </div>
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
            <div>
              <Label>LinkedIn URL</Label>
              <Input
                value={settings.linkedin_url || ''}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/company/yourpage"
                className="mt-1"
              />
            </div>
            <div>
              <Label>YouTube URL</Label>
              <Input
                value={settings.youtube_url || ''}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                placeholder="https://youtube.com/yourpage"
                className="mt-1"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card className="p-6 space-y-6">
            <div>
              <Label>Footer Copyright Text</Label>
              <Input
                value={settings.footer_copyright || ''}
                onChange={(e) => setSettings({ ...settings, footer_copyright: e.target.value })}
                placeholder={`© ${new Date().getFullYear()} ${settings.site_name || 'Your Company'}. All rights reserved.`}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Quick Links Title</Label>
              <Input
                value={settings.footer_links_title || ''}
                onChange={(e) => setSettings({ ...settings, footer_links_title: e.target.value })}
                placeholder="Quick Links"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Services Title</Label>
              <Input
                value={settings.footer_services_title || ''}
                onChange={(e) => setSettings({ ...settings, footer_services_title: e.target.value })}
                placeholder="Our Services"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Contact Title</Label>
              <Input
                value={settings.footer_contact_title || ''}
                onChange={(e) => setSettings({ ...settings, footer_contact_title: e.target.value })}
                placeholder="Contact Us"
                className="mt-1"
              />
            </div>

            {/* Footer Services List */}
            <div>
              <Label>Footer Services List</Label>
              <p className="text-xs text-slate-500 mb-2">Services displayed in the footer (one per line)</p>
              <div className="space-y-2">
                {(settings.footer_services || []).map((service, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={service}
                      onChange={(e) => {
                        const newServices = [...(settings.footer_services || [])];
                        newServices[index] = e.target.value;
                        setSettings({ ...settings, footer_services: newServices });
                      }}
                      placeholder="Service name"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newServices = (settings.footer_services || []).filter((_, i) => i !== index);
                        setSettings({ ...settings, footer_services: newServices });
                      }}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      footer_services: [...(settings.footer_services || []), '']
                    });
                  }}
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add Service
                </Button>
              </div>
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
