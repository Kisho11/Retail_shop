export const PRODUCT_TYPES = {
  SIMPLE: 'simple',
  VARIABLE: 'variable',
  CUSTOM: 'custom',
};

const VALID_TYPES = new Set(Object.values(PRODUCT_TYPES));

export const resolveProductType = (product = {}) => {
  const explicit = String(product.productType || '').toLowerCase();
  if (VALID_TYPES.has(explicit)) return explicit;

  if (product.requiresQuote || product.customPricing) {
    return PRODUCT_TYPES.CUSTOM;
  }
  return PRODUCT_TYPES.VARIABLE;
};

const formatMoney = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  return `$${amount}`;
};

export const getProductPriceDisplay = (product = {}) => {
  const type = resolveProductType(product);

  if (type === PRODUCT_TYPES.CUSTOM) {
    return { mode: 'custom', text: 'Custom Pricing' };
  }

  if (type === PRODUCT_TYPES.SIMPLE) {
    const simplePrice = formatMoney(product.salePrice || product.price);
    return { mode: 'simple', text: simplePrice || '$0' };
  }

  const rangeMin = Number(product.minPrice);
  const rangeMax = Number(product.maxPrice);
  if (Number.isFinite(rangeMin) && Number.isFinite(rangeMax) && rangeMax >= rangeMin) {
    if (rangeMin === rangeMax) {
      return { mode: 'variable', text: `From ${formatMoney(rangeMin)}` };
    }
    return { mode: 'variable', text: `${formatMoney(rangeMin)} - ${formatMoney(rangeMax)}` };
  }

  const basePrice = Number(product.salePrice || product.price || 0);
  return { mode: 'variable', text: `From ${formatMoney(basePrice) || '$0'}` };
};
