import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import products from '../data/products';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';

function ProductsByIndustry() {
  const { industry } = useParams();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const formattedIndustry = industry ? decodeURIComponent(industry).replace(/-/g, ' ') : null;
  const query = searchParams.get('q')?.trim() || '';
  const normalizedQuery = query.toLowerCase();
  const hasSearchOrIndustryFilter = Boolean(query || formattedIndustry);

  const filteredProducts = products.filter((product) => {
    const matchesIndustry = formattedIndustry
      ? product.industries?.some((ind) => ind.toLowerCase() === formattedIndustry.toLowerCase())
      : true;

    if (!matchesIndustry) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableContent = [
      product.name,
      product.description,
      ...(product.categories || []),
      ...(product.industries || []),
    ]
      .join(' ')
      .toLowerCase();

    return searchableContent.includes(normalizedQuery);
  });

  return (
    <section className="shell py-10">
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        {hasSearchOrIndustryFilter && (
          <BackButton className="mb-4" />
        )}
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{t('productsPage.industryCatalog')}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{t('productsPage.title')}</h1>
        {formattedIndustry && (
          <p className="mt-3 text-slate-600">
            {t('productsPage.showingFor', undefined, { industry: formattedIndustry })}
          </p>
        )}
        {query && (
          <p className="mt-2 text-slate-600">
            {t('productsPage.searchResults', undefined, { query })}
          </p>
        )}
        {!formattedIndustry && !query && (
          <p className="mt-3 text-slate-600">{t('productsPage.help')}</p>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          {t('productsPage.noProducts')}
        </div>
      )}
    </section>
  );
}

export default ProductsByIndustry;
