import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
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

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageMethod, setImageMethod] = useState('url');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({ name: '', logo_url: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.getClients();
      setClients(response.data);
    } catch (error) {
      toast.error('Failed to fetch clients');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let logoUrl = formData.logo_url;

    // Upload image if user chose to upload from computer
    if (imageMethod === 'upload' && imageFile) {
      setUploadingImage(true);
      try {
        const uploadResponse = await api.uploadImage(imageFile);
        logoUrl = uploadResponse.data.data_url;
      } catch (error) {
        toast.error('Logo upload failed');
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    }

    try {
      const clientData = { ...formData, logo_url: logoUrl };
      await api.createClient(clientData);
      toast.success('Client added successfully');
      setIsDialogOpen(false);
      setFormData({ name: '', logo_url: '' });
      setImageMethod('url');
      setImageFile(null);
      setImagePreview(null);
      fetchClients();
    } catch (error) {
      toast.error('Failed to add client');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await api.deleteClient(id);
        toast.success('Client deleted successfully');
        fetchClients();
      } catch (error) {
        toast.error('Failed to delete client');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div data-testid="client-management">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700" data-testid="add-client-button"><Plus size={20} className="mr-2" />Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="client-form">
              <div><Label>Client Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required data-testid="client-name-input" /></div>
              <div>
                <Label>Client Logo</Label>
                <Tabs value={imageMethod} onValueChange={setImageMethod} className="mt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">Logo URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload from Computer</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url" className="mt-3">
                    <Input 
                      value={formData.logo_url} 
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })} 
                      data-testid="client-logo-input" 
                      placeholder="https://..." 
                    />
                  </TabsContent>
                  <TabsContent value="upload" className="mt-3">
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                      onChange={handleImageFileChange}
                      data-testid="client-logo-upload-input"
                    />
                    {imagePreview && (
                      <div className="mt-3">
                        <img src={imagePreview} alt="Preview" className="h-20 object-contain rounded border" />
                        <p className="text-xs text-slate-600 mt-1">
                          <ImageIcon size={12} className="inline mr-1" />
                          {imageFile?.name} ({(imageFile?.size / 1024).toFixed(1)} KB)
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-1">Max size: 2MB (PNG, JPG, WEBP, GIF, SVG)</p>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700" 
                  data-testid="save-client-button"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Uploading...' : 'Add Client'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { 
                    setIsDialogOpen(false); 
                    setFormData({ name: '', logo_url: '' }); 
                    setImageMethod('url');
                    setImageFile(null);
                    setImagePreview(null);
                  }} 
                  data-testid="cancel-client-button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="p-6" data-testid={`client-item-${client.id}`}>
            <div className="flex justify-between items-start mb-3">
              <img src={client.logo_url} alt={client.name} className="h-12 object-contain" />
              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(client.id)} data-testid={`delete-client-${client.id}`}><Trash2 size={16} /></Button>
            </div>
            <h3 className="font-bold mb-1">{client.name}</h3>
            {client.testimonial && <p className="text-sm text-slate-600 line-clamp-2">{client.testimonial}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientManagement;
