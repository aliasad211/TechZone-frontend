import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, getProductMeta } from '../utils/api';
import { useCart } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiSliders, FiChevronDown, FiStar, FiSearch } from 'react-icons/fi';

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
            {category && <span style={{ color: 'var(--tz-accent)', fontWeight: '600' }}> · {category}</span>}
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
            <div style={s.noResultsIcon}><FiSearch size={30} /></div>
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
                    <span style={s.rating}><FiStar size={11} fill="currentColor" /> {product.ratings || '0'} ({product.numReviews})</span>
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
    maxWidth: '1240px', margin: '0 auto', padding: '36px 24px', display: 'flex', gap: '32px',
  },
  sidebar: {
    width: '240px', flexShrink: 0, background: 'var(--tz-paper)', borderRadius: '16px',
    padding: '26px', border: '1px solid var(--tz-border)', alignSelf: 'flex-start',
    position: 'sticky', top: '88px',
  },
  filterHeader: {
    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px', color: 'var(--tz-ink)',
  },
  filterTitle: {
    fontSize: '16px', fontWeight: '700', color: 'var(--tz-ink)', margin: 0,
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em',
  },
  filterSection: { marginBottom: '8px' },
  filterDivider: { height: '1px', background: 'var(--tz-border)', margin: '18px 0' },
  filterLabel: {
    fontSize: '11px', fontWeight: '600', color: 'var(--tz-text-muted)', margin: '0 0 10px',
    textTransform: 'uppercase', letterSpacing: '1.2px',
  },
  filterItem: {
    display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px',
    border: 'none', background: 'none', cursor: 'pointer', color: 'var(--tz-text-secondary)',
    fontSize: '13.5px', borderRadius: '8px', transition: 'all 0.2s ease',
  },
  activeFilter: {
    display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px',
    border: 'none', background: 'var(--tz-ink)', cursor: 'pointer',
    color: '#ffffff', fontSize: '13.5px', borderRadius: '8px', fontWeight: '600',
  },
  toolbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '22px', flexWrap: 'wrap', gap: '10px',
  },
  resultText: { color: 'var(--tz-text-secondary)', margin: 0, fontSize: '14px' },
  sortWrap: { position: 'relative' },
  sortIcon: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    color: 'var(--tz-text-secondary)', pointerEvents: 'none', fontSize: '14px',
  },
  sortSelect: {
    padding: '10px 34px 10px 14px', border: '1px solid var(--tz-border)',
    borderRadius: '10px', fontSize: '13px', color: 'var(--tz-ink)',
    background: 'var(--tz-paper)', appearance: 'none', cursor: 'pointer',
    outline: 'none', fontWeight: 500, transition: 'border-color 0.2s ease',
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '18px',
  },
  card: {
    background: 'var(--tz-paper)', borderRadius: '14px', overflow: 'hidden',
    border: '1px solid var(--tz-border)', transition: 'all 0.25s ease',
    position: 'relative',
  },
  discountTag: {
    position: 'absolute', top: '10px', left: '10px', zIndex: 2,
    background: 'var(--tz-ink)', color: '#fff', padding: '4px 9px',
    borderRadius: '6px', fontSize: '11px', fontWeight: '700',
  },
  imgWrap: {
    background: 'var(--tz-canvas)', padding: '18px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  img: { width: '100%', height: '160px', objectFit: 'contain' },
  info: { padding: '16px' },
  brand: {
    color: 'var(--tz-text-muted)', fontSize: '10px', margin: '0 0 5px',
    textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.6px',
  },
  name: {
    color: 'var(--tz-ink)', fontSize: '13.5px', fontWeight: '600', textDecoration: 'none',
    display: 'block', lineHeight: '1.4', marginBottom: '8px',
  },
  priceRow: { display: 'flex', gap: '8px', alignItems: 'baseline', margin: '8px 0' },
  price: {
    color: 'var(--tz-ink)', fontSize: '17px', fontWeight: '700',
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em',
  },
  original: { color: 'var(--tz-text-muted)', fontSize: '11px', textDecoration: 'line-through' },
  cardFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px',
  },
  rating: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    background: 'var(--tz-canvas)', color: 'var(--tz-text-body)',
    padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
  },
  addBtn: {
    background: 'var(--tz-ink)', color: '#fff', border: 'none',
    padding: '7px 15px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center',
    gap: '5px', transition: 'all 0.2s ease',
  },
  disabledBtn: {
    background: 'var(--tz-canvas-2)', color: 'var(--tz-text-muted)', border: 'none',
    padding: '7px 15px', borderRadius: '8px', cursor: 'not-allowed', fontSize: '12px', fontWeight: 600,
  },
  noResults: { textAlign: 'center', padding: '90px 20px' },
  noResultsIcon: {
    width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 16px',
    background: 'var(--tz-canvas)', color: 'var(--tz-text-muted)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  noResultsTitle: {
    fontSize: '20px', fontWeight: '700', color: 'var(--tz-ink)', margin: '0 0 8px',
    fontFamily: "'Outfit', sans-serif",
  },
  noResultsSub: { color: 'var(--tz-text-secondary)', fontSize: '14px', margin: '0 0 22px' },
  clearBtn: {
    background: 'var(--tz-ink)', color: '#fff', border: 'none',
    padding: '11px 24px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer',
  },
  pagination: { display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '36px' },
  pageBtn: {
    minWidth: '40px', height: '40px', padding: '0 6px', border: '1px solid var(--tz-border)',
    borderRadius: '10px', background: 'var(--tz-paper)', color: 'var(--tz-text-body)',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s ease',
  },
  pageBtnActive: {
    background: 'var(--tz-ink)', color: '#ffffff', borderColor: 'var(--tz-ink)',
  },
  skeletonCard: {
    background: 'var(--tz-paper)', borderRadius: '14px', overflow: 'hidden',
    border: '1px solid var(--tz-border)',
  },
  skeletonImg: {
    height: '170px', background: 'linear-gradient(90deg, #f2f2ee 25%, #e7e7e1 50%, #f2f2ee 75%)',
    backgroundSize: '200% 100%', animation: 'tz-shimmer 1.5s infinite',
  },
  skeletonBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  skeletonLine: {
    height: '10px', borderRadius: '5px',
    background: 'linear-gradient(90deg, #f2f2ee 25%, #e7e7e1 50%, #f2f2ee 75%)',
    backgroundSize: '200% 100%', animation: 'tz-shimmer 1.5s infinite',
  },
};

export default ProductsPage;
