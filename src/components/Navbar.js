import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const industries = [
  { key: 'techShops', slug: 'tech-shops' },
  { key: 'diy', slug: 'diy' },
  { key: 'greengrocer', slug: 'greengrocer' },
  { key: 'poundShop', slug: 'pound-shop' },
  { key: 'petShop', slug: 'pet-shop' },
  { key: 'vapeShop', slug: 'vape-shop' },
  { key: 'groceryStore', slug: 'grocery-store' },
  { key: 'butcher', slug: 'butcher' },
  { key: 'organicShops', slug: 'organic-shops' },
  { key: 'pharmacyStore', slug: 'pharmacy-store' },
  { key: 'restaurants', slug: 'restaurants' },
  { key: 'bakery', slug: 'bakery' },
];

function Navbar() {
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const industryMenuRef = useRef(null);

  const navLinks = useMemo(() => {
    const base = [
      { to: '/showroom', label: t('nav.showroom') },
      { to: '/clients', label: t('nav.clients') },
      { to: '/reviews', label: t('nav.reviews') },
      { to: '/catalogue', label: t('nav.catalogue') },
    ];

    if (isAuthenticated && user?.role === 'customer') {
      return [...base, { to: '/customer-portal', label: t('nav.myAccount') }];
    }

    return base;
  }, [isAuthenticated, t, user]);

  const handleNavigate = () => {
    setIsMobileMenuOpen(false);
    setIsIndustryOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleNavigate();
  };

  const handleLogoClick = (event) => {
    event.preventDefault();
    handleNavigate();
    navigate('/');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!industryMenuRef.current) return;
      if (!industryMenuRef.current.contains(event.target)) {
        setIsIndustryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-black">
      <div className="bg-red-600 text-white">
        <div className="shell relative flex min-h-10 items-center justify-center py-2 text-xs font-semibold sm:text-sm">
          <p className="text-center">{t('nav.limitedOffer')}</p>
          <div className="absolute right-0 flex items-center gap-2">
            <div className="hidden items-center gap-3 sm:flex">
              <Link to="/catalogue" className="underline-offset-2 hover:underline">
                {t('nav.viewDeals')}
              </Link>
              <span className="hidden sm:inline text-red-100">|</span>
              <Link to="/clients" className="underline-offset-2 hover:underline">
                {t('nav.getQuote')}
              </Link>
            </div>
            <div className="inline-flex rounded-full border border-white/35 bg-red-700/90 p-0.5 backdrop-blur">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] transition sm:text-xs ${
                  language === 'en' ? 'bg-white text-red-700 shadow-sm' : 'text-white hover:bg-white/15'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ta')}
                className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] transition sm:text-xs ${
                  language === 'ta' ? 'bg-white text-red-700 shadow-sm' : 'text-white hover:bg-white/15'
                }`}
              >
                TA
              </button>
            </div>
          </div>
        </div>
        <div className="bg-red-700/90 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] sm:text-sm">
          <p className="blink-banner-text">{t('nav.banner')}</p>
        </div>
      </div>
      <div className="shell">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link to="/" aria-label="Go to home" className="block shrink-0 cursor-pointer" onClick={handleLogoClick}>
            <img src="/elms.png" alt="Elamshelf logo" className="h-12 w-auto max-w-[150px] object-contain sm:h-14 sm:max-w-[190px] lg:h-16 lg:max-w-[240px]" />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-4 md:flex lg:gap-5">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm font-semibold text-slate-100 transition hover:text-primary">
                {link.label}
              </Link>
            ))}

            <div className="relative" ref={industryMenuRef}>
              <button
                onClick={() => setIsIndustryOpen((prev) => !prev)}
                className="text-sm font-semibold text-slate-100 transition hover:text-primary"
              >
                {t('nav.industries')}
              </button>
              {isIndustryOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  {industries.map((industry) => (
                    <Link
                      key={industry.key}
                      to={`/products-by-industry/${industry.slug}`}
                      className="nav-submenu-item"
                      onClick={handleNavigate}
                    >
                      {t(`nav.industry.${industry.key}`)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden w-[360px] items-center justify-end gap-3 xl:flex">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login?mode=customer-signin"
                  className="rounded-full border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-red-300 hover:text-primary"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  {t('nav.signUp')}
                </Link>
              </>
            ) : (
              <>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  {user?.name || 'User'} ({user?.role || 'account'})
                </span>

                {user?.role === 'customer' ? (
                  <Link
                    to="/customer-portal"
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    {t('nav.myAccount')}
                  </Link>
                ) : (
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/manager/dashboard'}
                    className="rounded-full border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-red-300 hover:text-primary"
                  >
                    {user?.role === 'admin' ? t('nav.adminPortal') : t('nav.managerPortal')}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="rounded-full border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
                >
                  {t('nav.logout')}
                </button>
              </>
            )}

            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="17" cy="20" r="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7" />
              </svg>
              {t('nav.cart')}
              {getTotalItems() > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>

          <div className="hidden items-center gap-2 md:flex xl:hidden">
            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-lg border border-slate-500 p-2 text-white"
              onClick={handleNavigate}
              aria-label="Open cart"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="17" cy="20" r="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7" />
              </svg>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="rounded-lg border border-slate-500 p-2 text-white"
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/cart"
              className="inline-flex items-center justify-center rounded-lg border border-slate-500 p-2 text-white"
              onClick={handleNavigate}
              aria-label="Open cart"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="17" cy="20" r="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7" />
              </svg>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="rounded-lg border border-slate-500 p-2 text-white"
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="fade-up space-y-3 border-t border-slate-700 bg-black py-4 xl:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block rounded-lg px-3 py-2 font-semibold text-slate-100 transition hover:bg-slate-800"
                onClick={handleNavigate}
              >
                {link.label}
              </Link>
            ))}

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{t('nav.industries')}</p>
              <div className="grid grid-cols-2 gap-2">
                {industries.slice(0, 8).map((industry) => (
                  <Link
                    key={industry.key}
                    to={`/products-by-industry/${industry.slug}`}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700"
                    onClick={handleNavigate}
                  >
                    {t(`nav.industry.${industry.key}`)}
                  </Link>
                ))}
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login?mode=customer-signin"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700"
                  onClick={handleNavigate}
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white"
                  onClick={handleNavigate}
                >
                  {t('nav.signUp')}
                </Link>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {user?.name || 'User'} ({user?.role || 'account'})
                </div>

                {user?.role === 'customer' ? (
                  <Link
                    to="/customer-portal"
                    className="block rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-white"
                    onClick={handleNavigate}
                  >
                    {t('nav.myAccount')}
                  </Link>
                ) : (
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/manager/dashboard'}
                    className="block rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700"
                    onClick={handleNavigate}
                  >
                    {user?.role === 'admin' ? t('nav.adminPortal') : t('nav.managerPortal')}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700"
                >
                  {t('nav.logout')}
                </button>
              </div>
            )}

            <div className="pt-1">
              <Link
                to="/cart"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700"
                onClick={handleNavigate}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="9" cy="20" r="1.5" />
                  <circle cx="17" cy="20" r="1.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7" />
                </svg>
                {t('nav.cart')} ({getTotalItems()})
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
