export const initScrollReveal = () => {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve after revealing to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Function to check and reveal elements
  const checkAndReveal = () => {
    const animationClasses = [
      '.scroll-reveal',
      '.scroll-fade-up',
      '.scroll-fade-left',
      '.scroll-fade-right',
      '.scroll-scale'
    ];

    animationClasses.forEach(className => {
      const elements = document.querySelectorAll(className);
      elements.forEach(el => {
        // Skip if already revealed
        if (el.classList.contains('revealed')) {
          return;
        }

        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if element is in viewport
        const isInViewport = (
          rect.top < windowHeight * 0.85 &&
          rect.bottom > 0
        );
        
        if (isInViewport) {
          // Immediately reveal if in viewport
          el.classList.add('revealed');
        } else {
          // Observe for future reveal
          observer.observe(el);
        }
      });
    });
  };

  // Initial check
  checkAndReveal();

  // Recheck on scroll (debounced)
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkAndReveal, 50);
  }, { passive: true });

  return observer;
};
