import React, { useState, useEffect } from 'react';
import { Download, Database, FileJson, FileSpreadsheet, Loader2, HardDrive } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { api } from '../../utils/api';
import { toast } from 'sonner';

const BackupManagement = () => {
  const [format, setFormat] = useState('json');
  const [isDownloading, setIsDownloading] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.getBackupStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch backup stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await api.downloadBackup(format);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      link.download = `backup_${timestamp}.zip`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Backup downloaded successfully!');
    } catch (error) {
      console.error('Backup failed:', error);
      toast.error('Failed to download backup');
    } finally {
      setIsDownloading(false);
    }
  };

  const statItems = stats ? [
    { label: 'Products', count: stats.products, icon: '📦' },
    { label: 'Articles', count: stats.articles, icon: '📝' },
    { label: 'Clients', count: stats.clients, icon: '🏢' },
    { label: 'Reviews', count: stats.reviews, icon: '⭐' },
    { label: 'Services', count: stats.services, icon: '🛠️' },
    { label: 'Gallery Items', count: stats.gallery_items, icon: '🖼️' },
    { label: 'Categories', count: stats.categories, icon: '📁' },
    { label: 'Page Sections', count: stats.page_sections, icon: '📄' },
    { label: 'Contact Leads', count: stats.contact_leads, icon: '📧' },
    { label: 'Users', count: stats.users, icon: '👤' },
  ] : [];

  return (
    <div data-testid="backup-management">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Backup Data</h2>
        <p className="text-slate-600">Download a backup of all your website data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Database className="text-cyan-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Download Backup</h3>
              <p className="text-sm text-slate-500">Export all data to a ZIP file</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Export Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileJson size={16} />
                      <span>JSON (Recommended)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet size={16} />
                      <span>CSV (Spreadsheet)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 mt-1">
                {format === 'json' 
                  ? 'JSON preserves all data structure and is ideal for restoration'
                  : 'CSV is compatible with Excel/Google Sheets but may lose nested data structure'
                }
              </p>
            </div>

            <Button 
              onClick={handleDownload} 
              disabled={isDownloading}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Preparing Backup...
                </>
              ) : (
                <>
                  <Download size={20} className="mr-2" />
                  Download Backup
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <HardDrive size={16} />
              What's included:
            </h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• All products, articles, and services</li>
              <li>• Client logos and reviews</li>
              <li>• Gallery images and categories</li>
              <li>• Page sections and settings</li>
              <li>• Contact form submissions</li>
              <li>• Theme configuration</li>
            </ul>
          </div>
        </Card>

        {/* Stats Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Database className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Data Statistics</h3>
              <p className="text-sm text-slate-500">
                {loadingStats ? 'Loading...' : `${stats?.total || 0} total records`}
              </p>
            </div>
          </div>

          {loadingStats ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-slate-400" size={24} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {statItems.map((item) => (
                <div 
                  key={item.label}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-800">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BackupManagement;
