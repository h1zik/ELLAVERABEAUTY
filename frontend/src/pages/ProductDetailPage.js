import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { api } from '../utils/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="product-detail-page">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-8" data-testid="back-to-products">
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl overflow-hidden mb-4">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" data-testid="product-main-image" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cyan-600">
                  <Sparkles size={64} />
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-cyan-600' : 'border-transparent'
                    }`}
                    data-testid={`product-thumbnail-${index}`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-cyan-600 font-medium mb-2">{product.category_name}</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="product-name">{product.name}</h1>
            <p className="text-lg text-slate-600 mb-8">{product.description}</p>

            <Tabs defaultValue="benefits" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="benefits" data-testid="tab-benefits">Benefits</TabsTrigger>
                <TabsTrigger value="ingredients" data-testid="tab-ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="packaging" data-testid="tab-packaging">Packaging</TabsTrigger>
              </TabsList>
              <TabsContent value="benefits" className="mt-4">
                <p className="text-slate-600">{product.benefits || 'Benefits information coming soon'}</p>
              </TabsContent>
              <TabsContent value="ingredients" className="mt-4">
                <p className="text-slate-600">{product.key_ingredients || 'Ingredients information coming soon'}</p>
              </TabsContent>
              <TabsContent value="packaging" className="mt-4">
                <p className="text-slate-600">{product.packaging_options || 'Packaging options coming soon'}</p>
              </TabsContent>
            </Tabs>

            {/* Documents */}
            {product.documents && product.documents.length > 0 && (
              <Card className="p-6 mb-8 border-none shadow-md">
                <h3 className="text-xl font-bold mb-4">Product Documents</h3>
                <div className="space-y-3">
                  {product.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg" data-testid={`document-${index}`}>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-slate-600">{doc.type}</p>
                      </div>
                      <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="border-cyan-600 text-cyan-600" data-testid={`download-document-${index}`}>
                          <Download size={16} className="mr-2" />
                          Download
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Link to="/contact">
              <Button size="lg" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" data-testid="inquire-button">
                Inquire About This Product
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
