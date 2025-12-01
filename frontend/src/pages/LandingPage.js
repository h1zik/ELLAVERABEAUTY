import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Sparkles, Quote } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import { initScrollReveal } from '../utils/scrollReveal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const LandingPage = () => {
  const [clients, setClients] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Initialize scroll reveal after content is loaded
    if (!loading) {
      const timer = setTimeout(() => {
        const observer = initScrollReveal();
        return () => observer.disconnect();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [products, clients, loading]);

  const fetchData = async () => {
    try {
      const [clientsRes, reviewsRes, productsRes, sectionsRes] = await Promise.all([
        api.getClients(),
        api.getReviews(),
        api.getProducts({ featured: true }),
        api.getPageSections('home')
      ]);
      setClients(clientsRes.data);
      setReviews(reviewsRes.data);
      setProducts(productsRes.data.slice(0, 3));
      setSections(sectionsRes.data.filter(s => s.visible).sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load page content');
    } finally {
      setLoading(false);
    }
  };

  const getSection = (sectionType) => {
    return sections.find(s => s.section_type === sectionType);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Get section data
  const heroSection = getSection('hero');
  const featuresSection = getSection('features');
  const servicesSection = getSection('services');
  const processSection = getSection('process');
  const reviewsSection = getSection('reviews');
  const ctaSection = getSection('cta');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {heroSection && (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-cyan-50" data-testid="hero-section">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=1920')] bg-cover bg-center opacity-5"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full mb-6 float-animation">
                <Sparkles size={16} />
                <span className="text-sm font-medium">{heroSection.content.badge_text || 'Premium Cosmetic Manufacturing'}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="hero-title">
                {heroSection.content.title || 'Transform Your Beauty Brand with'}
                <span className="block text-gradient mt-2">{heroSection.content.title_highlight || 'Ellavera Beauty'}</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto" data-testid="hero-description">
                {heroSection.content.description || 'We manufacture premium cosmetic products tailored to your brand vision. From formulation to packaging, we bring your beauty products to life.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={heroSection.content.cta_primary_link || '/products'} data-testid="cta-explore-products">
                  <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg rounded-full">
                    {heroSection.content.cta_primary_text || 'Explore Products'}
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link to={heroSection.content.cta_secondary_link || '/contact'} data-testid="cta-get-quote">
                  <Button size="lg" variant="outline" className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 px-8 py-6 text-lg rounded-full">
                    {heroSection.content.cta_secondary_text || 'Get a Quote'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-cyan-600 rounded-full flex items-start justify-center p-1">
              <div className="w-1 h-3 bg-cyan-600 rounded-full"></div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      {featuresSection && (
        <section className="py-20 bg-white" data-testid="why-choose-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 scroll-fade-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {featuresSection.content.heading && (
                  <>
                    {featuresSection.content.heading.split(' ').slice(0, -2).join(' ')}{' '}
                    <span className="text-gradient">{featuresSection.content.heading.split(' ').slice(-2).join(' ')}</span>
                  </>
                )}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {featuresSection.content.subheading || 'We combine expertise, quality, and innovation to create exceptional cosmetic products'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresSection.content.features?.map((feature, index) => {
                const iconMap = {
                  CheckCircle: CheckCircle,
                  Sparkles: Sparkles,
                  Star: Star
                };
                const IconComponent = iconMap[feature.icon] || CheckCircle;
                
                return (
                  <Card key={index} className="p-8 hover:shadow-xl transition-shadow scroll-scale border-none shadow-md">
                    <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                      <IconComponent className="text-cyan-600" size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {servicesSection && (
        <section className="py-20 bg-gradient-to-b from-cyan-50 to-white" data-testid="services-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 scroll-fade-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {servicesSection.content.heading && (
                  <>
                    {servicesSection.content.heading.split(' ').slice(0, -1).join(' ')}{' '}
                    <span className="text-gradient">{servicesSection.content.heading.split(' ').slice(-1)}</span>
                  </>
                )}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {servicesSection.content.subheading || 'Comprehensive solutions for all your cosmetic manufacturing needs'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesSection.content.services?.map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow scroll-fade-up">
                  <h3 className="text-lg font-semibold text-cyan-600 mb-2">{service.name}</h3>
                  <p className="text-sm text-slate-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Timeline */}
      {processSection && (
        <section className="py-20 bg-white" data-testid="process-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 scroll-fade-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Our <span className="text-gradient">{processSection.content.heading?.replace('Our ', '') || 'Process'}</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {processSection.content.subheading || 'A streamlined approach from concept to final product'}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {processSection.content.steps?.map((item, index) => (
                <div key={index} className={`flex gap-6 mb-8 ${index % 2 === 0 ? 'scroll-fade-left' : 'scroll-fade-right'}`}>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-grow pt-2">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-cyan-50 to-white" data-testid="featured-products-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 scroll-fade-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Featured <span className="text-gradient">Products</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover our premium cosmetic product range
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <Card key={product.id} className="product-card overflow-hidden scroll-scale border-none shadow-lg">
                  <div className="aspect-square bg-gradient-to-br from-cyan-100 to-cyan-50 image-overlay">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cyan-600">
                        <Sparkles size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-cyan-600 font-medium mb-2">{product.category_name}</p>
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <Link to={`/products/${product.id}`}>
                      <Button variant="outline" className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/products">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 rounded-full">
                  View All Products
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Clients Section */}
      {clients.length > 0 && (
        <section className="py-20 bg-white" data-testid="clients-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 scroll-reveal">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Trusted by <span className="text-gradient">Leading Brands</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Join the brands that trust us for their cosmetic manufacturing
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center">
              {clients.map((client, index) => (
                <div key={client.id} className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all scroll-reveal" style={{ animationDelay: `${index * 0.05}s` }}>
                  <img src={client.logo_url} alt={client.name} className="max-h-16 w-auto" />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/clients">
                <Button variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">
                  View All Clients
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {ctaSection && (
        <section className="py-20 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white" data-testid="cta-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {ctaSection.content.heading || 'Ready to Launch Your Beauty Brand?'}
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              {ctaSection.content.description || "Let's discuss how we can bring your cosmetic product vision to life"}
            </p>
            <Link to={ctaSection.content.button_link || '/contact'} data-testid="cta-contact-button">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-slate-100 px-8 py-6 text-lg rounded-full">
                {ctaSection.content.button_text || 'Contact Us Today'}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
