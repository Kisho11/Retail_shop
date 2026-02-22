import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import products from '../data/products';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === parseInt(id, 10));

  const defaultColor = product?.colors?.[0] || '';
  const defaultSize = product?.sizes?.[0] || '';

  const [activeView, setActiveView] = useState('image');
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [quantity, setQuantity] = useState(1);

  const unitPrice = useMemo(() => product?.salePrice || product?.price || 0, [product]);

  if (!product) {
    return (
      <div className="shell py-16 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Product Not Found</h1>
        <p className="text-slate-600 mb-8">The product you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg bg-slate-900 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, {
      color: selectedColor || null,
      size: selectedSize || null,
      quantity,
    });
  };

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const has3D = Boolean(product.modelUrl);

  const normalizeQuantity = (next) => {
    const parsed = Number(next);
    if (!Number.isFinite(parsed)) return 1;
    return Math.min(50, Math.max(1, parsed));
  };

  return (
    <section className="shell py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-sm font-semibold text-blue-700 hover:text-blue-500 transition"
      >
        ← Back to products
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setActiveView('image')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeView === 'image' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Image View
            </button>
            <button
              onClick={() => has3D && setActiveView('3d')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                activeView === '3d' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              } ${has3D ? '' : 'cursor-not-allowed opacity-50'}`}
              disabled={!has3D}
            >
              3D Viewer
            </button>
          </div>

          <div className="overflow-hidden rounded-xl bg-slate-100">
            {activeView === '3d' && has3D ? (
              <model-viewer
                src={product.modelUrl}
                alt={`${product.name} 3D model`}
                camera-controls
                auto-rotate
                ar
                shadow-intensity="1"
                style={{ width: '100%', height: '420px', backgroundColor: '#f1f5f9' }}
              >
                <div slot="poster" className="flex h-full items-center justify-center text-slate-600">
                  Loading 3D model...
                </div>
              </model-viewer>
            ) : product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-[420px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center text-slate-500">No image available</div>
            )}
          </div>

          <p className="mt-3 text-xs font-medium text-slate-500">
            {has3D ? '3D tip: drag to rotate, scroll to zoom.' : '3D model not available for this product yet.'}
          </p>
        </div>

        <div>
          <h1 className="mb-4 text-4xl font-bold text-slate-900">{product.name}</h1>

          {product.categories?.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {product.categories.map((cat) => (
                <span key={cat} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {cat}
                </span>
              ))}
            </div>
          )}

          <p className="mb-6 text-lg leading-relaxed text-slate-700">{product.description}</p>

          <div className="mb-6 rounded-xl border border-slate-200 p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-slate-600">Order Options</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {product.colors?.length > 0 && (
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Color</label>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    {product.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Quantity</label>
              <div className="inline-flex items-center rounded-lg border border-slate-300">
                <button
                  onClick={() => setQuantity((prev) => normalizeQuantity(prev - 1))}
                  className="px-3 py-2 text-slate-700"
                  type="button"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(normalizeQuantity(e.target.value))}
                  className="w-16 border-x border-slate-300 px-2 py-2 text-center focus:outline-none"
                />
                <button
                  onClick={() => setQuantity((prev) => normalizeQuantity(prev + 1))}
                  className="px-3 py-2 text-slate-700"
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mb-7 rounded-xl border border-slate-200 p-5">
            {product.salePrice ? (
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-lg text-slate-400 line-through">${product.price}</p>
                  <p className="text-4xl font-extrabold text-slate-900">${product.salePrice}</p>
                </div>
                <span className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-bold text-white">
                  Save {discount}%
                </span>
              </div>
            ) : (
              <p className="text-4xl font-extrabold text-slate-900">${product.price}</p>
            )}
            <p className="mt-2 text-sm text-slate-600">Line total: ${(unitPrice * quantity).toFixed(2)}</p>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full rounded-xl bg-slate-900 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-700"
          >
            Add to Cart
          </button>

          <div className="mt-7 rounded-xl bg-slate-100 p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-600">Detailed Information</h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
              {product.material && <p><strong>Material:</strong> {product.material}</p>}
              {product.finish && <p><strong>Finish:</strong> {product.finish}</p>}
              {product.warranty && <p><strong>Warranty:</strong> {product.warranty}</p>}
              {product.leadTime && <p><strong>Lead Time:</strong> {product.leadTime}</p>}
            </div>

            {product.specs && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-bold text-slate-800">Specifications</h4>
                <ul className="space-y-1 text-sm text-slate-700">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {product.industries?.length > 0 && (
            <div className="mt-6 rounded-xl bg-slate-100 p-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-600">Ideal for</h3>
              <div className="flex flex-wrap gap-2">
                {product.industries.map((industry) => (
                  <span key={industry} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700">
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
