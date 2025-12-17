import React, { useEffect, useState } from 'react';
import { X, Filter, Grid3X3, LayoutGrid } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { api } from '../utils/api';
import { updatePageTitle } from '../utils/pageTitle';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { Dialog, DialogContent } from '../components/ui/dialog';

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'

  useEffect(() => {
    updatePageTitle('Gallery');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [galleryRes, categoriesRes] = await Promise.all([
        api.getGallery({}),
        api.getGalleryCategories()
      ]);
      setItems(galleryRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="gallery-page">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-light to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="gallery-title">
            Our <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our portfolio of premium cosmetic products and manufacturing excellence
          </p>
        </div>
      </section>

      {/* Filter & View Controls */}
      <section className="py-8 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={18} className="text-slate-500" />
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-primary hover:bg-primary-dark' : ''}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-primary hover:bg-primary-dark' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-primary hover:bg-primary-dark' : ''}
              >
                <Grid3X3 size={18} />
              </Button>
              <Button
                variant={viewMode === 'masonry' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('masonry')}
                className={viewMode === 'masonry' ? 'bg-primary hover:bg-primary-dark' : ''}
              >
                <LayoutGrid size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">No images found in this category</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 truncate">{item.title}</h3>
                    {item.category && (
                      <span className="text-xs text-primary bg-primary-light px-2 py-1 rounded-full mt-2 inline-block">
                        {item.category}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 break-inside-avoid"
                  onClick={() => setSelectedImage(item)}
                >
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 truncate">{item.title}</h3>
                    {item.category && (
                      <span className="text-xs text-primary bg-primary-light px-2 py-1 rounded-full mt-2 inline-block">
                        {item.category}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95">
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 text-white hover:text-primary transition-colors"
              >
                <X size={28} />
              </button>
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.title}
                className="w-full max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-xl font-bold mb-1">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-slate-300">{selectedImage.description}</p>
                )}
                {selectedImage.category && (
                  <span className="text-xs bg-primary px-2 py-1 rounded-full mt-2 inline-block">
                    {selectedImage.category}
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryPage;
