import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProductReviews, createReview, toggleWishlist } from '../utils/api';
import { useCart, useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiHeart, FiTruck, FiRefreshCw, FiShield, FiCreditCard, FiChevronRight, FiStar, FiCheckCircle, FiXCircle, FiFileText, FiMessageSquare } from 'react-icons/fi';

const Stars = ({ value, size = 15 }) => {
  const rounded = Math.round(value || 0);
  return (
    <span style={{ display: 'inline-flex', gap: '2px', color: 'var(--tz-accent)' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar key={i} size={size} fill={i < rounded ? 'currentColor' : 'none'} strokeWidth={i < rounded ? 0 : 2} />
      ))}
    </span>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    setLoading(true);
    Promise.all([getProductById(id), getProductReviews(id)])
      .then(([prodRes, revRes]) => {
        setProduct(prodRes.data);
        setReviews(revRes.data);
        document.title = `${prodRes.data.name} — TechZone`;
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first!'); return; }
    try {
      const { data } = await toggleWishlist(id);
      setInWishlist(data.added);
      toast.success(data.added ? 'Added to wishlist!' : 'Removed from wishlist!');
    } catch { toast.error('Failed'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to write a review!'); return; }
    setSubmittingReview(true);
    try {
      const { data } = await createReview(id, reviewForm);
      setReviews(prev => [{ ...data, user: { name: user.name } }, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted successfully!');
      const { data: updatedProd } = await getProductById(id);
      setProduct(updatedProd);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.spinner} />
      <p style={{ color: 'var(--tz-text-secondary)', marginTop: '12px' }}>Loading product...</p>
    </div>
  );
  if (!product) return <div style={s.loadingWrap}>Product not found</div>;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const FEATURES = [
    { icon: <FiTruck size={16} />, text: 'FREE Delivery on orders above Rs. 5,000' },
    { icon: <FiRefreshCw size={16} />, text: '7-day return policy' },
    { icon: <FiShield size={16} />, text: 'Official warranty' },
    { icon: <FiCreditCard size={16} />, text: 'Cash on delivery available' },
  ];

  return (
    <div style={s.container}>
      <nav style={s.breadcrumb}>
        <Link to="/" style={s.bcLink} className="tz-bc">Home</Link>
        <FiChevronRight size={12} style={{ color: 'var(--tz-text-muted)' }} />
        <Link to="/products" style={s.bcLink} className="tz-bc">Products</Link>
        <FiChevronRight size={12} style={{ color: 'var(--tz-text-muted)' }} />
        <Link to={`/products?category=${product.category}`} style={s.bcLink} className="tz-bc">{product.category}</Link>
        <FiChevronRight size={12} style={{ color: 'var(--tz-text-muted)' }} />
        <span style={{ color: 'var(--tz-ink)', fontWeight: '500' }}>{product.name}</span>
      </nav>

      <div style={s.mainGrid} className="tz-detail-grid">
        <div>
          <div style={s.mainImgWrap}>
            <img
              src={product.images[selectedImg]?.url || 'https://via.placeholder.com/400x350?text=No+Image'}
              alt={product.name}
              style={s.mainImg}
            />
            {discount > 0 && <span style={s.discountBadge}>-{discount}%</span>}
          </div>
          {product.images.length > 1 && (
            <div style={s.thumbnails}>
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`view-${i}`}
                  onClick={() => setSelectedImg(i)}
                  style={{ ...s.thumb, ...(selectedImg === i ? s.activeThumb : {}) }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <p style={s.brand}>{product.brand}</p>
          <h1 style={s.productName}>{product.name}</h1>

          <div style={s.ratingRow}>
            <Stars value={product.ratings} size={17} />
            <span style={s.ratingText}>{product.ratings} ({product.numReviews} reviews)</span>
          </div>

          <div style={s.priceRow}>
            <span style={s.price}>Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span style={s.originalPrice}>Rs. {product.originalPrice.toLocaleString()}</span>
                <span style={s.saveBadge}>Save Rs. {(product.originalPrice - product.price).toLocaleString()}</span>
              </>
            )}
          </div>

          <p style={s.description}>{product.description}</p>

          <div style={s.stockRow}>
            {product.stock > 0 ? (
              <span style={s.inStock}><FiCheckCircle size={15} /> In Stock ({product.stock} available)</span>
            ) : (
              <span style={s.outStock}><FiXCircle size={15} /> Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div style={s.actions}>
              <div style={s.qtyRow}>
                <label style={s.qtyLabel}>Quantity</label>
                <div style={s.qtyControls}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={s.qtyBtn} className="tz-qty">−</button>
                  <span style={s.qtyNum}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={s.qtyBtn} className="tz-qty">+</button>
                </div>
              </div>
              <div style={s.btnRow}>
                <button onClick={handleAddToCart} style={s.addCartBtn} className="tz-btn-ink">
                  <FiShoppingCart size={16} /> Add to Cart
                </button>
                <button onClick={handleWishlist} style={{ ...s.wishlistBtn, color: inWishlist ? 'var(--tz-error)' : 'var(--tz-text-body)', borderColor: inWishlist ? '#f6caca' : 'var(--tz-border)' }}>
                  <FiHeart size={16} fill={inWishlist ? 'var(--tz-error)' : 'none'} /> Wishlist
                </button>
              </div>
            </div>
          )}

          <div style={s.features}>
            {FEATURES.map((f, i) => (
              <div key={i} style={s.feature}>
                <div style={s.featureIcon}>{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.tabsSection}>
        <div style={s.tabs}>
          {['specs', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...s.tab, ...(activeTab === tab ? s.activeTab : {}) }}>
              {tab === 'specs'
                ? <><FiFileText size={15} /> Specifications</>
                : <><FiMessageSquare size={15} /> Reviews ({reviews.length})</>}
            </button>
          ))}
        </div>

        {activeTab === 'specs' && (
          <div style={s.tabContent}>
            {product.specifications.length > 0 ? (
              <table style={s.specsTable}>
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'var(--tz-canvas)' : 'transparent' }}>
                      <td style={s.specKey}>{spec.key}</td>
                      <td style={s.specVal}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ color: 'var(--tz-text-muted)' }}>No specifications available</p>}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={s.tabContent}>
            {user && (
              <div style={s.reviewForm}>
                <h3 style={s.reviewFormTitle}>Write your review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div style={s.field}>
                    <label style={s.label}>Rating</label>
                    <select value={reviewForm.rating} onChange={e => setReviewForm(p => ({ ...p, rating: Number(e.target.value) }))} style={s.select}>
                      {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Title</label>
                    <input style={s.input} className="tz-input" value={reviewForm.title} onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))} required placeholder="Short title..." />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Review</label>
                    <textarea style={{ ...s.input, height: '90px', resize: 'vertical' }} className="tz-input" value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} required placeholder="Share your experience..." />
                  </div>
                  <button type="submit" disabled={submittingReview} style={s.submitBtn} className="tz-btn-ink">
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}

            {reviews.length === 0 ? (
              <p style={{ color: 'var(--tz-text-muted)', padding: '20px 0' }}>No reviews yet. Be the first to review!</p>
            ) : reviews.map((rev, i) => (
              <div key={i} style={s.reviewCard}>
                <div style={s.reviewHeader}>
                  <div style={s.reviewAvatar}>{rev.user?.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong style={{ color: 'var(--tz-ink)', fontSize: '14px' }}>{rev.user?.name}</strong>
                    <div style={{ marginTop: '3px' }}><Stars value={rev.rating} size={13} /></div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--tz-text-muted)', fontSize: '12px' }}>
                    {new Date(rev.createdAt).toLocaleDateString('en-PK')}
                  </span>
                </div>
                <h4 style={{ color: 'var(--tz-ink)', margin: '8px 0 4px', fontSize: '15px' }}>{rev.title}</h4>
                <p style={{ color: 'var(--tz-text-body)', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  container: { maxWidth: '1140px', margin: '0 auto', padding: '28px 24px 56px' },
  loadingWrap: { textAlign: 'center', padding: '90px', color: 'var(--tz-text-secondary)', fontSize: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  spinner: {
    width: '36px', height: '36px', border: '3px solid var(--tz-border)',
    borderTopColor: 'var(--tz-ink)', borderRadius: '50%', animation: 'tz-rotate 0.8s linear infinite',
  },
  breadcrumb: {
    display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '28px',
    fontSize: '13px', color: 'var(--tz-text-muted)', flexWrap: 'wrap',
  },
  bcLink: { color: 'var(--tz-text-secondary)', textDecoration: 'none', fontWeight: '500' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' },
  mainImgWrap: {
    position: 'relative', background: 'var(--tz-canvas)', borderRadius: '20px',
    overflow: 'hidden', marginBottom: '12px', border: '1px solid var(--tz-border)',
  },
  mainImg: { width: '100%', height: '400px', objectFit: 'contain', padding: '28px', boxSizing: 'border-box' },
  discountBadge: {
    position: 'absolute', top: '16px', left: '16px',
    background: 'var(--tz-ink)', color: '#fff',
    padding: '5px 12px', borderRadius: '9px', fontSize: '13px', fontWeight: '700',
  },
  thumbnails: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  thumb: {
    width: '74px', height: '74px', objectFit: 'contain',
    background: 'var(--tz-canvas)', borderRadius: '12px', cursor: 'pointer',
    padding: '8px', border: '1px solid var(--tz-border)', boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  activeThumb: { border: '2px solid var(--tz-ink)' },
  brand: {
    color: 'var(--tz-accent)', fontSize: '12px', fontWeight: '600',
    textTransform: 'uppercase', margin: '0 0 8px', letterSpacing: '1.2px',
  },
  productName: {
    fontSize: '30px', fontWeight: '700', color: 'var(--tz-ink)', margin: '0 0 16px',
    lineHeight: '1.2', fontFamily: "'Outfit', 'Inter', sans-serif", letterSpacing: '-0.03em',
  },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' },
  ratingText: { color: 'var(--tz-text-secondary)', fontSize: '13px' },
  priceRow: {
    display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '20px', flexWrap: 'wrap',
  },
  price: {
    fontSize: '32px', fontWeight: '700', color: 'var(--tz-ink)',
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em',
  },
  originalPrice: { fontSize: '16px', color: 'var(--tz-text-muted)', textDecoration: 'line-through' },
  saveBadge: {
    background: 'var(--tz-accent-soft)', color: 'var(--tz-accent)',
    padding: '5px 12px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '600',
  },
  description: { color: 'var(--tz-text-body)', fontSize: '14.5px', lineHeight: '1.7', margin: '0 0 20px' },
  stockRow: { marginBottom: '20px' },
  inStock: { color: 'var(--tz-success)', fontSize: '14px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' },
  outStock: { color: 'var(--tz-error)', fontSize: '14px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' },
  actions: { marginBottom: '24px' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },
  qtyLabel: { color: 'var(--tz-text-body)', fontWeight: '600', fontSize: '14px' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--tz-border)', borderRadius: '10px', padding: '3px' },
  qtyBtn: {
    width: '34px', height: '34px', border: 'none',
    borderRadius: '8px', background: 'transparent', cursor: 'pointer',
    fontSize: '18px', fontWeight: '700', color: 'var(--tz-ink)', transition: 'all 0.2s ease',
  },
  qtyNum: { minWidth: '36px', textAlign: 'center', fontWeight: '700', fontSize: '15px', color: 'var(--tz-ink)' },
  btnRow: { display: 'flex', gap: '12px' },
  addCartBtn: {
    flex: 1, background: 'var(--tz-ink)', color: '#fff', border: '1px solid var(--tz-ink)',
    padding: '15px 20px', borderRadius: '12px', fontSize: '15px',
    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease',
  },
  wishlistBtn: {
    background: 'var(--tz-paper)', border: '1px solid var(--tz-border)',
    padding: '15px 20px', borderRadius: '12px', fontSize: '14px',
    cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center',
    gap: '6px', transition: 'all 0.2s ease',
  },
  features: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px',
    background: 'var(--tz-canvas)', borderRadius: '14px',
    padding: '20px', border: '1px solid var(--tz-border)',
  },
  feature: {
    display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--tz-text-body)', alignItems: 'center',
  },
  featureIcon: {
    width: '34px', height: '34px', borderRadius: '9px',
    background: 'var(--tz-ink)', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  tabsSection: {
    background: 'var(--tz-paper)', borderRadius: '20px',
    border: '1px solid var(--tz-border)',
  },
  tabs: { display: 'flex', borderBottom: '1px solid var(--tz-border)' },
  tab: {
    padding: '17px 28px', border: 'none', background: 'none', cursor: 'pointer',
    fontSize: '14.5px', color: 'var(--tz-text-secondary)', fontWeight: '600',
    borderBottom: '2px solid transparent', transition: 'all 0.2s ease',
    display: 'flex', alignItems: 'center', gap: '7px',
  },
  activeTab: { color: 'var(--tz-ink)', borderBottom: '2px solid var(--tz-ink)' },
  tabContent: { padding: '28px' },
  specsTable: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  specKey: {
    padding: '13px 16px', color: 'var(--tz-text-secondary)', fontWeight: '600',
    width: '200px', borderBottom: '1px solid var(--tz-border)',
  },
  specVal: { padding: '13px 16px', color: 'var(--tz-ink)', borderBottom: '1px solid var(--tz-border)' },
  reviewForm: {
    background: 'var(--tz-canvas)', borderRadius: '14px', padding: '24px', marginBottom: '26px',
    border: '1px solid var(--tz-border)',
  },
  reviewFormTitle: {
    fontSize: '16px', fontWeight: '700', color: 'var(--tz-ink)', margin: '0 0 18px',
    fontFamily: "'Outfit', sans-serif",
  },
  field: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--tz-text-body)', marginBottom: '6px' },
  select: {
    padding: '10px 12px', border: '1px solid var(--tz-border)',
    borderRadius: '9px', fontSize: '14px', width: '100%', outline: 'none', background: 'var(--tz-paper)',
  },
  input: {
    width: '100%', padding: '11px 14px', border: '1px solid var(--tz-border)',
    borderRadius: '9px', fontSize: '14px', boxSizing: 'border-box', outline: 'none',
    background: 'var(--tz-paper)', transition: 'border-color 0.2s ease',
  },
  submitBtn: {
    background: 'var(--tz-ink)', color: '#fff', border: '1px solid var(--tz-ink)',
    padding: '11px 24px', borderRadius: '10px', cursor: 'pointer',
    fontWeight: '600', fontSize: '14px', transition: 'all 0.2s ease',
  },
  reviewCard: {
    background: 'var(--tz-paper)', borderRadius: '14px', padding: '20px',
    marginBottom: '12px', border: '1px solid var(--tz-border)',
  },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  reviewAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'var(--tz-ink)', color: '#ffffff', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: '700', flexShrink: 0, fontSize: '15px',
    fontFamily: "'Outfit', sans-serif",
  },
};

const detailStyle = document.createElement('style');
detailStyle.textContent = `
  .tz-bc:hover { color: var(--tz-accent) !important; }
  .tz-qty:hover { background: var(--tz-canvas) !important; }
  .tz-btn-ink:hover { background: var(--tz-ink-soft) !important; }
  .tz-input:focus { border-color: var(--tz-accent) !important; box-shadow: 0 0 0 3px var(--tz-accent-soft) !important; }
  @media (max-width: 768px) {
    .tz-detail-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
  }
`;
if (!document.getElementById('tz-detail-styles')) {
  detailStyle.id = 'tz-detail-styles';
  document.head.appendChild(detailStyle);
}

export default ProductDetailPage;
