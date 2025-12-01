import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, Edit2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import LoadingSpinner from '../layout/LoadingSpinner';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageMethod, setImageMethod] = useState('url');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    review_text: '',
    rating: 5,
    position: '',
    company: '',
    photo_url: ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.getReviews();
      setReviews(response.data);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      review_text: '',
      rating: 5,
      position: '',
      company: '',
      photo_url: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setImageMethod('url');
    setEditingReview(null);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      customer_name: review.customer_name,
      review_text: review.review_text,
      rating: review.rating,
      position: review.position || '',
      company: review.company || '',
      photo_url: review.photo_url || ''
    });
    setImagePreview(review.photo_url);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.review_text) {
      toast.error('Customer name and review text are required');
      return;
    }

    let photoUrl = formData.photo_url;

    // Upload image if user chose to upload from computer
    if (imageMethod === 'upload' && imageFile) {
      setUploadingImage(true);
      try {
        const uploadResponse = await api.uploadImage(imageFile);
        photoUrl = uploadResponse.data.data_url;
      } catch (error) {
        toast.error('Photo upload failed');
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    }

    const reviewData = {
      ...formData,
      photo_url: photoUrl,
      rating: parseInt(formData.rating)
    };

    try {
      if (editingReview) {
        await api.updateReview(editingReview.id, reviewData);
        toast.success('Review updated successfully');
      } else {
        await api.createReview(reviewData);
        toast.success('Review created successfully');
      }
      
      fetchReviews();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(editingReview ? 'Failed to update review' : 'Failed to create review');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.deleteReview(id);
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Review Management</h2>
          <p className="text-slate-600">Manage customer reviews and testimonials</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus size={20} className="mr-2" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingReview ? 'Edit Review' : 'Add New Review'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="customer_name">Customer Name *</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="review_text">Review Text *</Label>
                <Textarea
                  id="review_text"
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  placeholder="Share your experience..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="CEO, Founder, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                />
              </div>

              <div>
                <Label>Customer Photo</Label>
                <Tabs value={imageMethod} onValueChange={setImageMethod} className="mt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">Image URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload from Computer</TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="space-y-2">
                    <Input
                      value={formData.photo_url}
                      onChange={(e) => {
                        setFormData({ ...formData, photo_url: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Max file size: 2MB</p>
                  </TabsContent>
                </Tabs>

                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-full border-2 border-slate-200"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Uploading...' : (editingReview ? 'Update Review' : 'Create Review')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reviews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">No reviews yet. Add your first review!</p>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex gap-4">
                {review.photo_url && (
                  <img
                    src={review.photo_url}
                    alt={review.customer_name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{review.customer_name}</h3>
                      {review.position && (
                        <p className="text-sm text-slate-600">
                          {review.position}{review.company ? ` at ${review.company}` : ''}
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
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(review)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-700">{review.review_text}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;
