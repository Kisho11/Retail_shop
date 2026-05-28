import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const CONSENT_STORAGE_KEY = 'gdpr_cookie_consent_v1';

function CookieConsentBanner() {
  const { t } = useLanguage();
  const [isReady, setIsReady] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [savedConsent, setSavedConsent] = useState(null);
  const [preferences, setPreferences] = useState({
    analytics: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedConsent(parsed);
        setPreferences({
          analytics: Boolean(parsed.analytics),
          functional: Boolean(parsed.functional),
          marketing: Boolean(parsed.marketing),
        });
      }
    } catch (error) {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => setIsPanelOpen(true);
    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  const shouldShowBanner = useMemo(() => {
    if (!isReady) return false;
    return !savedConsent || isPanelOpen;
  }, [isReady, savedConsent, isPanelOpen]);

  const persistConsent = (nextConsent) => {
    const payload = {
      necessary: true,
      analytics: Boolean(nextConsent.analytics),
      functional: Boolean(nextConsent.functional),
      marketing: Boolean(nextConsent.marketing),
      policy: 'GDPR',
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
    setSavedConsent(payload);
    setPreferences({
      analytics: payload.analytics,
      functional: payload.functional,
      marketing: payload.marketing,
    });
    setIsPanelOpen(false);
  };

  const handleAcceptAll = () => {
    persistConsent({ analytics: true, functional: true, marketing: true });
  };

  const handleRejectOptional = () => {
    persistConsent({ analytics: false, functional: false, marketing: false });
  };

  const handleSavePreferences = () => {
    persistConsent(preferences);
  };

  if (!shouldShowBanner) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{t('cookie.notice')}</p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">{t('cookie.title')}</h3>
            <p className="mt-2 text-sm text-slate-600">
              {t('cookie.desc')}
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
            <button
              type="button"
              onClick={handleRejectOptional}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {t('cookie.rejectOptional')}
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              {t('cookie.acceptAll')}
            </button>
            <button
              type="button"
              onClick={() => setIsPanelOpen((prev) => !prev)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {isPanelOpen ? t('cookie.hideSettings') : t('cookie.customize')}
            </button>
          </div>
        </div>

        {isPanelOpen && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-bold text-slate-900">{t('cookie.necessary')}</p>
                <p className="mt-1 text-xs text-slate-500">{t('cookie.necessaryDesc')}</p>
                <input type="checkbox" checked readOnly className="mt-3 h-4 w-4 accent-primary" />
              </label>

              <label className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-bold text-slate-900">{t('cookie.functional')}</p>
                <p className="mt-1 text-xs text-slate-500">{t('cookie.functionalDesc')}</p>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, functional: e.target.checked }))}
                  className="mt-3 h-4 w-4 accent-primary"
                />
              </label>

              <label className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-bold text-slate-900">{t('cookie.analytics')}</p>
                <p className="mt-1 text-xs text-slate-500">{t('cookie.analyticsDesc')}</p>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))}
                  className="mt-3 h-4 w-4 accent-primary"
                />
              </label>
            </div>

            <label className="mt-3 block rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-sm font-bold text-slate-900">{t('cookie.marketing')}</p>
              <p className="mt-1 text-xs text-slate-500">{t('cookie.marketingDesc')}</p>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences((prev) => ({ ...prev, marketing: e.target.checked }))}
                className="mt-3 h-4 w-4 accent-primary"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                {t('cookie.savePreferences')}
              </button>
              <button
                type="button"
                onClick={() => setIsPanelOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {t('cookie.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CookieConsentBanner;
