export const initScrollReveal = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optional: unobserve after revealing to improve performance
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animation classes
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
      // Check if element is already in viewport (for hero sections)
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight * 0.8;
      
      if (isInViewport) {
        // Add a small delay for hero elements
        setTimeout(() => {
          el.classList.add('revealed');
        }, 100);
      } else {
        observer.observe(el);
      }
    });
  });

  return observer;
};
