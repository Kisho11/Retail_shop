import React from 'react';
import { Link } from 'react-router-dom';
import Slider from '../components/Slider';
import Categories from '../components/Categories';
import { useLanguage } from '../context/LanguageContext';

const logos = [
  { src: '/clilogs/BudgensLogo.svg.png', alt: 'Budgens logo' },
  { src: '/clilogs/Costcutter.png', alt: 'Costcutter logo' },
  { src: '/clilogs/Londis-logo-m716zgtifbdvpw1dlya58d2y97d3i115ir467iufq0.png', alt: 'Londis logo' },
  { src: '/clilogs/Night Presentation - Cover .png', alt: 'Night Presentation logo' },
  { src: '/clilogs/Nisa_retailer-Logo.wine_.png', alt: 'Nisa logo' },
  { src: '/clilogs/Spar-Logo.jpg', alt: 'SPAR logo' },
  { src: '/clilogs/best-one-blue-logo.png', alt: 'Best-one logo' },
];

function Home() {
  const { t } = useLanguage();

  return (
    <div className="pb-6">
      <Slider />

      <section className="shell fade-up mt-8">
        {/* <div className="soft-section grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Modern retail infrastructure</p>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">Everything your store needs to look premium and perform daily</h2>
            <p className="max-w-2xl text-slate-700">
              Elamshelf provides tailored retail shelving, display counters, and modular systems for supermarkets,
              boutiques, pharmacies, bakeries, and specialty stores.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/products-by-industry" className="btn-primary rounded-full px-6 py-3 text-sm font-bold">
                Shop by Industry
              </Link>
              <Link to="/showroom" className="btn-secondary rounded-full px-6 py-3 text-sm font-bold">
                Visit Showroom
              </Link>
            </div>
          </div>

          <div className="surface-card grid gap-4 p-5">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-2xl font-extrabold text-slate-900">{stat.number}</p>
                <p className="text-sm font-semibold text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div> */}

        
      </section>

      <section className="shell mt-10">
        <div className="logo-marquee rounded-2xl border border-slate-200 bg-white py-6 sm:py-8">
          <div className="logo-track">
            {[...logos, ...logos].map((logo, index) => (
              <div key={`${logo.src}-${index}`} className="logo-item">
                <img src={logo.src} alt={logo.alt} className="logo-image" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <Categories />
      </section>

      <section className="shell mt-6">
        <div className="rounded-3xl bg-slate-900 p-8 text-white sm:p-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-300">{t('home.nextStep')}</p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{t('home.ctaTitle')}</h2>
          <p className="mb-7 max-w-2xl text-slate-200">
            {t('home.ctaDesc')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/clients" className="btn-primary rounded-full px-6 py-3 text-sm font-bold">
              {t('home.requestConsultation')}
            </Link>
            <Link to="/catalogue" className="rounded-full border border-slate-500 px-6 py-3 text-sm font-bold text-slate-100">
              {t('home.downloadCatalogue')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
