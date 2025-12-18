import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

/**
 * Custom hook to set page title dynamically using site settings
 * @param {string} pageTitle - The specific page title (e.g., "About Us", "Products")
 */
export const usePageTitle = (pageTitle = null) => {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings) {
      const siteName = settings.site_name || 'Website';
      const tagline = settings.site_tagline || '';
      
      if (pageTitle) {
        document.title = `${pageTitle} | ${siteName}`;
      } else {
        document.title = tagline ? `${siteName} - ${tagline}` : siteName;
      }
    }
  }, [pageTitle, settings]);
};

export default usePageTitle;
