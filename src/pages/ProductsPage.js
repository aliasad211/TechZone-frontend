import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, getProductMeta } from '../utils/api';
import { useCart } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiSliders, FiGrid, FiChevronDown } from 'react-icons/fi';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ categories: [], brands: [] });
  const [pages, setPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    document.title = category ? `${category} — TechZone` : 'All Products — TechZone';
  }, [category]);

  useEffect(() => {
    getProductMeta().then(res => setMeta(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page };
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    if (brand) params.brand = brand;
    if (sort) params.sort = sort;

    getProducts(params)
      .then(res => { setProducts(res.data.products); setPages(res.data.pages); })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, [keyword, category, brand, sort, page]);

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div style={s.page}>
      {/* Filters Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.filterHeader}>
          <FiSliders size={16} />
          <h3 style={s.filterTitle}>Filters</h3>
        </div>

        <div style={s.filterSection}>
          <h4 style={s.filterLabel}>Category</h4>
          <button onClick={() => updateFilter('category', '')} style={!category ? s.activeFilter : s.filterItem}>All Categories</button>
          {meta.categories.map(c => (
            <button key={c} onClick={() => updateFilter('category', c)} style={c === category ? s.activeFilter : s.filterItem}>{c}</button>
          ))}
        </div>

        <div style={s.filterDivider} />

        <div style={s.filterSection}>
          <h4 style={s.filterLabel}>Brand</h4>
          <button onClick={() => updateFilter('brand', '')} style={!brand ? s.activeFilter : s.filterItem}>All Brands</button>
          {meta.brands.map(b => (
            <button key={b} onClick={() => updateFilter('brand', b)} style={b === brand ? s.activeFilter : s.filterItem}>{b}</button>
          ))}
        </div>
      </aside>

      {/* Products Main Area */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Toolbar */}
        <div style={s.toolbar}>
          <p style={s.resultText}>
            {keyword && <span>Results for &ldquo;{keyword}&rdquo;</span>}
            {category && <span style={{ color: '#00a3ff', fontWeight: '600' }}> · {category}</span>}
            {!keyword && !category && <span>All Products</span>}
          </p>
          <div style={s.sortWrap}>
            <FiChevronDown style={s.sortIcon} />
            <select value={sort} onChange={e => updateFilter('sort', e.target.value)} style={s.sortSelect}>
              <option value="">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={s.grid}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={s.skeletonCard}>
                <div style={s.skeletonImg} />
                <div style={s.skeletonBody}>
                  <div style={{ ...s.skeletonLine, width: '40%' }} />
                  <div style={{ ...s.skeletonLine, width: '75%' }} />
                  <div style={{ ...s.skeletonLine, width: '55%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={s.noResults}>
            <div style={s.noResultsIcon}>😔</div>
            <h3 style={s.noResultsTitle}>No products found</h3>
            <p style={s.noResultsSub}>Try adjusting your filters or search terms</p>
            <button onClick={() => { setSearchParams({}); }} style={s.clearBtn}>Clear All Filters</button>
          </div>
        ) : (
          <div style={s.grid}>
            {products.map(product => (
              <div key={product._id} style={s.card}>
                {product.originalPrice && (
                  <div style={s.discountTag}>
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}
                <Link to={`/product/${product._id}`}>
                  <div style={s.imgWrap}>
                    <img src={product.images[0]?.url || 'https://via.placeholder.com/200x160?text=No+Image'} alt={product.name} style={s.img} />
                  </div>
                </Link>
                <div style={s.info}>
                  <p style={s.brand}>{product.brand}</p>
                  <Link to={`/product/${product._id}`} style={s.name}>{product.name}</Link>
                  <div style={s.priceRow}>
                    <span style={s.price}>Rs. {product.price.toLocaleString()}</span>
                    {product.originalPrice && <span style={s.original}>Rs. {product.originalPrice.toLocaleString()}</span>}
                  </div>
                  <div style={s.cardFooter}>
                    <span style={s.rating}>⭐ {product.ratings || '0'} ({product.numReviews})</span>
                    <button
                      onClick={() => { addToCart(product); toast.success('Added!'); }}
                      disabled={product.stock === 0}
                      style={product.stock > 0 ? s.addBtn : s.disabledBtn}
                    >
                      {product.stock > 0 ? <><FiShoppingCart size={12} /> Add</> : 'Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={s.pagination}>
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => updateFilter('page', String(i + 1))}
                style={{
                  ...s.pageBtn,
                  ...(page === i + 1 ? s.pageBtnActive : {}),
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const s = {
  page: {
    maxWidth: '1200px', margin: '0 auto', padding: '30px 20px', display: 'flex', gap: '28px',
  },
  sidebar: {
    width: '230px', flexShrink: 0, background: '#ffffff', borderRadius: '16px',
    padding: '24px', boxShadow: '0 2px 12px rgba(13,43,94,0.05)',
    border: '1px solid rgba(13,43,94,0.06)', alignSelf: 'flex-start',
    position: 'sticky', top: '84px',
  },
  filterHeader: {
    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: '#0D2B5E',
  },
  filterTitle: {
    fontSize: '17px', fontWeight: '700', color: '#0D2B5E', margin: 0,
    fontFamily: "'Outfit', sans-serif",
  },
  filterSection: { marginBottom: '8px' },
  filterDivider: {
    height: '1px', background: 'rgba(13,43,94,0.06)', margin: '16px 0',
  },
  filterLabel: {
    fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 8px',
    textTransform: 'uppercase', letterSpacing: '1px',
  },
  filterItem: {
    display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
    border: 'none', background: 'none', cursor: 'pointer', color: '#64748b',
    fontSize: '13px', borderRadius: '8px', transition: 'all 0.2s ease',
  },
  activeFilter: {
    display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
    border: 'none', background: 'rgba(0,163,255,0.08)', cursor: 'pointer',
    color: '#0D2B5E', fontSize: '13px', borderRadius: '8px', fontWeight: '600',
  },
  toolbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '20px', flexWrap: 'wrap', gap: '10px',
  },
  resultText: { color: '#64748b', margin: 0, fontSize: '14px' },
  sortWrap: { position: 'relative' },
  sortIcon: {
    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
    color: '#64748b', pointerEvents: 'none', fontSize: '14px',
  },
  sortSelect: {
    padding: '9px 30px 9px 14px', border: '1.5px solid rgba(13,43,94,0.1)',
    borderRadius: '10px', fontSize: '13px', color: '#475569',
    background: '#ffffff', appearance: 'none', cursor: 'pointer',
    outline: 'none', transition: 'border-color 0.3s ease',
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px',
  },
  card: {
    background: '#ffffff', borderRadius: '14px', overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(13,43,94,0.04)',
    border: '1px solid rgba(13,43,94,0.06)', transition: 'all 0.3s ease',
    position: 'relative',
  },
  discountTag: {
    position: 'absolute', top: '10px', left: '10px', zIndex: 2,
    background: '#ef4444', color: '#fff', padding: '3px 8px',
    borderRadius: '6px', fontSize: '11px', fontWeight: '700',
  },
  imgWrap: {
    background: '#f8fafc', padding: '10px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  img: {
    width: '100%', height: '160px', objectFit: 'contain',
  },
  info: { padding: '14px' },
  brand: {
    color: '#64748b', fontSize: '10px', margin: '0 0 4px',
    textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px',
  },
  name: {
    color: '#0D2B5E', fontSize: '13px', fontWeight: '600', textDecoration: 'none',
    display: 'block', lineHeight: '1.4', marginBottom: '6px',
  },
  priceRow: { display: 'flex', gap: '8px', alignItems: 'center', margin: '6px 0' },
  price: {
    color: '#0D2B5E', fontSize: '16px', fontWeight: '800',
    fontFamily: "'Outfit', sans-serif",
  },
  original: { color: '#94a3b8', fontSize: '11px', textDecoration: 'line-through' },
  cardFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px',
  },
  rating: {
    background: 'rgba(251,191,36,0.1)', color: '#92400e',
    padding: '2px 6px', borderRadius: '5px', fontSize: '11px', fontWeight: '600',
  },
  addBtn: {
    background: '#0D2B5E', color: '#fff', border: 'none',
    padding: '5px 14px', borderRadius: '7px', cursor: 'pointer',
    fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center',
    gap: '4px', transition: 'all 0.2s ease',
  },
  disabledBtn: {
    background: '#e2e8f0', color: '#94a3b8', border: 'none',
    padding: '5px 14px', borderRadius: '7px', cursor: 'not-allowed', fontSize: '12px',
  },
  noResults: {
    textAlign: 'center', padding: '80px 20px',
  },
  noResultsIcon: { fontSize: '56px', marginBottom: '12px' },
  noResultsTitle: {
    fontSize: '20px', fontWeight: '700', color: '#0D2B5E', margin: '0 0 8px',
  },
  noResultsSub: { color: '#64748b', fontSize: '14px', margin: '0 0 20px' },
  clearBtn: {
    background: '#0D2B5E', color: '#fff', border: 'none',
    padding: '10px 24px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer',
  },
  pagination: {
    display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '32px',
  },
  pageBtn: {
    width: '38px', height: '38px', border: '1.5px solid rgba(13,43,94,0.1)',
    borderRadius: '10px', background: '#ffffff', color: '#475569',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  pageBtnActive: {
    background: '#0D2B5E', color: '#ffffff', borderColor: '#0D2B5E',
  },
  skeletonCard: {
    background: '#ffffff', borderRadius: '14px', overflow: 'hidden',
    border: '1px solid rgba(13,43,94,0.06)',
  },
  skeletonImg: {
    height: '170px', background: 'linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%)',
    backgroundSize: '200% 100%', animation: 'tz-shimmer 1.5s infinite',
  },
  skeletonBody: { padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' },
  skeletonLine: {
    height: '10px', borderRadius: '5px',
    background: 'linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%)',
    backgroundSize: '200% 100%', animation: 'tz-shimmer 1.5s infinite',
  },
};

export default ProductsPage;
