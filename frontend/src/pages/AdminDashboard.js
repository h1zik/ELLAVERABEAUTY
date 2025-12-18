import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Newspaper, 
  Users, 
  Star, 
  Settings, 
  Palette, 
  MessageSquare,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
  TrendingUp,
  Eye,
  ShoppingBag,
  Mail,
  Briefcase,
  Image,
  Tag,
  Database,
  Award,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import ProductManagement from '../components/admin/ProductManagement';
import ArticleManagement from '../components/admin/ArticleManagement';
import ClientManagement from '../components/admin/ClientManagement';
import ReviewManagement from '../components/admin/ReviewManagement';
import ThemeManagement from '../components/admin/ThemeManagement';
import LeadsManagement from '../components/admin/LeadsManagement';
import SiteSettingsManagement from '../components/admin/SiteSettingsManagement';
import ContentEditor from '../components/admin/ContentEditor';
import PageBuilderManagement from '../components/admin/PageBuilderManagement';
import ServiceManagement from '../components/admin/ServiceManagement';
import GalleryManagement from '../components/admin/GalleryManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import BackupManagement from '../components/admin/BackupManagement';
import ProofCertificationsEditor from '../components/admin/ProofCertificationsEditor';
import PageTitlesEditor from '../components/admin/PageTitlesEditor';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { api } from '../utils/api';

const AdminDashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    products: 0,
    articles: 0,
    clients: 0,
    leads: 0
  });

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, articlesRes, clientsRes, leadsRes] = await Promise.all([
        api.getProducts({}),
        api.getArticles({}),
        api.getClients(),
        api.getContactLeads().catch(() => ({ data: [] }))
      ]);
      setStats({
        products: productsRes.data?.length || 0,
        articles: articlesRes.data?.length || 0,
        clients: clientsRes.data?.length || 0,
        leads: leadsRes.data?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'content', label: 'Page Content', icon: FileText },
    { id: 'pageTitles', label: 'Page Titles', icon: FileText },
    { id: 'builder', label: 'Page Builder', icon: Layers },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'articles', label: 'Articles', icon: Newspaper },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'leads', label: 'Leads', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'backup', label: 'Backup', icon: Database },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user || !user.is_admin) return null;

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="p-3 sm:p-4 lg:p-6 bg-white border-none shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1 truncate">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp size={12} />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon size={18} className="text-white sm:hidden" />
          <Icon size={20} className="text-white hidden sm:block lg:hidden" />
          <Icon size={24} className="text-white hidden lg:block" />
        </div>
      </div>
    </Card>
  );

  const DashboardOverview = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
        <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Welcome back, {user?.name || 'Admin'}!</h1>
        <p className="text-cyan-100 text-sm sm:text-base">Here's what's happening with your website today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard 
          title="Total Products" 
          value={stats.products} 
          icon={ShoppingBag} 
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard 
          title="Articles" 
          value={stats.articles} 
          icon={Newspaper} 
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard 
          title="Clients" 
          value={stats.clients} 
          icon={Users} 
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard 
          title="Leads" 
          value={stats.leads} 
          icon={Mail} 
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-4 sm:py-6 flex flex-col items-center gap-1 sm:gap-2 hover:bg-cyan-50 hover:border-cyan-300 transition-all"
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} className="text-cyan-600 sm:hidden" />
            <Package size={24} className="text-cyan-600 hidden sm:block" />
            <span className="text-xs sm:text-sm font-medium">Add Product</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-cyan-50 hover:border-cyan-300 transition-all"
            onClick={() => setActiveTab('articles')}
          >
            <Newspaper size={20} className="text-cyan-600 sm:hidden" />
            <Newspaper size={24} className="text-cyan-600 hidden sm:block" />
            <span className="text-xs sm:text-sm font-medium">Write Article</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 sm:py-6 flex flex-col items-center gap-1 sm:gap-2 hover:bg-cyan-50 hover:border-cyan-300 transition-all"
            onClick={() => setActiveTab('content')}
          >
            <FileText size={20} className="text-cyan-600 sm:hidden" />
            <FileText size={24} className="text-cyan-600 hidden sm:block" />
            <span className="text-xs sm:text-sm font-medium">Edit Content</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 sm:py-6 flex flex-col items-center gap-1 sm:gap-2 hover:bg-cyan-50 hover:border-cyan-300 transition-all"
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} className="text-cyan-600 sm:hidden" />
            <Settings size={24} className="text-cyan-600 hidden sm:block" />
            <span className="text-xs sm:text-sm font-medium">Site Settings</span>
          </Button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 bg-white border-none shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Eye size={18} className="text-cyan-600 sm:hidden" />
            <Eye size={20} className="text-cyan-600 hidden sm:block" />
            Website Preview
          </h3>
          <div className="aspect-video bg-slate-100 rounded-lg sm:rounded-xl overflow-hidden relative group">
            <iframe 
              src="/" 
              className="w-full h-full border-0 pointer-events-none"
              title="Website Preview"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
              <Button 
                className="opacity-0 group-hover:opacity-100 transition-all bg-white text-slate-800 hover:bg-white/90 text-xs sm:text-sm"
                onClick={() => window.open('/', '_blank')}
              >
                <Eye size={16} className="mr-2" />
                View Site
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-none shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Tips & Help</h3>
          <div className="space-y-3">
            <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100">
              <p className="text-sm font-medium text-cyan-800">Page Content</p>
              <p className="text-xs text-cyan-600 mt-1">Edit text, images, and sections for each page</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-sm font-medium text-purple-800">Page Builder</p>
              <p className="text-xs text-purple-600 mt-1">Drag and drop to reorder sections</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm font-medium text-emerald-800">Settings</p>
              <p className="text-xs text-emerald-600 mt-1">Update logo, contact info, and social links</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'content':
        return <ContentEditor />;
      case 'builder':
        return <PageBuilderManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'products':
        return <ProductManagement />;
      case 'articles':
        return <ArticleManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'certifications':
        return <ProofCertificationsEditor />;
      case 'categories':
        return <CategoryManagement />;
      case 'clients':
        return <ClientManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'leads':
        return <LeadsManagement />;
      case 'settings':
        return <SiteSettingsManagement />;
      case 'theme':
        return <ThemeManagement />;
      case 'backup':
        return <BackupManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100" data-testid="admin-dashboard">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile by default, shown when mobileMenuOpen is true */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-all duration-300
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${mobileMenuOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:translate-x-0
        `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <div>
                <h1 className="font-bold text-slate-800">Admin</h1>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
            )}
          </div>
          {/* Close button for mobile */}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={18} />
          </Button>
          {/* Collapse button for desktop */}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-slate-100 hidden lg:flex"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false); // Close mobile menu on selection
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
                data-testid={`tab-${item.id}`}
              >
                <Icon size={20} className={isActive ? 'text-white' : ''} />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-100 bg-white">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200`}
          >
            <LogOut size={20} />
            {(!sidebarCollapsed || mobileMenuOpen) && (
              <span className="font-medium text-sm">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={`transition-all duration-300 
          lg:${sidebarCollapsed ? 'ml-20' : 'ml-64'}
          ml-0 lg:ml-64
        `}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden h-10 w-10"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </Button>
          <div className="hidden lg:block">
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {activeTab === 'dashboard' ? 'Dashboard' : menuItems.find(m => m.id === activeTab)?.label}
            </h2>
          </div>
          {/* Page title for mobile */}
          <h2 className="text-lg font-bold text-slate-800 capitalize lg:hidden flex-1 text-center">
            {activeTab === 'dashboard' ? 'Dashboard' : menuItems.find(m => m.id === activeTab)?.label}
          </h2>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2 hidden sm:flex"
              onClick={() => window.open('/', '_blank')}
            >
              <Eye size={16} />
              <span className="hidden md:inline">View Site</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="sm:hidden h-9 w-9"
              onClick={() => window.open('/', '_blank')}
            >
              <Eye size={16} />
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-slate-800">{user?.name || 'Admin'}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Responsive padding */}
        <div className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
