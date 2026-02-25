import React, { useMemo, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { useLanguage } from '../context/LanguageContext';

const catalogues = [
  { name: 'Wall Bays Catalogue', url: '/downloads/wall-bays.pdf' },
  { name: 'Slatwall Panel Catalogue', url: '/downloads/slatwall.pdf' },
  { name: 'Bakery & Bread Catalogue', url: '/downloads/bakery.pdf' },
  { name: 'Refrigeration Catalogue', url: '/downloads/refrigeration.pdf' },
];

function Categories() {
  const { products, categories } = useProducts();
  const { t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState('__all__');

  const categoryItems = useMemo(() => {
    const derivedNames = [...new Set(products.flatMap((item) => item.categories || []))];

    const fromAdmin = categories.map((category) => ({
      name: category.name,
      image: category.image || products.find((item) => item.categories?.includes(category.name))?.image || '',
    }));

    const missingFromAdmin = derivedNames
      .filter((name) => !fromAdmin.some((entry) => entry.name === name))
      .map((name) => ({
        name,
        image: products.find((item) => item.categories?.includes(name))?.image || '',
      }));

    return [{ name: '__all__', image: '/store-counter.jpg' }, ...fromAdmin, ...missingFromAdmin];
  }, [categories, products]);

  const categoryCounts = useMemo(() => {
    const counts = { __all__: products.length };
    categoryItems.forEach((category) => {
      if (category.name !== '__all__') {
        counts[category.name] = products.filter((item) => item.categories?.includes(category.name)).length;
      }
    });
    return counts;
  }, [categoryItems, products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === '__all__') return products;
    return products.filter((item) => item.categories?.includes(selectedCategory));
  }, [products, selectedCategory]);

  const selectedCategoryMeta = categoryItems.find((item) => item.name === selectedCategory);

  return (
    <section className="py-10">
      <div className="mx-auto w-[min(1500px,100%-1.5rem)]">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{t('categories.shopByCategory')}</p>
        <h2 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">{t('categories.chooseCategory')}</h2>
        <p className="mt-3 max-w-4xl text-base text-slate-600">{t('categories.categoryHelp')}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
        <aside className="p-1 lg:sticky lg:top-24 lg:h-fit">
          <h3 className="mb-4 text-base font-bold uppercase tracking-[0.12em] text-slate-500">{t('categories.categories')}</h3>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {categoryItems.map((category) => {
              const isActive = selectedCategory === category.name;
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full rounded-xl border-0 p-2 text-left transition ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 p-1">
                    <div className="h-14 w-14 overflow-hidden rounded-lg bg-slate-100">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className={`truncate text-base font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {category.name === '__all__' ? t('categories.allProducts') : category.name}
                      </p>
                      <p className={`text-sm font-semibold ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {categoryCounts[category.name] || 0} {t('categories.items')}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div>
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="h-60 bg-slate-100">
              {selectedCategoryMeta?.image ? (
                <img src={selectedCategoryMeta.image} alt={selectedCategoryMeta.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">{t('categories.noCategoryImage')}</div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-3xl font-bold text-slate-900">
                {selectedCategory === '__all__' ? t('categories.allProducts') : selectedCategory}
              </h3>
              <p className="mt-2 text-base text-slate-600">
                {t('categories.showing')} <span className="font-bold text-slate-900">{filteredProducts.length}</span> {t('categories.products')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      </div>

      <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-slate-900">{t('categories.downloadTitle')}</h3>
        <p className="mt-2 text-slate-600">{t('categories.downloadDesc')}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {catalogues.map((cat) => (
            <a
              key={cat.name}
              href={cat.url}
              download
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-sm font-bold text-slate-900">{cat.name}</p>
              <p className="mt-1 text-xs font-semibold text-blue-700">{t('categories.downloadPdf')}</p>
            </a>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}

export default Categories;
