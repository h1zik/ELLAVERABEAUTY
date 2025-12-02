// Utility to update page title dynamically
export const updatePageTitle = (title, siteName = 'Ellavera Beauty') => {
  if (title) {
    document.title = `${title} | ${siteName}`;
  } else {
    document.title = `${siteName} - Premium Cosmetic Manufacturing`;
  }
};
