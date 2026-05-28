export const PRODUCT_TYPES = {
  SIMPLE: 'simple',
  VARIABLE: 'variable',
  CUSTOM: 'custom',
};

const VALID_TYPES = new Set(Object.values(PRODUCT_TYPES));

export const resolveProductType = (product = {}) => {
  const explicit = String(product.productType || product.product_type || '').toLowerCase();
  if (VALID_TYPES.has(explicit)) return explicit;

  if (product.requiresQuote || product.customPricing) {
    return PRODUCT_TYPES.CUSTOM;
  }

  const variantPricing = Array.isArray(product.variantPricing) ? product.variantPricing : [];
  if (variantPricing.length > 0) {
    return PRODUCT_TYPES.VARIABLE;
  }

  const variantGroups = Array.isArray(product.variant_groups) ? product.variant_groups : [];
  if (variantGroups.some((group) => Array.isArray(group?.variants) && group.variants.length > 0)) {
    return PRODUCT_TYPES.VARIABLE;
  }

  return PRODUCT_TYPES.SIMPLE;
};

const formatMoney = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return null;
  return `£${amount.toFixed(2)}`;
};

export const getProductPriceDisplay = (product = {}) => {
  const type = resolveProductType(product);

  if (type === PRODUCT_TYPES.CUSTOM) {
    return { mode: 'custom', text: 'Custom Pricing', numericPrice: null };
  }

  if (type === PRODUCT_TYPES.SIMPLE) {
    const simplePrice = formatMoney(product.price);
    return { mode: 'simple', text: simplePrice || '£0.00', numericPrice: Number(product.price || 0) };
  }

  const rangeMin = Number(product.minPrice);
  const rangeMax = Number(product.maxPrice);
  if (Number.isFinite(rangeMin) && Number.isFinite(rangeMax) && rangeMax >= rangeMin) {
    if (rangeMin === rangeMax) {
      return { mode: 'variable', text: formatMoney(rangeMin) || '£0.00', numericPrice: rangeMin };
    }
    return {
      mode: 'variable',
      text: `${formatMoney(rangeMin)} - ${formatMoney(rangeMax)}`,
      numericPrice: rangeMin,
    };
  }

  const basePrice = Number(product.price || 0);
  return { mode: 'variable', text: formatMoney(basePrice) || '£0.00', numericPrice: basePrice };
};
