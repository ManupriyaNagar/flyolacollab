// Performance monitoring utilities
export const measurePerformance = () => {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      
      // Send to analytics (optional)
      if (entry.name === 'FCP' && entry.value > 1800) {
      }
      if (entry.name === 'LCP' && entry.value > 2500) {
      }
    });
  });

  observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
};

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  const criticalImages = ['/pp.svg', '/logoo-04.png', '/1.png', '/2.png'];
  
  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Lazy load non-critical resources
export const lazyLoadResources = () => {
  if (typeof window === 'undefined') return;

  const lazyImages = document.querySelectorAll('img[data-lazy]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.lazy;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
};