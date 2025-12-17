import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Sparkles, Quote } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import { initScrollReveal } from '../utils/scrollReveal';
import { updatePageTitle } from '../utils/pageTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const LandingPage = () => {
  const [clients, setClients] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    updatePageTitle();
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
      const [clientsRes, reviewsRes, productsRes, articlesRes, sectionsRes] = await Promise.all([
        api.getClients(),
        api.getReviews(),
        api.getProducts({ featured: true }),
        api.getArticles({}),
        api.getPageSections('home')
      ]);
      setClients(clientsRes.data);
      setReviews(reviewsRes.data);
      setProducts(productsRes.data.slice(0, 3));
      setArticles(articlesRes.data.slice(0, 3));
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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
          {/* Background Layer */}
          {heroSection.content.background_type === 'video' && heroSection.content.background_video ? (
            <>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ zIndex: 0 }}
              >
                <source src={heroSection.content.background_video} type="video/mp4" />
              </video>
              <div 
                className="absolute inset-0 bg-black"
                style={{ 
                  zIndex: 1,
                  opacity: heroSection.content.background_overlay || 0.3 
                }}
              ></div>
            </>
          ) : heroSection.content.background_type === 'carousel' && heroSection.content.background_carousel?.length > 0 ? (
            <>
              <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <Swiper
                  modules={[Autoplay, EffectFade]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  speed={1500}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                  }}
                  loop={heroSection.content.background_carousel.length > 1}
                  style={{ height: '100%', width: '100%' }}
                >
                  {heroSection.content.background_carousel.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ 
                          backgroundImage: `url(${image})`,
                          height: '100vh',
                          width: '100vw'
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div 
                className="absolute inset-0 bg-black"
                style={{ 
                  zIndex: 1,
                  opacity: heroSection.content.background_overlay || 0.3 
                }}
              ></div>
            </>
          ) : (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${heroSection.content.background_image || 'https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=1920&q=80'})`,
                  zIndex: 0
                }}
              ></div>
              <div 
                className="absolute inset-0 bg-black"
                style={{ 
                  zIndex: 1,
                  opacity: heroSection.content.background_overlay || 0.3 
                }}
              ></div>
            </>
          )}
          
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

            <div 
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
                featuresSection.content.features?.length === 1 ? 'lg:grid-cols-1 max-w-md mx-auto' :
                featuresSection.content.features?.length === 2 ? 'lg:grid-cols-2 max-w-3xl mx-auto' :
                featuresSection.content.features?.length === 3 ? 'lg:grid-cols-3' :
                featuresSection.content.features?.length === 4 ? 'lg:grid-cols-2 xl:grid-cols-4' :
                'lg:grid-cols-3'
              }`}
            >
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

            <div 
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
                servicesSection.content.services?.length === 1 ? 'lg:grid-cols-1 max-w-md mx-auto' :
                servicesSection.content.services?.length === 2 ? 'lg:grid-cols-2 max-w-2xl mx-auto' :
                servicesSection.content.services?.length === 3 ? 'lg:grid-cols-3 max-w-4xl mx-auto' :
                'lg:grid-cols-4'
              }`}
            >
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

      {/* Process Flow Diagram */}
      {processSection && (
        <section className="py-20 bg-gradient-to-b from-white to-cyan-50" data-testid="process-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 scroll-fade-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Our <span className="text-gradient">{processSection.content.heading?.replace('Our ', '') || 'Process'}</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {processSection.content.subheading || 'A streamlined approach from concept to final product'}
              </p>
            </div>

            {/* Desktop Flow Diagram */}
            <div className="hidden lg:block max-w-7xl mx-auto">
              <div className="relative">
                {/* Connection Lines */}
                <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600" style={{ top: '5rem' }}></div>
                
                {/* Steps */}
                <div className="grid grid-cols-3 gap-8">
                  {processSection.content.steps?.slice(0, 6).map((item, index) => (
                    <div key={index} className="relative scroll-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                      {/* Arrow */}
                      {index < processSection.content.steps.length - 1 && index % 3 !== 2 && (
                        <div className="absolute -right-4 top-16 z-10">
                          <ArrowRight className="text-cyan-600" size={32} />
                        </div>
                      )}
                      
                      {/* Card with Badge */}
                      <div className="relative pt-6 pl-6">
                        {/* Step Number Badge - outside card for visibility */}
                        <div className="absolute top-0 left-0 w-14 h-14 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-full flex items-center justify-center shadow-lg z-10">
                          <span className="text-white text-xl font-bold">{item.step}</span>
                        </div>
                        
                        <Card className="border-2 border-cyan-100 hover:border-cyan-400 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                          <div className="pt-6 pb-6 px-6">
                            <h3 className="text-xl font-bold mb-3 text-slate-800">{item.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                          </div>
                          {/* Accent Line */}
                          <div className="h-1 bg-gradient-to-r from-cyan-400 to-cyan-600"></div>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Vertical Flow */}
            <div className="lg:hidden max-w-2xl mx-auto">
              {processSection.content.steps?.map((item, index) => (
                <div key={index} className="relative scroll-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Connection Line */}
                  {index < processSection.content.steps.length - 1 && (
                    <div className="absolute left-8 top-20 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-cyan-600 -z-10"></div>
                  )}
                  
                  <div className="flex gap-4 mb-6">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                        {item.step}
                      </div>
                    </div>
                    
                    {/* Content Card */}
                    <Card className="flex-1 p-6 border-2 border-cyan-100 hover:border-cyan-400 transition-all bg-white">
                      <h3 className="text-xl font-bold mb-2 text-slate-800">{item.title}</h3>
                      <p className="text-slate-600 text-sm">{item.description}</p>
                      <div className="mt-4 h-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full"></div>
                    </Card>
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

      {/* Clients Section with Auto-Slide */}
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

            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={2}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 }
              }}
              className="pb-16"
              style={{ paddingBottom: '3rem' }}
            >
              {clients.map((client) => (
                <SwiperSlide key={client.id}>
                  <div className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all h-24">
                    <img src={client.logo_url} alt={client.name} className="max-h-16 w-auto" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="text-center mt-8">
              <Link to="/clients">
                <Button variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">
                  View All Clients
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Reviews/Testimonials Section */}
      {reviewsSection && reviews.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-cyan-50 to-white" data-testid="reviews-section">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 scroll-fade-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {reviewsSection.content.heading || 'What Our Clients Say'}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {reviewsSection.content.subheading || 'Trusted by leading beauty brands worldwide'}
              </p>
            </div>

            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              loop={reviews.length >= 3}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 }
              }}
              className="pb-16"
              style={{ paddingBottom: '3rem' }}
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id}>
                  <Card className="p-8 h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                    <Quote className="text-cyan-600 mb-4" size={32} />
                    <p className="text-slate-700 mb-6 italic line-clamp-4">"{review.review_text}"</p>
                    
                    <div className="flex items-center gap-4 mt-auto">
                      {review.photo_url && (
                        <img
                          src={review.photo_url}
                          alt={review.customer_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{review.customer_name}</p>
                        {review.position && (
                          <p className="text-sm text-slate-600">
                            {review.position}{review.company ? ` - ${review.company}` : ''}
                          </p>
                        )}
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
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
