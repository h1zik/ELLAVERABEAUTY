import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import { updatePageTitle } from '../utils/pageTitle';
import { toast } from 'sonner';

const ContactPage = () => {
  const [sections, setSections] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    updatePageTitle('Contact Us');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sectionsRes, settingsRes] = await Promise.all([
        api.getPageSections('contact'),
        api.getSettings()
      ]);
      setSections(sectionsRes.data.filter(s => s.visible).sort((a, b) => a.order - b.order));
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Failed to fetch contact page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSection = (sectionType) => {
    return sections.find(s => s.section_type === sectionType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.submitContact(formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const heroSection = getSection('hero');
  const mapSection = getSection('map');

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="contact-page">
      {/* Hero */}
      {heroSection && (
        <section className="bg-gradient-to-br from-primary-light to-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="contact-title">
              {heroSection.content.title && (
                <>
                  {heroSection.content.title}{' '}
                  <span className="text-gradient">{heroSection.content.title_highlight || 'Contact Us'}</span>
                </>
              )}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {heroSection.content.description || "Let's discuss how we can help bring your cosmetic brand to life"}
            </p>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          {settings && (
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 border-none shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-light p-3 rounded-lg">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Address</h3>
                    <p className="text-slate-600">{settings.contact_address || 'Jakarta, Indonesia'}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-none shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-light p-3 rounded-lg">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-slate-600">{settings.contact_phone || '+62 123 456 7890'}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-none shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-light p-3 rounded-lg">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-slate-600">{settings.contact_email || 'info@ellavera.com'}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-none shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="contact-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      data-testid="contact-email-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      data-testid="contact-phone-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      data-testid="contact-company-input"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    data-testid="contact-message-input"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark"
                  disabled={isSubmitting}
                  data-testid="contact-submit-button"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send size={20} className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Map Section - Uses google_maps_url from Site Settings */}
        {settings?.google_maps_url && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">{mapSection?.content?.heading || 'Visit Our Office'}</h2>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={settings.google_maps_url}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
