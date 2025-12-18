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

  // Update document title and favicon when settings change
  useEffect(() => {
    if (settings) {
      // Update browser tab title
      document.title = settings.site_name 
        ? `${settings.site_name} - Premium Cosmetic Manufacturing`
        : 'Ellavera Beauty - Premium Cosmetic Manufacturing';
      
      // Update favicon if logo_url is provided
      if (settings.favicon_url) {
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = settings.favicon_url;
      }
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
