import React from 'react';
import { normalizeProductContent } from '../utils/productContent';

function ProductContentRenderer({ content }) {
  const normalized = normalizeProductContent(content);

  return (
    <div className="space-y-6">
      {normalized.blocks.map((block) => {
        if (block.type === 'heading') {
          return <div key={block.id} className="text-3xl font-bold text-slate-900" dangerouslySetInnerHTML={{ __html: block.html }} />;
        }

        if (block.type === 'subheading') {
          return <div key={block.id} className="text-xl font-bold text-slate-800" dangerouslySetInnerHTML={{ __html: block.html }} />;
        }

        if (block.type === 'quote') {
          return (
            <blockquote key={block.id} className="rounded-r-2xl border-l-4 border-primary bg-slate-50 px-5 py-4 italic text-slate-700">
              <div dangerouslySetInnerHTML={{ __html: block.html }} />
            </blockquote>
          );
        }

        if (block.type === 'bullet-list' || block.type === 'number-list') {
          const ListTag = block.type === 'number-list' ? 'ol' : 'ul';
          return (
            <ListTag key={block.id} className={`space-y-2 pl-6 text-slate-700 ${block.type === 'number-list' ? 'list-decimal' : 'list-disc'}`}>
              {block.items.filter(Boolean).map((item, index) => (
                <li key={`${block.id}-${index}`}>{item}</li>
              ))}
            </ListTag>
          );
        }

        if (block.type === 'table') {
          return (
            <div key={block.id} className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead className="bg-slate-50">
                  <tr>
                    {block.headers.map((header, index) => (
                      <th key={`${block.id}-header-${index}`} className="border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-900 last:border-r-0">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${block.id}-row-${rowIndex}`} className="align-top">
                      {row.map((cell, cellIndex) => (
                        <td key={`${block.id}-cell-${rowIndex}-${cellIndex}`} className="border-r border-t border-slate-200 px-4 py-3 last:border-r-0">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'image') {
          if (!block.src) return null;
          return (
            <figure key={block.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <img src={block.src} alt={block.alt || 'Product content'} className="w-full object-cover" />
              {block.caption && <figcaption className="px-4 py-3 text-sm text-slate-600">{block.caption}</figcaption>}
            </figure>
          );
        }

        return <div key={block.id} className="text-base leading-7 text-slate-700" dangerouslySetInnerHTML={{ __html: block.html }} />;
      })}
    </div>
  );
}

export default ProductContentRenderer;
