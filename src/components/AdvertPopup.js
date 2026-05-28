import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

function AdvertPopup() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4">
      <div className="md:grid md:grid-cols-2 max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <img
          src="/sales.webp"
          alt="Retail shelving advert"
          className="hidden w-full max-w-lg rounded-l-xl object-cover md:block"
        />
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-6 top-6 rounded-full bg-slate-200 p-2.5 transition hover:bg-slate-300"
            aria-label={t('advert.close')}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13 2 2 13M2 2l11 11"
                stroke="#1F2937"
                strokeOpacity=".7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="px-6 py-20 text-center md:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{t('advert.badge')}</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              <span className="text-primary">{t('advert.titleAccent')}</span> {t('advert.title')}
            </h1>
            <p className="mt-4 text-slate-600">{t('advert.desc')}</p>
            <a
              href="/catalogue"
              className="mt-4 inline-block rounded-lg bg-primary px-14 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              {t('advert.primaryCta')}
            </a>
            <div>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 px-8 py-3 text-sm font-medium text-slate-900 transition hover:text-primary"
              >
                {t('advert.secondaryCta')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvertPopup;
