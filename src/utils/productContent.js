const MAX_SUMMARY_LENGTH = 180;
const SAFE_HTML_TAGS = new Set(['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li']);
const SAFE_HTML_ATTRS = {
  a: new Set(['href', 'target', 'rel']),
};

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createTextBlock = (type = 'paragraph', html = '') => ({
  id: createId(type),
  type,
  html,
});

export const createListBlock = (type = 'bullet-list', items = ['']) => ({
  id: createId(type),
  type,
  items: items.length > 0 ? items : [''],
});

export const createImageBlock = () => ({
  id: createId('image'),
  type: 'image',
  src: '',
  alt: '',
  caption: '',
});

export const createTableBlock = (rows = 3, cols = 3) => ({
  id: createId('table'),
  type: 'table',
  headers: Array.from({ length: cols }, (_, index) => `Column ${index + 1}`),
  rows: Array.from({ length: rows }, () => Array.from({ length: cols }, () => '')),
});

export const createDefaultProductContent = (fallbackText = '') => ({
  version: 1,
  updatedAt: new Date().toISOString(),
  blocks: [createTextBlock('paragraph', fallbackText ? `<p>${fallbackText}</p>` : '')],
});

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const sanitizeListItems = (items) => (Array.isArray(items) ? items : []).map((item) => `${item || ''}`.trim());

const escapeHtml = (value = '') =>
  `${value || ''}`
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isSafeHref = (value = '') => /^(https?:|mailto:|tel:|\/)/i.test(value.trim());

export const sanitizeProductHtml = (value = '') => {
  const html = `${value || ''}`;
  if (!html.trim()) return '';

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return escapeHtml(stripHtml(html));
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(html, 'text/html');

  const sanitizeNode = (node) => {
    if (node.nodeType === window.Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== window.Node.ELEMENT_NODE) {
      return '';
    }

    const tag = node.tagName.toLowerCase();
    if (!SAFE_HTML_TAGS.has(tag) && tag !== 'a') {
      return Array.from(node.childNodes).map(sanitizeNode).join('');
    }

    const attrs = [];
    if (tag === 'a') {
      const href = node.getAttribute('href') || '';
      if (isSafeHref(href)) {
        attrs.push(`href="${escapeHtml(href)}"`);
        attrs.push('rel="noopener noreferrer"');
        attrs.push('target="_blank"');
      }
    } else {
      const allowedAttrs = SAFE_HTML_ATTRS[tag];
      if (allowedAttrs) {
        Array.from(node.attributes).forEach((attribute) => {
          if (allowedAttrs.has(attribute.name.toLowerCase())) {
            attrs.push(`${attribute.name}="${escapeHtml(attribute.value)}"`);
          }
        });
      }
    }

    const children = Array.from(node.childNodes).map(sanitizeNode).join('');
    if (tag === 'br') {
      return '<br />';
    }
    const attrString = attrs.length ? ` ${attrs.join(' ')}` : '';
    return `<${tag}${attrString}>${children}</${tag}>`;
  };

  return Array.from(document.body.childNodes).map(sanitizeNode).join('');
};

export const sanitizeMediaUrl = (value = '') => {
  const url = `${value || ''}`.trim();
  if (!url) return '';
  // data:image/svg+xml and data:text/* can carry embedded scripts — allow only raster types
  if (/^data:image\/(jpeg|jpg|png|webp|gif);/i.test(url)) return url;
  if (/^(https?:\/\/|\/uploads\/|blob:)/i.test(url)) {
    return url;
  }
  return '';
};

export const normalizeProductContent = (value, fallbackText = '') => {
  if (!value || typeof value !== 'object') {
    return createDefaultProductContent(fallbackText);
  }

  const blocks = Array.isArray(value.blocks)
    ? value.blocks
        .map((block, index) => {
          const baseId = block?.id || `block-${index + 1}`;
          if (block?.type === 'image') {
          return {
            id: baseId,
            type: 'image',
            src: sanitizeMediaUrl(block.src || ''),
            alt: stripHtml(block.alt || ''),
            caption: stripHtml(block.caption || ''),
          };
          }

          if (block?.type === 'bullet-list' || block?.type === 'number-list') {
            return {
            id: baseId,
            type: block.type,
            items: sanitizeListItems(block.items).length > 0 ? sanitizeListItems(block.items).map((item) => stripHtml(item)) : [''],
          };
          }

          if (block?.type === 'table') {
            const rawHeaders = Array.isArray(block.headers) ? block.headers : [];
            const normalizedHeaders = rawHeaders.length > 0 ? rawHeaders.map((item) => stripHtml(`${item || ''}`)) : ['Column 1', 'Column 2', 'Column 3'];
            const columnCount = normalizedHeaders.length;
            const normalizedRows = Array.isArray(block.rows) && block.rows.length > 0
              ? block.rows.map((row) =>
                  Array.from({ length: columnCount }, (_, index) => stripHtml(`${Array.isArray(row) ? row[index] || '' : ''}`))
                )
              : [Array.from({ length: columnCount }, () => '')];

            return {
              id: baseId,
              type: 'table',
              headers: normalizedHeaders,
              rows: normalizedRows,
            };
          }

          return {
            id: baseId,
            type: ['heading', 'subheading', 'quote', 'paragraph'].includes(block?.type) ? block.type : 'paragraph',
            html: sanitizeProductHtml(block?.html || ''),
          };
        })
        .filter(Boolean)
    : [];

  if (blocks.length === 0) {
    return createDefaultProductContent(fallbackText);
  }

  return {
    version: Number(value.version) || 1,
    updatedAt: value.updatedAt || new Date().toISOString(),
    blocks,
  };
};

export const extractProductContentPlainText = (content) => {
  const normalized = normalizeProductContent(content);
  return normalized.blocks
    .map((block) => {
      if (block.type === 'image') return block.alt || block.caption || '';
      if (block.type === 'bullet-list' || block.type === 'number-list') return block.items.join(' ');
      if (block.type === 'table') return [...(block.headers || []), ...((block.rows || []).flat())].join(' ');
      return stripHtml(block.html);
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const summarizeProductContent = (content, fallbackText = '') => {
  const plainText = extractProductContentPlainText(content) || `${fallbackText || ''}`.trim();
  if (!plainText) return '';
  if (plainText.length <= MAX_SUMMARY_LENGTH) return plainText;
  return `${plainText.slice(0, MAX_SUMMARY_LENGTH).trimEnd()}...`;
};

export const isProductContentEmpty = (content) => extractProductContentPlainText(content).length === 0;
