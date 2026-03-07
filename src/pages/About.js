import React from 'react';
import { Link } from 'react-router-dom';

const highlights = [
  {
    title: 'Complete Retail Fit-Out',
    description: 'Shelving, counters, display systems, and accessories planned as one practical setup.',
  },
  {
    title: 'Built For Daily Use',
    description: 'Durable commercial-grade fixtures designed for busy store traffic and frequent restocking.',
  },
  {
    title: 'Fast Delivery & Setup',
    description: 'Quick turnaround for projects with support from planning to final installation.',
  },
];

const stats = [
  { value: '1000+', label: 'Projects Supported' },
  { value: '30+', label: 'Retail Categories' },
  { value: '1-2 Days', label: 'Delivery Window' },
  { value: 'UK Wide', label: 'Service Coverage' },
];

function About() {
  return (
    <div className="pb-8">
      <section className="shell mt-10">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">About Elmshelf</p>
              <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
                Retail Solutions That Make Stores Work Better
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
                We help retailers create clean, high-performing store environments with smart shelving layouts,
                quality fixtures, and practical display solutions.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/clients" className="btn-primary rounded-full px-6 py-3 text-sm font-bold">
                  Request A Quote
                </Link>
                <Link to="/catalogue" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  View Catalogue
                </Link>
              </div>
            </div>
            <div
              className="min-h-[260px] bg-cover bg-center"
              style={{ backgroundImage: "url('/main.webp')" }}
            />
          </div>
        </div>
      </section>

      <section className="shell mt-8">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="surface-card p-6">
              <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell mt-8">
        <div className="rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
