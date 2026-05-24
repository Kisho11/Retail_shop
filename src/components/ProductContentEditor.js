import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import UiIcon from './UiIcon';

const SAFE_URL_PATTERN = /^(https?:|mailto:|tel:)/i;
import {
  createDefaultProductContent,
  createImageBlock,
  createListBlock,
  createTableBlock,
  createTextBlock,
  normalizeProductContent,
} from '../utils/productContent';

const textBlockLabels = {
  paragraph: 'Paragraph',
  heading: 'Heading',
  subheading: 'Subheading',
  quote: 'Quote',
  table: 'Table',
};

function ProductContentEditor({ value, onChange }) {
  const content = normalizeProductContent(value);
  const activeBlockIdRef = useRef(null);
  const blockRefs = useRef({});

  useEffect(() => {
    content.blocks.forEach((block) => {
      if (!['paragraph', 'heading', 'subheading', 'quote'].includes(block.type)) return;
      const node = blockRefs.current[block.id];
      if (!node) return;
      const clean = DOMPurify.sanitize(block.html || '');
      if (node.innerHTML !== clean) {
        node.innerHTML = clean;
      }
    });
  }, [content]);

  const updateContent = (nextBlocks) => {
    onChange({
      version: 1,
      updatedAt: new Date().toISOString(),
      blocks: nextBlocks,
    });
  };

  const updateBlock = (blockId, updater) => {
    updateContent(
      content.blocks.map((block) => (block.id === blockId ? updater(block) : block))
    );
  };

  const addBlock = (type) => {
    const nextBlock =
      type === 'image'
        ? createImageBlock()
        : type === 'table'
          ? createTableBlock()
        : type === 'bullet-list' || type === 'number-list'
          ? createListBlock(type)
          : createTextBlock(type);
    updateContent([...content.blocks, nextBlock]);
  };

  const moveBlock = (blockId, direction) => {
    const index = content.blocks.findIndex((block) => block.id === blockId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= content.blocks.length) return;
    const nextBlocks = [...content.blocks];
    const [moved] = nextBlocks.splice(index, 1);
    nextBlocks.splice(targetIndex, 0, moved);
    updateContent(nextBlocks);
  };

  const removeBlock = (blockId) => {
    const nextBlocks = content.blocks.filter((block) => block.id !== blockId);
    updateContent(nextBlocks.length > 0 ? nextBlocks : createDefaultProductContent().blocks);
  };

  const runInlineCommand = (command) => {
    const activeBlock = content.blocks.find((block) => block.id === activeBlockIdRef.current);
    if (!activeBlock || !['paragraph', 'heading', 'subheading', 'quote'].includes(activeBlock.type)) return;
    const node = blockRefs.current[activeBlock.id];
    if (!node) return;
    node.focus();
    document.execCommand(command, false);
    updateBlock(activeBlock.id, (block) => ({ ...block, html: node.innerHTML }));
  };

  const applyLink = () => {
    const href = (window.prompt('Enter a URL') || '').trim();
    if (!href) return;
    if (!SAFE_URL_PATTERN.test(href)) {
      window.alert('Invalid URL. Only http, https, mailto, and tel links are allowed.');
      return;
    }
    const activeBlock = content.blocks.find((block) => block.id === activeBlockIdRef.current);
    const node = activeBlock ? blockRefs.current[activeBlock.id] : null;
    if (!node) return;
    node.focus();
    document.execCommand('createLink', false, href);
    updateBlock(activeBlock.id, (block) => ({ ...block, html: DOMPurify.sanitize(node.innerHTML) }));
  };

  const handleImageUpload = (blockId, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      updateBlock(blockId, (block) => ({ ...block, src: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleListItemChange = (block, itemIndex, nextValue) => {
    updateBlock(block.id, (current) => ({
      ...current,
      items: current.items.map((item, index) => (index === itemIndex ? nextValue : item)),
    }));
  };

  const handleTableHeaderChange = (blockId, headerIndex, nextValue) => {
    updateBlock(blockId, (current) => ({
      ...current,
      headers: current.headers.map((header, index) => (index === headerIndex ? nextValue : header)),
    }));
  };

  const handleTableCellChange = (blockId, rowIndex, cellIndex, nextValue) => {
    updateBlock(blockId, (current) => ({
      ...current,
      rows: current.rows.map((row, currentRowIndex) =>
        currentRowIndex === rowIndex
          ? row.map((cell, currentCellIndex) => (currentCellIndex === cellIndex ? nextValue : cell))
          : row
      ),
    }));
  };

  const addTableRow = (blockId) => {
    updateBlock(blockId, (current) => ({
      ...current,
      rows: [...current.rows, Array.from({ length: current.headers.length }, () => '')],
    }));
  };

  const removeTableRow = (blockId) => {
    updateBlock(blockId, (current) => ({
      ...current,
      rows: current.rows.length > 1 ? current.rows.slice(0, -1) : current.rows,
    }));
  };

  const addTableColumn = (blockId) => {
    updateBlock(blockId, (current) => ({
      ...current,
      headers: [...current.headers, `Column ${current.headers.length + 1}`],
      rows: current.rows.map((row) => [...row, '']),
    }));
  };

  const removeTableColumn = (blockId) => {
    updateBlock(blockId, (current) => ({
      ...current,
      headers: current.headers.length > 1 ? current.headers.slice(0, -1) : current.headers,
      rows: current.rows.map((row) => (row.length > 1 ? row.slice(0, -1) : row)),
    }));
  };

  const ToolbarButton = ({ icon, label, onClick, variant = 'secondary' }) => (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        variant === 'primary'
          ? 'bg-primary text-white hover:bg-red-800'
          : variant === 'dark'
            ? 'bg-slate-900 text-white hover:bg-slate-700'
            : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      <UiIcon name={icon} className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  const SmallActionButton = ({ icon, label, onClick, disabled = false, tone = 'neutral' }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${
        tone === 'danger'
          ? 'border border-red-200 text-red-700 hover:bg-red-50'
          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
      }`}
    >
      <UiIcon name={icon} className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        <ToolbarButton icon="bold" label="Bold" onClick={() => runInlineCommand('bold')} />
        <ToolbarButton icon="italic" label="Italic" onClick={() => runInlineCommand('italic')} />
        <ToolbarButton icon="underline" label="Underline" onClick={() => runInlineCommand('underline')} />
        <ToolbarButton icon="link" label="Link" onClick={applyLink} />
        <div className="mx-2 hidden w-px bg-slate-200 sm:block" />
        <ToolbarButton icon="paragraph" label="Paragraph" onClick={() => addBlock('paragraph')} variant="dark" />
        <ToolbarButton icon="heading" label="Heading" onClick={() => addBlock('heading')} variant="dark" />
        <ToolbarButton icon="subheading" label="Subheading" onClick={() => addBlock('subheading')} variant="dark" />
        <ToolbarButton icon="list" label="Bullet List" onClick={() => addBlock('bullet-list')} variant="dark" />
        <ToolbarButton icon="orderedList" label="Numbered List" onClick={() => addBlock('number-list')} variant="dark" />
        <ToolbarButton icon="quote" label="Quote" onClick={() => addBlock('quote')} variant="dark" />
        <ToolbarButton icon="table" label="Table" onClick={() => addBlock('table')} variant="dark" />
        <ToolbarButton icon="image" label="Image" onClick={() => addBlock('image')} variant="primary" />
      </div>

      <div className="space-y-4">
        {content.blocks.map((block, index) => {
          const isTextBlock = ['paragraph', 'heading', 'subheading', 'quote'].includes(block.type);
          return (
            <div key={block.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {textBlockLabels[block.type] || block.type.replace('-', ' ')}
                </div>
                <div className="flex flex-wrap gap-2">
                  <SmallActionButton icon="arrowUp" label="Up" onClick={() => moveBlock(block.id, -1)} disabled={index === 0} />
                  <SmallActionButton icon="arrowDown" label="Down" onClick={() => moveBlock(block.id, 1)} disabled={index === content.blocks.length - 1} />
                  <SmallActionButton icon="trash" label="Delete" onClick={() => removeBlock(block.id)} tone="danger" />
                </div>
              </div>

              {isTextBlock && (
                <div
                  ref={(node) => {
                    blockRefs.current[block.id] = node;
                  }}
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => {
                    activeBlockIdRef.current = block.id;
                  }}
                  onInput={(event) => {
                    const nextHtml = event.currentTarget.innerHTML;
                    updateBlock(block.id, (current) => ({ ...current, html: nextHtml }));
                  }}
                  className={`min-h-[120px] rounded-xl border border-slate-200 px-4 py-3 focus:border-primary focus:outline-none ${
                    block.type === 'heading'
                      ? 'text-3xl font-bold text-slate-900'
                      : block.type === 'subheading'
                        ? 'text-xl font-bold text-slate-800'
                        : block.type === 'quote'
                          ? 'border-l-4 border-primary bg-slate-50 italic text-slate-700'
                          : 'text-base text-slate-800'
                  }`}
                  data-placeholder="Write content here..."
                />
              )}

              {(block.type === 'bullet-list' || block.type === 'number-list') && (
                <div className="space-y-3">
                  {(block.items || []).map((item, itemIndex) => (
                    <div key={`${block.id}-item-${itemIndex}`} className="flex items-start gap-3">
                      <span className="mt-3 text-sm font-semibold text-slate-500">
                        {block.type === 'number-list' ? `${itemIndex + 1}.` : '•'}
                      </span>
                      <textarea
                        value={item}
                        onChange={(event) => handleListItemChange(block, itemIndex, event.target.value)}
                        rows="2"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none"
                        placeholder="List item"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateBlock(block.id, (current) => ({ ...current, items: [...current.items, ''] }))}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      <UiIcon name="plus" className="h-4 w-4" />
                      <span>Add Item</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateBlock(block.id, (current) => ({ ...current, items: current.items.length > 1 ? current.items.slice(0, -1) : current.items }))}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      <UiIcon name="trash" className="h-4 w-4" />
                      <span>Remove Last</span>
                    </button>
                  </div>
                </div>
              )}

              {block.type === 'table' && (
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-full border-collapse">
                      <thead className="bg-slate-50">
                        <tr>
                          {block.headers.map((header, headerIndex) => (
                            <th key={`${block.id}-header-${headerIndex}`} className="border-b border-r border-slate-200 p-2 last:border-r-0">
                              <input
                                type="text"
                                value={header}
                                onChange={(event) => handleTableHeaderChange(block.id, headerIndex, event.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-primary focus:outline-none"
                                placeholder={`Column ${headerIndex + 1}`}
                              />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, rowIndex) => (
                          <tr key={`${block.id}-row-${rowIndex}`}>
                            {row.map((cell, cellIndex) => (
                              <td key={`${block.id}-cell-${rowIndex}-${cellIndex}`} className="border-r border-t border-slate-200 p-2 last:border-r-0">
                                <textarea
                                  value={cell}
                                  onChange={(event) => handleTableCellChange(block.id, rowIndex, cellIndex, event.target.value)}
                                  rows="2"
                                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-primary focus:outline-none"
                                  placeholder="Cell value"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => addTableRow(block.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      <UiIcon name="plus" className="h-4 w-4" />
                      <span>Add Row</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTableRow(block.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      <UiIcon name="trash" className="h-4 w-4" />
                      <span>Remove Row</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addTableColumn(block.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      <UiIcon name="plus" className="h-4 w-4" />
                      <span>Add Column</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTableColumn(block.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      <UiIcon name="trash" className="h-4 w-4" />
                      <span>Remove Column</span>
                    </button>
                  </div>
                </div>
              )}

              {block.type === 'image' && (
                <div className="space-y-4">
                  {block.src ? (
                    <img src={block.src} alt={block.alt || 'Editor upload'} className="max-h-80 w-full rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                      Upload an image or paste a URL below
                    </div>
                  )}
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                      Upload image
                      <input
                        type="file"
                        accept="image/*"
                        className="mt-2 block w-full text-sm"
                        onChange={(event) => handleImageUpload(block.id, event.target.files?.[0])}
                      />
                    </label>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Image URL</label>
                      <input
                        type="text"
                        value={block.src}
                        onChange={(event) => updateBlock(block.id, (current) => ({ ...current, src: event.target.value }))}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Alt text</label>
                      <input
                        type="text"
                        value={block.alt}
                        onChange={(event) => updateBlock(block.id, (current) => ({ ...current, alt: event.target.value }))}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none"
                        placeholder="Describe the image"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-slate-700">Caption</label>
                      <input
                        type="text"
                        value={block.caption}
                        onChange={(event) => updateBlock(block.id, (current) => ({ ...current, caption: event.target.value }))}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-primary focus:outline-none"
                        placeholder="Optional caption"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductContentEditor;
