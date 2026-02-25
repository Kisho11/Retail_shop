import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const stableSlide = {
  backgroundImage: 'url(/elmca.jpg)',
  ctaTo: '/showroom',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

function Slider() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanedQuery = searchQuery.trim();
    const targetUrl = cleanedQuery
      ? `/products-by-industry?q=${encodeURIComponent(cleanedQuery)}`
      : '/products-by-industry';
    navigate(targetUrl);
  };

  return (
    <section className="fade-up">
      <div className="relative h-[calc(100vh-4rem)] min-h-[640px] w-full overflow-hidden bg-slate-900 shadow-2xl">
        <article className="absolute inset-0">
          <div
            className="hero-pan absolute inset-0"
            style={{
              backgroundImage: stableSlide.backgroundImage,
              backgroundSize: stableSlide.backgroundSize || 'auto',
              backgroundPosition: stableSlide.backgroundPosition || 'center',
              backgroundRepeat: stableSlide.backgroundRepeat || 'no-repeat',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 to-slate-900/45" />
          <div className="relative flex h-full items-center p-6 sm:p-10 lg:p-14">
            <div className="max-w-2xl text-white">
              <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em]">
                {t('slider.eyebrow')}
              </p>
              <h1 className="mb-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {[t('slider.line1'), t('slider.line2'), t('slider.line3')].map((line) => (
                  <span key={line} className="mb-1 block w-fit border-b-4 border-primary pb-1">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mb-8 max-w-xl text-base text-slate-100 sm:text-lg">{t('slider.subtitle')}</p>
              <a
                href="tel:01708594024"
                className="phone-glow mb-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-extrabold tracking-[0.04em] text-white shadow-xl"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M6.62 10.79a15.06 15.06 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.56 0 1 .45 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3a1 1 0 0 1 1-1h3.5c.55 0 1 .44 1 1 0 1.24.2 2.45.57 3.57.11.35.03.75-.25 1.02l-2.2 2.2Z" />
                </svg>
                {t('slider.call')}
              </a>
              <form onSubmit={handleSearchSubmit} className="mb-7 w-full max-w-2xl">
                <label htmlFor="hero-product-search" className="sr-only">
                  {t('slider.search')}
                </label>
                <div className="relative rounded-2xl bg-white/95 p-2 shadow-2xl ring-1 ring-slate-200/70 backdrop-blur">
                  <svg
                    viewBox="0 0 24 24"
                    className="pointer-events-none absolute left-7 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    id="hero-product-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('slider.searchPlaceholder')}
                    className="h-14 w-full rounded-xl border border-transparent bg-transparent pl-16 pr-36 text-base font-medium text-slate-800 outline-none transition focus:border-red-200 focus:ring-2 focus:ring-red-200 sm:h-16 sm:text-lg"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-red-700 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    {t('slider.search')}
                  </button>
                </div>
              </form>
              <div className="flex flex-wrap items-center gap-3">
                <Link to={stableSlide.ctaTo} className="btn-primary rounded-full px-6 py-3 text-sm font-bold shadow-lg">
                  {t('slider.visitShowroom')}
                </Link>
                <Link to="/catalogue" className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold backdrop-blur">
                  {t('slider.viewCatalogue')}
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Slider;
