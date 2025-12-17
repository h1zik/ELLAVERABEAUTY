import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primary_color: '#06b6d4',
    accent_color: '#0891b2',
    background_color: '#ffffff',
    text_color: '#0f172a',
    heading_font: 'Playfair Display',
    body_font: 'Inter',
    theme_mode: 'light'
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  useEffect(() => {
    fetchTheme();
  }, []);

  useEffect(() => {
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--primary', theme.primary_color);
    document.documentElement.style.setProperty('--accent', theme.accent_color);
    document.documentElement.style.setProperty('--background', theme.background_color);
    document.documentElement.style.setProperty('--foreground', theme.text_color);
    
    // Generate light and dark variants using color-mix
    document.documentElement.style.setProperty('--primary-light', `color-mix(in srgb, ${theme.primary_color} 20%, white)`);
    document.documentElement.style.setProperty('--primary-dark', `color-mix(in srgb, ${theme.primary_color} 100%, black 20%)`);
    document.documentElement.style.setProperty('--accent-light', `color-mix(in srgb, ${theme.accent_color} 20%, white)`);
    document.documentElement.style.setProperty('--accent-dark', `color-mix(in srgb, ${theme.accent_color} 100%, black 20%)`);
  }, [theme]);

  const fetchTheme = async () => {
    try {
      const response = await axios.get(`${API}/theme`);
      setTheme(response.data);
    } catch (error) {
      console.error('Failed to fetch theme:', error);
    }
  };

  const updateTheme = async (updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API}/theme`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTheme(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Theme update failed' };
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, fetchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
