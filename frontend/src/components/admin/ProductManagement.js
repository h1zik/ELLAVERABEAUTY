import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Sparkles, Upload, File, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../layout/LoadingSpinner';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductForDoc, setSelectedProductForDoc] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageMethod, setImageMethod] = useState('url'); // 'url' or 'upload'
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    benefits: '',
    key_ingredients: '',
    packaging_options: '',
    featured: false
  });
  const [docFormData, setDocFormData] = useState({
    name: '',
    type: 'MSDS',
    file: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.getProducts({}),
        api.getCategories()
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let productId;
      
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
        productId = editingProduct.id;
        toast.success('Product updated successfully');
      } else {
        const response = await api.createProduct(formData);
        productId = response.data.id;
        toast.success('Product created successfully');
      }

      // Upload image if user chose to upload from computer
      if (imageMethod === 'upload' && imageFile) {
        setUploadingImage(true);
        try {
          const uploadResponse = await api.uploadImage(imageFile);
          await api.addProductImage(productId, uploadResponse.data.data_url);
          toast.success('Product image uploaded successfully');
        } catch (error) {
          toast.error('Product saved but image upload failed');
        } finally {
          setUploadingImage(false);
        }
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category_id: product.category_id,
      description: product.description,
      benefits: product.benefits || '',
      key_ingredients: product.key_ingredients || '',
      packaging_options: product.packaging_options || '',
      featured: product.featured
    });
    setIsDialogOpen(true);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: '',
      description: '',
      benefits: '',
      key_ingredients: '',
      packaging_options: '',
      featured: false
    });
    setEditingProduct(null);
    setImageMethod('url');
    setImageFile(null);
    setImagePreview(null);
  };

  const generateDescription = async () => {
    if (!formData.name) {
      toast.error('Please enter a product name first');
      return;
    }
    setGenerating(true);
    try {
      const response = await api.generateContent(
        `Write a premium, elegant product description for a cosmetic product named "${formData.name}". Make it compelling and professional.`,
        'product_description'
      );
      setFormData({ ...formData, description: response.data.content });
      toast.success('Description generated!');
    } catch (error) {
      toast.error('Failed to generate description');
    } finally {
      setGenerating(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setDocFormData({ ...docFormData, file, name: docFormData.name || file.name });
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!docFormData.file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      // Upload file first
      const uploadResponse = await api.uploadFile(docFormData.file);
      
      // Add document to product
      await api.addProductDocument(
        selectedProductForDoc.id,
        docFormData.name,
        uploadResponse.data.data_url,
        docFormData.type
      );

      toast.success('Document uploaded successfully!');
      setIsDocDialogOpen(false);
      setDocFormData({ name: '', type: 'MSDS', file: null });
      fetchData();
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (productId, docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await api.deleteProductDocument(productId, docId);
        toast.success('Document deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div data-testid="product-management">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700" data-testid="add-product-button">
              <Plus size={20} className="mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="product-form">
              <div>
                <Label>Product Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="product-name-input"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger data-testid="product-category-select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label>Description</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={generateDescription}
                    disabled={generating}
                    data-testid="generate-description-button"
                  >
                    <Sparkles size={16} className="mr-2" />
                    {generating ? 'Generating...' : 'AI Generate'}
                  </Button>
                </div>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  data-testid="product-description-input"
                />
              </div>
              <div>
                <Label>Benefits</Label>
                <Textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={3}
                  data-testid="product-benefits-input"
                />
              </div>
              <div>
                <Label>Key Ingredients</Label>
                <Textarea
                  value={formData.key_ingredients}
                  onChange={(e) => setFormData({ ...formData, key_ingredients: e.target.value })}
                  rows={3}
                  data-testid="product-ingredients-input"
                />
              </div>
              <div>
                <Label>Packaging Options</Label>
                <Textarea
                  value={formData.packaging_options}
                  onChange={(e) => setFormData({ ...formData, packaging_options: e.target.value })}
                  rows={2}
                  data-testid="product-packaging-input"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  data-testid="product-featured-switch"
                />
                <Label>Featured Product</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700" data-testid="save-product-button">
                  {editingProduct ? 'Update' : 'Create'} Product
                </Button>
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }} data-testid="cancel-product-button">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="p-6" data-testid={`product-item-${product.id}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm text-slate-600">{product.category_name}</p>
              </div>
              {product.featured && <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">Featured</span>}
            </div>
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
            
            {/* Documents Section */}
            {product.documents && product.documents.length > 0 && (
              <div className="mb-3 p-2 bg-slate-50 rounded">
                <p className="text-xs font-semibold text-slate-700 mb-1">Documents: {product.documents.length}</p>
                <div className="space-y-1">
                  {product.documents.slice(0, 2).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 truncate">{doc.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteDocument(product.id, doc.id)}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ))}
                  {product.documents.length > 2 && (
                    <p className="text-xs text-slate-500">+{product.documents.length - 2} more</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(product)}
                data-testid={`edit-product-${product.id}`}
              >
                <Edit size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-cyan-600 hover:text-cyan-700"
                onClick={() => {
                  setSelectedProductForDoc(product);
                  setIsDocDialogOpen(true);
                }}
                data-testid={`add-doc-${product.id}`}
              >
                <Upload size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDelete(product.id)}
                data-testid={`delete-product-${product.id}`}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Document Upload Dialog */}
      <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document for {selectedProductForDoc?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDocumentSubmit} className="space-y-4">
            <div>
              <Label>Document Name</Label>
              <Input
                value={docFormData.name}
                onChange={(e) => setDocFormData({ ...docFormData, name: e.target.value })}
                required
                placeholder="e.g., Product MSDS"
                data-testid="doc-name-input"
              />
            </div>
            <div>
              <Label>Document Type</Label>
              <Select value={docFormData.type} onValueChange={(value) => setDocFormData({ ...docFormData, type: value })}>
                <SelectTrigger data-testid="doc-type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MSDS">MSDS (Material Safety Data Sheet)</SelectItem>
                  <SelectItem value="COA">COA (Certificate of Analysis)</SelectItem>
                  <SelectItem value="PIF">PIF (Product Information File)</SelectItem>
                  <SelectItem value="Specification">Specification Sheet</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Upload File (PDF, DOC, DOCX, XLS, XLSX - Max 5MB)</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={handleFileUpload}
                required
                className="mt-1"
                data-testid="doc-file-input"
              />
              {docFormData.file && (
                <p className="text-sm text-slate-600 mt-2">
                  <File size={14} className="inline mr-1" />
                  {docFormData.file.name} ({(docFormData.file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                disabled={uploading}
                data-testid="upload-doc-button"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDocDialogOpen(false);
                  setDocFormData({ name: '', type: 'MSDS', file: null });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
