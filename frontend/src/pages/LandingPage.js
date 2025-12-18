import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Sparkles, Quote, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import { initScrollReveal } from '../utils/scrollReveal';
import { usePageTitle } from '../hooks/usePageTitle';
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
  const [services, setServices] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Set page title from settings (homepage uses site name - tagline)
  usePageTitle();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
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
      const [clientsRes, reviewsRes, productsRes, articlesRes, servicesRes, sectionsRes] = await Promise.all([
        api.getClients(),
        api.getReviews(),
        api.getProducts({ featured: true }),
        api.getArticles({}),
        api.getServices({ featured: true }),
        api.getPageSections('home')
      ]);
      setClients(clientsRes.data);
      setReviews(reviewsRes.data);
      setProducts(productsRes.data.slice(0, 3));
      setArticles(articlesRes.data.slice(0, 3));
      setServices(servicesRes.data.slice(0, 4));
      // Sort sections by order and filter visible ones
      setSections(sectionsRes.data.filter(s => s.visible).sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load page content');
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Render Hero Section
  const renderHero = (section) => (
    <section key={section.id} className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
      {section.content.background_type === 'video' && section.content.background_video ? (
        <>
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }}>
            <source src={section.content.background_video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black" style={{ zIndex: 1, opacity: section.content.background_overlay || 0.3 }}></div>
        </>
      ) : section.content.background_type === 'carousel' && section.content.background_carousel?.length > 0 ? (
        <>
          <div className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <Swiper modules={[Autoplay, EffectFade]} effect="fade" fadeEffect={{ crossFade: true }} speed={1500} autoplay={{ delay: 4000, disableOnInteraction: false }} loop={section.content.background_carousel.length > 1} style={{ height: '100%', width: '100%' }}>
              {section.content.background_carousel.map((image, idx) => (
                <SwiperSlide key={idx}>
                  <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${image})`, height: '100vh', width: '100vw' }} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="absolute inset-0 bg-black" style={{ zIndex: 1, opacity: section.content.background_overlay || 0.3 }}></div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${section.content.background_image || 'https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=1920&q=80'})`, zIndex: 0 }}></div>
          <div className="absolute inset-0 bg-black" style={{ zIndex: 1, opacity: section.content.background_overlay || 0.3 }}></div>
        </>
      )}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 float-animation" style={{ backgroundColor: section.content.badge_bg_color || '#cffafe', color: section.content.badge_text_color || '#155e75' }}>
            <Sparkles size={16} />
            <span className="text-sm font-medium">{section.content.badge_text || 'Premium Cosmetic Manufacturing'}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="hero-title" style={{ color: section.content.title_color || '#ffffff' }}>
            {section.content.title || 'Transform Your Beauty Brand with'}
            <span className="block mt-2 text-primary" style={section.content.title_highlight_color ? { color: section.content.title_highlight_color } : undefined}>
              {section.content.title_highlight || 'Ellavera Beauty'}
            </span>
          </h1>
          
          <p className="text-base sm:text-lg mb-8 max-w-2xl mx-auto" data-testid="hero-description" style={{ color: section.content.description_color || '#e2e8f0' }}>
            {section.content.description || 'We manufacture premium cosmetic products tailored to your brand vision.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={section.content.cta_primary_link || '/products'}>
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-lg rounded-full">
                {section.content.cta_primary_text || 'Explore Products'}
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to={section.content.cta_secondary_link || '/contact'}>
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary-light px-8 py-6 text-lg rounded-full">
                {section.content.cta_secondary_text || 'Get a Quote'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-3 bg-primary rounded-full"></div>
        </div>
      </div>
    </section>
  );

  // Render Features Section
  const renderFeatures = (section, bgClass) => (
    <section key={section.id} className={`py-20 ${bgClass} border-t border-slate-200`} data-testid="why-choose-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {section.content.heading ? (
              <>{section.content.heading.split(' ').slice(0, -2).join(' ')} <span className="text-gradient">{section.content.heading.split(' ').slice(-2).join(' ')}</span></>
            ) : (<>Why Choose <span className="text-gradient">Us</span></>)}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{section.content.subheading || 'We combine expertise, quality, and innovation'}</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${section.content.features?.length === 3 ? 'lg:grid-cols-3' : section.content.features?.length === 4 ? 'lg:grid-cols-2 xl:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {section.content.features?.map((feature, index) => {
            const iconMap = { CheckCircle, Sparkles, Star };
            const IconComponent = iconMap[feature.icon] || CheckCircle;
            return (
              <Card key={index} className="p-8 hover:shadow-xl transition-shadow scroll-scale border-none shadow-md">
                <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <IconComponent className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );

  // Render Services Section
  const renderServices = (section, bgClass) => {
    if (services.length === 0) return null;
    return (
      <section key={section.id} className={`py-20 ${bgClass} border-t border-slate-200`} data-testid="services-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {section.content.heading ? (
                <>{section.content.heading.split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{section.content.heading.split(' ').slice(-1)}</span></>
              ) : (<>Our <span className="text-gradient">Services</span></>)}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{section.content.subheading || 'Comprehensive solutions for all your needs'}</p>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${services.length <= 2 ? 'lg:grid-cols-2 max-w-2xl mx-auto' : services.length === 3 ? 'lg:grid-cols-3 max-w-4xl mx-auto' : 'lg:grid-cols-4'}`}>
            {services.map((service) => (
              <Link to={`/services/${service.id}`} key={service.id}>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all scroll-fade-up group hover:border-primary-light border-2 border-transparent h-full">
                  <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-primary-dark">{service.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{service.short_description}</p>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Learn More <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary-light px-8 rounded-full">View All Services <ArrowRight className="ml-2" size={20} /></Button>
            </Link>
          </div>
        </div>
      </section>
    );
  };

  // Render Process Section
  const renderProcess = (section, bgClass) => (
    <section key={section.id} className={`py-20 ${bgClass} border-t border-slate-200`} data-testid="process-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 scroll-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Our <span className="text-gradient">{section.content.heading?.replace('Our ', '') || 'Process'}</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{section.content.subheading || 'A streamlined approach from concept to final product'}</p>
        </div>

        <div className="hidden lg:block max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {section.content.steps?.slice(0, 6).map((item, index) => (
              <div key={index} className="scroll-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative pt-4 pl-4">
                  <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-white text-lg font-bold">{item.step}</span>
                  </div>
                  <Card className="border-2 border-primary-light hover:border-primary hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                    <div className="pt-6 pb-6 px-6">
                      <h3 className="text-xl font-bold mb-3 text-slate-800">{item.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-primary to-primary"></div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:hidden max-w-2xl mx-auto">
          {section.content.steps?.map((item, index) => (
            <div key={index} className="relative scroll-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              {index < section.content.steps.length - 1 && (
                <div className="absolute left-8 top-20 bottom-0 w-1 bg-gradient-to-b from-primary to-primary -z-10"></div>
              )}
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">{item.step}</div>
                </div>
                <Card className="flex-1 p-6 border-2 border-primary-light hover:border-primary transition-all bg-white">
                  <h3 className="text-xl font-bold mb-2 text-slate-800">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                  <div className="mt-4 h-1 bg-gradient-to-r from-primary to-primary rounded-full"></div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Render Products Section
  const renderProducts = (section, bgClass) => {
    if (products.length === 0) return null;
    return (
      <section key={section.id} className={`py-20 ${bgClass} border-t border-slate-200`} data-testid="featured-products-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {section.content.heading ? (
                <>{section.content.heading.split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{section.content.heading.split(' ').slice(-1)}</span></>
              ) : (<>Featured <span className="text-gradient">Products</span></>)}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{section.content.subheading || 'Discover our premium cosmetic product range'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="product-card overflow-hidden scroll-scale border-none shadow-lg">
                <div className="aspect-square bg-gradient-to-br from-primary-light to-primary-light image-overlay">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary"><Sparkles size={48} /></div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-sm text-primary font-medium mb-2">{product.category_name}</p>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <Link to={`/products/${product.id}`}>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary-light">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white px-8 rounded-full">View All Products <ArrowRight className="ml-2" size={20} /></Button>
            </Link>
          </div>
        </div>
      </section>
    );
  };

  // Render Clients Section
  const renderClients = (section, bgClass) => {
    if (clients.length === 0) return null;
    return (
      <section key={section.id} className={`py-20 ${bgClass} border-t border-slate-200`} data-testid="clients-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {section.content.heading ? (
                <>{section.content.heading.split(' ').slice(0, -2).join(' ')} <span className="text-gradient">{section.content.heading.split(' ').slice(-2).join(' ')}</span></>
              ) : (<>Trusted by <span className="text-gradient">Leading Brands</span></>)}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{section.content.subheading || 'Join the brands that trust us'}</p>
          </div>

          <Swiper modules={[Autoplay, Pagination]} spaceBetween={30} slidesPerView={2} loop={true} autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }} pagination={{ clickable: true, dynamicBullets: true }} breakpoints={{ 640: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 } }} className="pb-16" style={{ paddingBottom: '3rem' }}>
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
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-light">View All Clients</Button>
            </Link>
          </div>
        </div>
      </section>
    );
  };

  // Render Reviews Section
  const renderReviews = (section, bgClass) => {
    if (reviews.length === 0) return null;
    return (
      <section key={section.id} className={`py-20 ${bgClass} border-t border-slate-200`} data-testid="reviews-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{section.content.heading || 'What Our Clients Say'}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{section.content.subheading || 'Trusted by leading beauty brands worldwide'}</p>
          </div>

          <Swiper modules={[Autoplay, Pagination]} spaceBetween={30} slidesPerView={1} loop={reviews.length >= 3} autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }} pagination={{ clickable: true, dynamicBullets: true }} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 2 } }} className="pb-16" style={{ paddingBottom: '3rem' }}>
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <Card className="p-8 h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                  <Quote className="text-primary mb-4" size={32} />
                  <p className="text-slate-700 mb-6 italic line-clamp-4">"{review.review_text}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    {review.photo_url && <img src={review.photo_url} alt={review.customer_name} className="w-12 h-12 rounded-full object-cover" />}
                    <div>
                      <p className="font-semibold">{review.customer_name}</p>
                      {review.position && <p className="text-sm text-slate-600">{review.position}{review.company ? ` - ${review.company}` : ''}</p>}
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} className={star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
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
    );
  };

  // Render Articles Section
  const renderArticles = (section, bgClass) => {
    if (articles.length === 0) return null;
    return (
      <section key={section.id} className={`py-20 ${bgClass} border-t border-slate-200`} data-testid="articles-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 scroll-fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {section.content.heading ? (
                <>{section.content.heading.split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{section.content.heading.split(' ').slice(-1)}</span></>
              ) : (<>Latest <span className="text-gradient">Articles</span></>)}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{section.content.subheading || 'Insights and tips from our experts'}</p>
          </div>

          <div className={`grid grid-cols-1 gap-8 ${articles.length === 1 ? 'md:grid-cols-1 max-w-lg mx-auto' : articles.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
            {articles.map((article, index) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 scroll-scale border-none shadow-lg" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="aspect-video bg-gradient-to-br from-primary-light to-primary-light">
                  {article.cover_image ? (
                    <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Sparkles size={48} className="text-primary" /></div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <Calendar size={14} />
                    {new Date(article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <p className="text-sm text-primary font-medium mb-2">{article.category}</p>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{article.excerpt || article.content?.substring(0, 100)}</p>
                  <Link to={`/articles/${article.id}`}>
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary-light">Read More <ArrowRight size={14} className="ml-1" /></Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/articles">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white px-8 rounded-full">View All Articles <ArrowRight className="ml-2" size={20} /></Button>
            </Link>
          </div>
        </div>
      </section>
    );
  };

  // Render CTA Section
  const renderCta = (section) => (
    <section key={section.id} className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white" data-testid="cta-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">{section.content.heading || 'Ready to Launch Your Beauty Brand?'}</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">{section.content.description || "Let's discuss how we can bring your cosmetic product vision to life"}</p>
        <Link to={section.content.button_link || '/contact'}>
          <Button size="lg" className="bg-white text-primary hover:bg-slate-100 px-8 py-6 text-lg rounded-full">
            {section.content.button_text || 'Contact Us Today'}
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </Link>
      </div>
    </section>
  );

  // Section renderer map
  const sectionRenderers = {
    hero: renderHero,
    features: renderFeatures,
    services: renderServices,
    process: renderProcess,
    products: renderProducts,
    clients: renderClients,
    reviews: renderReviews,
    articles: renderArticles,
    cta: renderCta
  };

  // Render sections dynamically based on order
  return (
    <div className="min-h-screen">
      {sections.map((section, index) => {
        const renderer = sectionRenderers[section.section_type];
        if (!renderer) return null;
        
        // Determine background class based on position (skip hero for alternating)
        const nonHeroIndex = section.section_type === 'hero' ? -1 : sections.filter((s, i) => i < index && s.section_type !== 'hero').length;
        const bgClass = nonHeroIndex % 2 === 0 ? 'bg-slate-50' : 'bg-white';
        
        return renderer(section, bgClass);
      })}
    </div>
  );
};

export default LandingPage;
