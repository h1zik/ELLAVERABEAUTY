import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { initScrollReveal } from '../utils/scrollReveal';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
    const observer = initScrollReveal();
    return () => observer.disconnect();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.getArticles({ published: true });
      setArticles(response.data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="articles-page">
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="articles-title">
            <span className="text-gradient">Articles & Insights</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay updated with the latest trends and insights in cosmetic manufacturing
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <LoadingSpinner />
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg">No articles published yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow scroll-reveal border-none shadow-lg" style={{ animationDelay: `${index * 0.05}s` }} data-testid={`article-card-${article.id}`}>
                {article.cover_image && (
                  <div className="aspect-video bg-gradient-to-br from-cyan-100 to-cyan-50 overflow-hidden">
                    <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover image-overlay" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(article.created_at)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} />
                      {article.read_time} min read
                    </span>
                  </div>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-cyan-100 text-cyan-700 rounded-full mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  <Link to={`/articles/${article.id}`}>
                    <Button variant="ghost" className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 p-0" data-testid={`read-article-${article.id}`}>
                      Read More
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
