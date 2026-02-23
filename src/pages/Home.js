import React from 'react';
import { Link } from 'react-router-dom';
import Slider from '../components/Slider';
import Categories from '../components/Categories';
import ThreeDShowcase from '../components/ThreeDShowcase';

function Home() {
  const features = [
    {
      title: 'Layout-first planning',
      description: 'Plan aisle spacing, flow, and product visibility before installation.',
    },
    {
      title: 'Built for high traffic',
      description: 'Premium steel and durable components designed for daily retail use.',
    },
    {
      title: 'Fast deployment',
      description: 'Modular pieces simplify rollout across single or multi-location stores.',
    },
    {
      title: 'Dedicated support',
      description: 'Our team helps with category fit, sizing, and restock-ready structure.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Fixture SKUs' },
    { number: '1,000+', label: 'Retail Clients' },
    { number: '50+', label: 'Industry Use Cases' },
    { number: '99%', label: 'Client Satisfaction' },
  ];

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

      <section className="shell mt-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="surface-card p-5">
              <h3 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <ThreeDShowcase />

      <section className="mt-10">
        <Categories />
      </section>

      <section className="shell mt-6">
        <div className="rounded-3xl bg-slate-900 p-8 text-white sm:p-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-300">Next step</p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to upgrade your retail space?</h2>
          <p className="mb-7 max-w-2xl text-slate-200">
            Share your store type and dimensions. We will recommend shelving and fixtures that maximize product visibility.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/clients" className="btn-primary rounded-full px-6 py-3 text-sm font-bold">
              Request Consultation
            </Link>
            <Link to="/catalogue" className="rounded-full border border-slate-500 px-6 py-3 text-sm font-bold text-slate-100">
              Download Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
