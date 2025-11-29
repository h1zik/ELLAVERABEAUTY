import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ProductManagement from '../components/admin/ProductManagement';
import ArticleManagement from '../components/admin/ArticleManagement';
import ClientManagement from '../components/admin/ClientManagement';
import ThemeManagement from '../components/admin/ThemeManagement';
import LeadsManagement from '../components/admin/LeadsManagement';
import SiteSettingsManagement from '../components/admin/SiteSettingsManagement';
import ContentEditor from '../components/admin/ContentEditor';
import LoadingSpinner from '../components/layout/LoadingSpinner';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user || !user.is_admin) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50" data-testid="admin-dashboard">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage your website content and settings</p>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 mb-8 h-auto">
            <TabsTrigger value="content" data-testid="tab-content">Page Content</TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="articles" data-testid="tab-articles">Articles</TabsTrigger>
            <TabsTrigger value="clients" data-testid="tab-clients">Clients</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
            <TabsTrigger value="theme" data-testid="tab-theme">Theme</TabsTrigger>
            <TabsTrigger value="leads" data-testid="tab-leads">Leads</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentEditor />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="articles">
            <ArticleManagement />
          </TabsContent>

          <TabsContent value="clients">
            <ClientManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettingsManagement />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeManagement />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
