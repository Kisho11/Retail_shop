import React from 'react';
import { Link } from 'react-router-dom';

const showcaseItems = [
  {
    title: 'Back Bar Wall Unit',
    subtitle: 'Off-Licence Fittings',
    image: '/wall-bays.jpg',
    to: '/product/11',
  },
  {
    title: 'Security Till Counter',
    subtitle: 'Checkout & Security',
    image: '/store-counter.jpg',
    to: '/product/12',
  },
  {
    title: 'Wine Island Gondola',
    subtitle: 'Premium Display',
    image: '/modular-shelf.jpg',
    to: '/product/14',
  },
];

function ThreeDShowcase() {
  return (
    <section className="shell mt-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 overflow-hidden relative">
        <div className="pointer-events-none absolute -top-20 -right-24 h-56 w-56 rounded-full bg-blue-100 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-cyan-100 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">3D look & feel</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Immersive product previews</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Preview key fittings in a 3D-inspired visual style before opening the full product viewer.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {showcaseItems.map((item) => (
              <Link key={item.title} to={item.to} className="tilt-card block rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="depth-frame">
                  <img src={item.image} alt={item.title} className="h-52 w-full rounded-xl object-cover" />
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-blue-600">{item.subtitle}</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm font-semibold text-slate-600">Open 3D Viewer</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ThreeDShowcase;
