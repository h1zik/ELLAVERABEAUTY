import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles, Beaker, Package, Palette, Truck, Shield, Award, Leaf, Heart, Star, Zap, Target, Layers, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import { updatePageTitle } from '../utils/pageTitle';
import LoadingSpinner from '../components/layout/LoadingSpinner';

// Icon mapping
const iconMap = {
  Sparkles, Beaker, Package, Palette, Truck, Shield, 
  Award, Leaf, Heart, Star, Zap, Target, Layers, Settings
};

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    try {
      const [serviceRes, allServicesRes] = await Promise.all([
        api.getService(id),
        api.getServices({})
      ]);
      setService(serviceRes.data);
      updatePageTitle(serviceRes.data.name);
      
      // Get related services (excluding current one)
      const related = allServicesRes.data.filter(s => s.id !== id).slice(0, 3);
      setRelatedServices(related);
    } catch (error) {
      setError('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error || !service) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Service Not Found</h1>
          <Link to="/services">
            <Button className="bg-primary hover:bg-primary-dark">
              <ArrowLeft size={16} className="mr-2" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[service.icon] || Sparkles;

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="service-detail-page">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center gap-2 text-cyan-100 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} />
            Back to Services
          </Link>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <IconComponent size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{service.name}</h1>
              <p className="text-xl text-cyan-100 max-w-2xl">{service.short_description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Description */}
            <div className="lg:col-span-2 space-y-8">
              {service.image_url && (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                  <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">About This Service</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{service.description}</p>
                </div>
              </div>

              {service.benefits && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Benefits</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{service.benefits}</p>
                  </div>
                </div>
              )}

              {service.process_steps && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Process</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{service.process_steps}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Features Card */}
              {service.features && service.features.length > 0 && (
                <Card className="p-6 border-2 border-primary-light">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* CTA Card */}
              <Card className="p-6 bg-gradient-to-br from-primary to-primary-dark text-white">
                <h3 className="text-lg font-bold mb-2">Interested in this service?</h3>
                <p className="text-cyan-100 mb-4 text-sm">Let's discuss how we can help your brand grow</p>
                <Link to="/contact">
                  <Button className="w-full bg-white text-primary hover:bg-primary-light">
                    Contact Us
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Other Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((relatedService) => {
                const RelatedIcon = iconMap[relatedService.icon] || Sparkles;
                return (
                  <Link to={`/services/${relatedService.id}`} key={relatedService.id}>
                    <Card className="p-6 hover:shadow-lg transition-all hover:border-primary-light border-2 border-transparent h-full">
                      <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-4">
                        <RelatedIcon size={24} className="text-primary" />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2">{relatedService.name}</h3>
                      <p className="text-slate-600 text-sm line-clamp-2">{relatedService.short_description}</p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceDetailPage;
