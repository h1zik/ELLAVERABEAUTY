import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { api } from '../utils/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { toast } from 'sonner';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await api.getArticle(id);
      setArticle(response.data);
      
      // Fetch related articles from same category
      const articlesRes = await api.getArticles();
      const related = articlesRes.data
        .filter(a => a.category === response.data.category && a.id !== response.data.id)
        .slice(0, 3);
      setRelatedArticles(related);
    } catch (error) {
      console.error('Failed to fetch article:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!article) return <div className="min-h-screen flex items-center justify-center">Article not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="article-detail-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/articles" className="inline-flex items-center text-primary hover:text-primary-dark mb-8" data-testid="back-to-articles">
          <ArrowLeft size={20} className="mr-2" />
          Back to Articles
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Cover Image */}
          {article.cover_image && (
            <div className="aspect-video bg-gradient-to-br from-primary-light to-primary-light rounded-xl overflow-hidden mb-8">
              <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" data-testid="article-cover-image" />
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-light text-primary-dark rounded-full">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(article.created_at)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={14} />
              {article.read_time} min read
            </span>
            <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto text-primary hover:text-primary-dark" data-testid="share-button">
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="article-title">{article.title}</h1>

          {/* Content */}
          <div className="prose prose-lg max-w-none" data-testid="article-content">
            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 pt-16 border-t border-slate-200">
              <h2 className="text-3xl font-bold mb-8">
                Related <span className="text-gradient">Articles</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link key={relatedArticle.id} to={`/articles/${relatedArticle.id}`}>
                    <div className="group cursor-pointer">
                      {relatedArticle.cover_image && (
                        <div className="aspect-video bg-gradient-to-br from-primary-light to-primary-light rounded-xl overflow-hidden mb-4">
                          <img
                            src={relatedArticle.cover_image}
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                        <span className="px-3 py-1 bg-primary-light text-primary-dark rounded-full text-xs font-medium">
                          {relatedArticle.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(relatedArticle.created_at)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2">{relatedArticle.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
