import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="contact-page">
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="contact-title">
            <span className="text-gradient">Contact Us</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Let's discuss how we can help bring your cosmetic brand to life
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-none shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-cyan-100 p-3 rounded-lg">
                  <MapPin className="text-cyan-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Address</h3>
                  <p className="text-slate-600">Jakarta, Indonesia</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-cyan-100 p-3 rounded-lg">
                  <Phone className="text-cyan-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <p className="text-slate-600">+62 123 456 7890</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-cyan-100 p-3 rounded-lg">
                  <Mail className="text-cyan-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-slate-600">info@ellavera.com</p>
                </div>
              </div>
            </Card>

            {/* Map */}
            <Card className="p-0 overflow-hidden border-none shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.65833061103!2d106.68942995!3d-6.229386599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Location Map"
              ></iframe>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-none shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      data-testid="contact-name-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      data-testid="contact-email-input"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      data-testid="contact-phone-input"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      data-testid="contact-company-input"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    data-testid="contact-message-input"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  data-testid="contact-submit-button"
                  size="lg"
                  className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white px-12"
                  disabled={isSubmitting}
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
      </div>
    </div>
  );
};

export default ContactPage;
