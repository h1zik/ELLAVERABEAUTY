import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles, Package, Beaker, Palette, Truck, Shield, Award, Leaf, Heart, Star, Zap, Target, Layers, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import { updatePageTitle } from '../utils/pageTitle';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { initScrollReveal } from '../utils/scrollReveal';

// Icon mapping
const iconMap = {
  Sparkles, Beaker, Package, Palette, Truck, Shield, 
  Award, Leaf, Heart, Star, Zap, Target, Layers, Settings
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updatePageTitle('Services');
    fetchServices();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        const observer = initScrollReveal();
        return () => observer.disconnect();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const fetchServices = async () => {
    try {
      const response = await api.getServices({});
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="services-page">
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="services-title">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive cosmetic manufacturing solutions from concept to delivery
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-medium text-slate-600 mb-2">No Services Available</h3>
              <p className="text-slate-500">Check back later for our service offerings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Sparkles;
                return (
                  <Link to={`/services/${service.id}`} key={service.id}>
                    <Card 
                      className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-cyan-200 scroll-fade-up h-full group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <IconComponent className="text-white" size={28} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-cyan-600 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-slate-600 mb-6">{service.short_description}</p>
                      {service.features && service.features.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {service.features.slice(0, 4).map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-center gap-2 text-sm text-slate-600">
                              <CheckCircle size={16} className="text-cyan-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex items-center text-cyan-600 font-medium group-hover:gap-2 transition-all">
                        Learn More 
                        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Ellavera Beauty?</h2>
            <p className="text-cyan-100 max-w-2xl mx-auto">
              We combine expertise, innovation, and dedication to help bring your beauty brand vision to life
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-cyan-100">Years of Experience</div>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-cyan-100">Products Developed</div>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-cyan-100">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how our services can help bring your cosmetic product ideas to life
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 rounded-full">
              Get in Touch
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
