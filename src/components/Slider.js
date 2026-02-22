import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    eyebrow: 'Retail-ready systems',
    title: 'Build a showroom that sells on first impression',
    subtitle: 'Professional shelving and display modules for every store format.',
    background: 'linear-gradient(125deg, #0f172a 0%, #1d4ed8 65%, #60a5fa 100%)',
    ctaLabel: 'Browse Products',
    ctaTo: '/products-by-industry',
  },
  {
    id: 2,
    eyebrow: 'Trusted quality',
    title: 'Durable fixtures engineered for busy retail floors',
    subtitle: 'Use modular systems that adapt to layout changes and growing inventory.',
    background: 'url(/elm-shelf-storefront.jpg)',
    ctaLabel: 'Visit Showroom',
    ctaTo: '/showroom',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  {
    id: 3,
    eyebrow: 'Fast fulfillment',
    title: 'From concept to setup, keep your launch on schedule',
    subtitle: 'Get reliable delivery and practical support for day-to-day operations.',
    background: 'linear-gradient(125deg, #0b1220 0%, #1e3a8a 55%, #0284c7 100%)',
    ctaLabel: 'Talk to Team',
    ctaTo: '/clients',
  },
];

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="fade-up">
      <div className="relative h-[calc(100vh-4rem)] min-h-[640px] w-full overflow-hidden bg-slate-900 shadow-2xl">
        {slides.map((slide, index) => (
          <article
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: slide.background,
              backgroundSize: slide.backgroundSize || 'auto',
              backgroundPosition: slide.backgroundPosition || 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 to-slate-900/45" />
            <div className="relative flex h-full items-center p-6 sm:p-10 lg:p-14">
              <div className="max-w-2xl text-white">
                <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em]">
                  {slide.eyebrow}
                </p>
                <h1 className="mb-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{slide.title}</h1>
                <p className="mb-8 max-w-xl text-base text-slate-100 sm:text-lg">{slide.subtitle}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link to={slide.ctaTo} className="btn-primary rounded-full px-6 py-3 text-sm font-bold shadow-lg">
                    {slide.ctaLabel}
                  </Link>
                  <Link to="/catalogue" className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold backdrop-blur">
                    View Catalogue
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}

        <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2 sm:bottom-8 sm:left-8">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all ${currentSlide === index ? 'w-8 bg-white' : 'w-2.5 bg-white/45'}`}
            />
          ))}
        </div>

        <div className="absolute right-5 top-5 z-10 flex gap-2 sm:right-8 sm:top-8">
          <button
            onClick={handlePrev}
            className="rounded-full border border-white/35 bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="rounded-full border border-white/35 bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Slider;
