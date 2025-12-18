import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { api } from '../utils/api';
import { usePageTitle } from '../hooks/usePageTitle';
import { useSettings } from '../context/SettingsContext';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { initScrollReveal } from '../utils/scrollReveal';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();
  
  const pageInfo = settings?.page_titles?.products || { title: 'Our Products', subtitle: 'Discover our range of quality products' };
  usePageTitle(pageInfo.title);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Initialize scroll reveal after products are loaded
    if (products.length > 0) {
      const timer = setTimeout(() => {
        const observer = initScrollReveal();
        return () => observer.disconnect();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const categoriesRes = await api.getCategories();
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = selectedCategory !== 'all' ? { category_id: selectedCategory } : {};
      const productsRes = await api.getProducts(params);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="products-page">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-light to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="products-title">
            {pageInfo.title?.includes(' ') ? (
              <>{pageInfo.title.split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{pageInfo.title.split(' ').slice(-1)}</span></>
            ) : (
              <span className="text-gradient">{pageInfo.title}</span>
            )}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {pageInfo.subtitle}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-primary" />
            <span className="font-medium">Filter by Category</span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-64" data-testid="category-filter">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={product.id} className="product-card overflow-hidden scroll-fade-up border-none shadow-lg" data-testid={`product-card-${product.id}`}>
                <div className="aspect-square bg-gradient-to-br from-primary-light to-primary-light image-overlay">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary">
                      <Sparkles size={48} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-sm text-primary font-medium mb-2">{product.category_name}</p>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                  <Link to={`/products/${product.id}`}>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary-light" data-testid={`view-product-${product.id}`}>
                      View Details
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

export default ProductsPage;
