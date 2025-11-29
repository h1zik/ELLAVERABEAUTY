export const initScrollReveal = () => {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px 50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach(el => {
    // Check if element is already in viewport
    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInViewport) {
      // Immediately reveal if already in viewport
      el.classList.add('revealed');
    }
    
    observer.observe(el);
  });

  return observer;
};
