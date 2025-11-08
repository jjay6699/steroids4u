'use client';

import React, { useState, useEffect } from 'react';

interface HeroBanner {
  id: number;
  image: string;
}

const heroBanners: HeroBanner[] = [
  {
    id: 1,
    image: '/banner1.jpg',
  },
  {
    id: 2,
    image: '/banner2.jpg',
  },
  {
    id: 3,
    image: '/banner3.jpg',
  },
  {
    id: 4,
    image: '/banner4.jpg',
  },
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  return (
    <div className="relative w-full">
      {/* Slides Container - Single carousel with proper spacing */}
      <div className="relative w-full overflow-hidden rounded-lg bg-dark-bg" style={{ aspectRatio: '16 / 6' }}>
        <div
          className="flex h-full transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {heroBanners.map((banner) => (
            <div
              key={banner.id}
              className="w-full h-full flex-shrink-0 relative"
            >
              {/* Background Image - Contain to show full image */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${banner.image})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                currentSlide === index ? 'bg-accent w-8 h-3 rounded-full' : 'bg-white/50 hover:bg-white/75 w-3 h-3 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

