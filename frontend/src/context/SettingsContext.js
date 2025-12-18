import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await api.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update favicon when settings change (title is handled by usePageTitle hook)
  useEffect(() => {
    if (settings) {
      // Update favicon if favicon_url is provided
      if (settings.favicon_url) {
        // Update the dynamic favicon link
        let link = document.getElementById('dynamic-favicon');
        if (!link) {
          link = document.createElement('link');
          link.id = 'dynamic-favicon';
          link.rel = 'icon';
          link.type = 'image/png';
          link.sizes = '32x32';
          document.head.appendChild(link);
        }
        link.href = settings.favicon_url;
        
        // Also update apple-touch-icon for mobile
        let appleIcon = document.querySelector("link[rel='apple-touch-icon']");
        if (!appleIcon) {
          appleIcon = document.createElement('link');
          appleIcon.rel = 'apple-touch-icon';
          document.head.appendChild(appleIcon);
        }
        appleIcon.href = settings.favicon_url;
      }
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
