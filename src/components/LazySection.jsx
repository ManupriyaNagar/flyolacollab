"use client";

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export default function LazySection({ children, fallback = null, className = "" }) {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  return (
    <div ref={ref} className={className}>
      {hasIntersected ? children : fallback}
    </div>
  );
}