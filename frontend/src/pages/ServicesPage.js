import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles, Package, Beaker, Palette, Truck, Shield, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import { updatePageTitle } from '../utils/pageTitle';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { initScrollReveal } from '../utils/scrollReveal';

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
      const sectionsRes = await api.getPageSections('home');
      const servicesSection = sectionsRes.data.find(s => s.section_type === 'services');
      if (servicesSection?.content?.services) {
        setServices(servicesSection.content.services);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default services with icons if none from API
  const defaultServices = [
    {
      icon: Beaker,
      name: 'Product Formulation',
      description: 'Custom formulation development tailored to your brand vision and market needs. Our expert chemists create unique, effective formulas.',
      features: ['Custom formula development', 'Ingredient sourcing', 'Stability testing', 'Safety assessments']
    },
    {
      icon: Package,
      name: 'Private Label Manufacturing',
      description: 'Full-service private label solutions from concept to finished product. Launch your brand with our proven formulations.',
      features: ['Ready-to-market formulas', 'Brand customization', 'Flexible MOQs', 'Quick turnaround']
    },
    {
      icon: Palette,
      name: 'Packaging Design',
      description: 'Creative packaging solutions that make your products stand out on the shelf and appeal to your target market.',
      features: ['Custom packaging design', 'Sustainable options', 'Label design', 'Brand consistency']
    },
    {
      icon: Shield,
      name: 'Quality Assurance',
      description: 'Rigorous quality control processes ensure every product meets the highest standards of safety and efficacy.',
      features: ['GMP compliance', 'Batch testing', 'Documentation', 'Certifications']
    },
    {
      icon: Truck,
      name: 'Fulfillment Services',
      description: 'End-to-end logistics support from warehousing to shipping, ensuring your products reach customers efficiently.',
      features: ['Warehousing', 'Order fulfillment', 'Global shipping', 'Inventory management']
    },
    {
      icon: Award,
      name: 'Regulatory Compliance',
      description: 'Navigate complex regulatory requirements with our expert guidance for domestic and international markets.',
      features: ['FDA compliance', 'EU regulations', 'Product registration', 'Documentation support']
    }
  ];

  const displayServices = services.length > 0 
    ? services.map((s, i) => ({ ...defaultServices[i % defaultServices.length], name: s.name, description: s.description }))
    : defaultServices;

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayServices.map((service, index) => {
              const IconComponent = service.icon || Sparkles;
              return (
                <Card 
                  key={index} 
                  className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-cyan-200 scroll-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                    <IconComponent className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{service.name}</h3>
                  <p className="text-slate-600 mb-6">{service.description}</p>
                  {service.features && (
                    <ul className="space-y-2">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle size={16} className="text-cyan-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              );
            })}
          </div>
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
