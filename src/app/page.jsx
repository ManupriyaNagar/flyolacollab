"use client";

import LazySection from "@/components/LazySection";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useEffect } from 'react';
import "./globals.css";

import FlightBooking from '@/components/Home/FlightBooking';
import MobileFlightBooking from "@/components/Home/MobileFlightBooking";

// Lazy load components that are below the fold
const ImageShowcase = dynamic(() => import("@/components/Home/ImageShowcase"), { ssr: false });
const FeatureCards = dynamic(() => import("@/components/Home/FeatureCard"), { ssr: false });
const PrivateJetRental = dynamic(() => import("@/components/Home/Banner"), { ssr: false });
const AviationHighlights = dynamic(() => import("@/components/Home/Highlights"), { ssr: false });
const WhyChooseFlyola = dynamic(() => import("@/components/Home/WhyChoose"), { ssr: false });
const CityCaurasol = dynamic(() => import("@/components/Home/CityCaurasol"), { ssr: false });
const ArticleSection = dynamic(() => import("@/components/Home/Article"), { ssr: false });
const HoverEffect = dynamic(() => import("@/components/ui/HoverEffect"), { ssr: false });

const PopularDestinations = dynamic(() => import("@/components/Home/PopularDestinations"), { ssr: false });

export default function Home() {
  // Performance optimizations for static export
  useEffect(() => {
    // Preload critical resources
    const preloadCritical = () => {
      const criticalImages = ['/pp.svg', '/logoo-04.png', '/1.webp', '/2.webp'];
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Preload airport data
    const preloadAirports = async () => {
      const cached = sessionStorage.getItem('airports_data');
      const cacheTime = sessionStorage.getItem('airports_cache_time');
      
      if (!cached || !cacheTime || (Date.now() - parseInt(cacheTime)) > 300000) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'NEXT_PUBLIC_API_URL'}/airport`);
          if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('airports_data', JSON.stringify(data));
            sessionStorage.setItem('airports_cache_time', Date.now().toString());
          }
        } catch (error) {
          // Preload failed, components will fetch on mount
        }
      }
    };

    // Execute optimizations when component mounts
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        preloadCritical();
        preloadAirports();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        preloadCritical();
        preloadAirports();
      }, 100);
    }
  }, []);

  return (
    <div className={cn('min-h-screen', 'bg-gray-50')}>
 

      <div id="booking" className={cn('hidden', 'md:block')}>
        <FlightBooking />
      </div>
      
      <div className="md:hidden">
        <MobileFlightBooking />
      </div>
      
      <LazySection>
        <ImageShowcase />
      </LazySection>
      
      <LazySection>
        <FeatureCards />
      </LazySection>
      
      <LazySection>
        <PrivateJetRental />
      </LazySection>
      
      <LazySection>
        <AviationHighlights />
      </LazySection>
      

      <LazySection>
        <WhyChooseFlyola />
      </LazySection>
      
      <LazySection>
        <CityCaurasol />
      </LazySection>
      
      <LazySection>
        <ArticleSection />
      </LazySection>
      
      <LazySection>
        <HoverEffect />
      </LazySection>
      

      
      <LazySection>
        <PopularDestinations />
      </LazySection>
    </div>
  );
}