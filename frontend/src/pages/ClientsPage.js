import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { initScrollReveal } from '../utils/scrollReveal';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    // Initialize scroll reveal after clients are loaded
    if (clients.length > 0) {
      const timer = setTimeout(() => {
        const observer = initScrollReveal();
        return () => observer.disconnect();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [clients]);

  const fetchClients = async () => {
    try {
      const response = await api.getClients();
      setClients(response.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="clients-page">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-light to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="clients-title">
            Our <span className="text-gradient">Clients</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Trusted by leading beauty brands worldwide
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <LoadingSpinner />
        ) : clients.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg">No clients to display yet</p>
          </div>
        ) : (
          <>
            {/* Client Logos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
              {clients.map((client, index) => (
                <Card key={client.id} className="p-6 flex items-center justify-center hover:shadow-xl transition-shadow scroll-reveal border-none shadow-md" style={{ animationDelay: `${index * 0.05}s` }} data-testid={`client-logo-${client.id}`}>
                  <img src={client.logo_url} alt={client.name} className="max-h-20 w-auto grayscale hover:grayscale-0 transition-all" />
                </Card>
              ))}
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clients.filter(c => c.testimonial).map((client, index) => (
                  <Card key={client.id} className="p-6 scroll-reveal border-none shadow-lg" style={{ animationDelay: `${index * 0.1}s` }} data-testid={`client-testimonial-${client.id}`}>
                    <div className="flex items-center mb-4">
                      {[...Array(client.rating || 5)].map((_, i) => (
                        <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-4 italic">"{client.testimonial}"</p>
                    <div className="flex items-center space-x-3">
                      <img src={client.logo_url} alt={client.name} className="w-12 h-12 object-contain" />
                      <div>
                        <p className="font-semibold">{client.name}</p>
                        {client.position && <p className="text-sm text-slate-600">{client.position}</p>}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
