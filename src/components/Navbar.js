import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const industries = [
  'Tech shops',
  'DIY',
  'Greengrocer',
  'Pound shop',
  'Pet shop',
  'Vape shop',
  'Grocery store',
  'Butcher',
  'Organic shops',
  'Pharmacy store',
  'Restaurants',
  'Bakery',
];

function Navbar() {
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = useMemo(() => {
    const base = [
      { to: '/', label: 'Home' },
      { to: '/showroom', label: 'Showroom' },
      { to: '/clients', label: 'Clients' },
      { to: '/reviews', label: 'Reviews' },
      { to: '/catalogue', label: 'Catalogue' },
    ];

    if (isAuthenticated && user?.role === 'customer') {
      return [...base, { to: '/customer-portal', label: 'My Account' }];
    }

    return base;
  }, [isAuthenticated, user]);

  const handleNavigate = () => {
    setIsMobileMenuOpen(false);
    setIsIndustryOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleNavigate();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
      <div className="bg-red-600 text-white">
        <div className="shell flex min-h-10 flex-wrap items-center justify-between gap-2 py-2 text-xs font-semibold sm:text-sm">
          <p>Limited Offer: Up to 25% off selected shelving and off-licence fittings.</p>
          <div className="flex items-center gap-3">
            <Link to="/catalogue" className="underline-offset-2 hover:underline">
              View Deals
            </Link>
            <span className="hidden sm:inline text-red-100">|</span>
            <Link to="/clients" className="underline-offset-2 hover:underline">
              Get Quote
            </Link>
          </div>
        </div>
        <div className="bg-red-700/90 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] sm:text-sm">
          <p className="blink-banner-text">SAME DAY PICK UP | DELIVERY WITHIN 1 - 3 WORKING DAYS | GET A QUOTE</p>
        </div>
      </div>
      <div className="shell">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={handleNavigate}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-black text-white">E</span>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Retail Systems</p>
              <p className="font-semibold text-slate-900">Elamshelf</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm font-semibold text-slate-700 transition hover:text-blue-600">
                {link.label}
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setIsIndustryOpen((prev) => !prev)}
                className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
              >
                Industries
              </button>
              {isIndustryOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  {industries.map((industry) => (
                    <Link
                      key={industry}
                      to={`/products-by-industry/${industry.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                      onClick={handleNavigate}
                    >
                      {industry}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login?mode=customer-signin"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Sign Up
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
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    My Account
                  </Link>
                ) : (
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/manager/dashboard'}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                  >
                    {user?.role === 'admin' ? 'Admin Portal' : 'Manager Portal'}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Logout
                </button>
              </>
            )}

            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-200"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="17" cy="20" r="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7" />
              </svg>
              Cart
              {getTotalItems() > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded-lg border border-slate-300 p-2 text-slate-700 lg:hidden"
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="fade-up space-y-3 border-t border-slate-200 py-4 lg:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
                onClick={handleNavigate}
              >
                {link.label}
              </Link>
            ))}

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Industries</p>
              <div className="grid grid-cols-2 gap-2">
                {industries.slice(0, 8).map((industry) => (
                  <Link
                    key={industry}
                    to={`/products-by-industry/${industry.toLowerCase().replace(/\s+/g, '-')}`}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700"
                    onClick={handleNavigate}
                  >
                    {industry}
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
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white"
                  onClick={handleNavigate}
                >
                  Sign Up
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
                    className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white"
                    onClick={handleNavigate}
                  >
                    My Account
                  </Link>
                ) : (
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/manager/dashboard'}
                    className="block rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700"
                    onClick={handleNavigate}
                  >
                    {user?.role === 'admin' ? 'Admin Portal' : 'Manager Portal'}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700"
                >
                  Logout
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
                Cart ({getTotalItems()})
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
