// Utility to update page title dynamically
// siteName parameter is optional - if not provided, it will use whatever is currently set
export const updatePageTitle = (title, siteName = null) => {
  // Get current site name from document title or use default
  const currentTitle = document.title;
  const defaultSiteName = currentTitle.includes(' - ') 
    ? currentTitle.split(' - ')[0].split(' | ').pop()
    : 'Ellavera Beauty';
  
  const finalSiteName = siteName || defaultSiteName;
  
  if (title) {
    document.title = `${title} | ${finalSiteName}`;
  } else {
    document.title = `${finalSiteName} - Premium Cosmetic Manufacturing`;
  }
};
