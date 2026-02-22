import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="shell py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-300">Elamshelf</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Modern retail fixtures</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              We help stores deploy durable shelving and display systems with practical layouts that scale.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-slate-300">Explore</h4>
            <div className="mt-4 space-y-2 text-sm">
              <Link to="/" className="block text-slate-400 transition hover:text-white">Home</Link>
              <Link to="/showroom" className="block text-slate-400 transition hover:text-white">Showroom</Link>
              <Link to="/products-by-industry" className="block text-slate-400 transition hover:text-white">Products</Link>
              <Link to="/catalogue" className="block text-slate-400 transition hover:text-white">Catalogue</Link>
              <Link to="/customer-portal" className="block text-slate-400 transition hover:text-white">Customer Portal</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-slate-300">Support</h4>
            <div className="mt-4 space-y-2 text-sm">
              <Link to="/clients" className="block text-slate-400 transition hover:text-white">Contact</Link>
              <Link to="/reviews" className="block text-slate-400 transition hover:text-white">Client Reviews</Link>
              <Link to="/sponsor" className="block text-slate-400 transition hover:text-white">Partners</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-slate-300">Stay updated</h4>
            <p className="mt-4 text-sm text-slate-400">Receive product launches and planning guides.</p>
            <div className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Work email"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
              />
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500">Join</button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-400">
          <p>&copy; 2026 Elamshelf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
