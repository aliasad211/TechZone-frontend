import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProductReviews, createReview, toggleWishlist } from '../utils/api';
import { useCart, useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiHeart, FiTruck, FiRefreshCw, FiShield, FiCreditCard, FiChevronRight } from 'react-icons/fi';

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
      <p style={{ color: '#64748b', marginTop: '12px' }}>Loading product...</p>
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
      {/* Breadcrumb */}
      <nav style={s.breadcrumb}>
        <Link to="/" style={s.bcLink}>Home</Link>
        <FiChevronRight size={12} style={{ color: '#94a3b8' }} />
        <Link to="/products" style={s.bcLink}>Products</Link>
        <FiChevronRight size={12} style={{ color: '#94a3b8' }} />
        <Link to={`/products?category=${product.category}`} style={s.bcLink}>{product.category}</Link>
        <FiChevronRight size={12} style={{ color: '#94a3b8' }} />
        <span style={{ color: '#0D2B5E', fontWeight: '500' }}>{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div style={s.mainGrid}>
        {/* Images */}
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

        {/* Product Info */}
        <div>
          <p style={s.brand}>{product.brand}</p>
          <h1 style={s.productName}>{product.name}</h1>

          <div style={s.ratingRow}>
            <span style={s.stars}>{'★'.repeat(Math.round(product.ratings))}{'☆'.repeat(5 - Math.round(product.ratings))}</span>
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

          {/* Stock */}
          <div style={s.stockRow}>
            {product.stock > 0 ? (
              <span style={s.inStock}>✅ In Stock ({product.stock} available)</span>
            ) : (
              <span style={s.outStock}>❌ Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div style={s.actions}>
              <div style={s.qtyRow}>
                <label style={s.qtyLabel}>Quantity:</label>
                <div style={s.qtyControls}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={s.qtyBtn}>−</button>
                  <span style={s.qtyNum}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={s.qtyBtn}>+</button>
                </div>
              </div>
              <div style={s.btnRow}>
                <button onClick={handleAddToCart} style={s.addCartBtn}>
                  <FiShoppingCart size={16} /> Add to Cart
                </button>
                <button onClick={handleWishlist} style={{ ...s.wishlistBtn, color: inWishlist ? '#ef4444' : '#64748b', borderColor: inWishlist ? '#fecaca' : '#e2e8f0' }}>
                  <FiHeart size={16} fill={inWishlist ? '#ef4444' : 'none'} /> Wishlist
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

      {/* Tabs: Specs + Reviews */}
      <div style={s.tabsSection}>
        <div style={s.tabs}>
          {['specs', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ ...s.tab, ...(activeTab === tab ? s.activeTab : {}) }}>
              {tab === 'specs' ? '📋 Specifications' : `💬 Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'specs' && (
          <div style={s.tabContent}>
            {product.specifications.length > 0 ? (
              <table style={s.specsTable}>
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
                      <td style={s.specKey}>{spec.key}</td>
                      <td style={s.specVal}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ color: '#94a3b8' }}>No specifications available</p>}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={s.tabContent}>
            {/* Write Review */}
            {user && (
              <div style={s.reviewForm}>
                <h3 style={s.reviewFormTitle}>Write Your Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div style={s.field}>
                    <label style={s.label}>Rating</label>
                    <select value={reviewForm.rating} onChange={e => setReviewForm(p => ({ ...p, rating: Number(e.target.value) }))} style={s.select}>
                      {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{'★'.repeat(r)} {r} Star{r > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Title</label>
                    <input style={s.input} value={reviewForm.title} onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))} required placeholder="Short title..." />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Review</label>
                    <textarea style={{ ...s.input, height: '90px', resize: 'vertical' }} value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} required placeholder="Share your experience..." />
                  </div>
                  <button type="submit" disabled={submittingReview} style={s.submitBtn}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}

            {reviews.length === 0 ? (
              <p style={{ color: '#94a3b8', padding: '20px 0' }}>No reviews yet. Be the first to review!</p>
            ) : reviews.map((rev, i) => (
              <div key={i} style={s.reviewCard}>
                <div style={s.reviewHeader}>
                  <div style={s.reviewAvatar}>{rev.user?.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong style={{ color: '#0D2B5E' }}>{rev.user?.name}</strong>
                    <div style={{ color: '#fbbf24', fontSize: '14px' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '12px' }}>
                    {new Date(rev.createdAt).toLocaleDateString('en-PK')}
                  </span>
                </div>
                <h4 style={{ color: '#0D2B5E', margin: '8px 0 4px', fontSize: '15px' }}>{rev.title}</h4>
                <p style={{ color: '#475569', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' },
  loadingWrap: { textAlign: 'center', padding: '80px', color: '#64748b', fontSize: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  spinner: {
    width: '36px', height: '36px', border: '3px solid #e2e8f0',
    borderTopColor: '#0D2B5E', borderRadius: '50%', animation: 'tz-rotate 0.8s linear infinite',
  },
  breadcrumb: {
    display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px',
    fontSize: '13px', color: '#94a3b8', flexWrap: 'wrap',
  },
  bcLink: { color: '#00a3ff', textDecoration: 'none', fontWeight: '500' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' },
  mainImgWrap: {
    position: 'relative', background: '#f8fafc', borderRadius: '20px',
    overflow: 'hidden', marginBottom: '12px', border: '1px solid rgba(13,43,94,0.06)',
  },
  mainImg: { width: '100%', height: '380px', objectFit: 'contain', padding: '24px', boxSizing: 'border-box' },
  discountBadge: {
    position: 'absolute', top: '16px', left: '16px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff',
    padding: '5px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: '700',
  },
  thumbnails: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  thumb: {
    width: '72px', height: '72px', objectFit: 'contain',
    background: '#f8fafc', borderRadius: '12px', cursor: 'pointer',
    padding: '6px', border: '2px solid transparent', boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  activeThumb: { border: '2px solid #0D2B5E' },
  brand: {
    color: '#00a3ff', fontSize: '13px', fontWeight: '600',
    textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '1px',
  },
  productName: {
    fontSize: '26px', fontWeight: '800', color: '#0D2B5E', margin: '0 0 14px',
    lineHeight: '1.3', fontFamily: "'Outfit', 'Inter', sans-serif",
  },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
  stars: { color: '#fbbf24', fontSize: '18px' },
  ratingText: { color: '#64748b', fontSize: '13px' },
  priceRow: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap',
  },
  price: {
    fontSize: '30px', fontWeight: '800', color: '#0D2B5E',
    fontFamily: "'Outfit', sans-serif",
  },
  originalPrice: { fontSize: '16px', color: '#94a3b8', textDecoration: 'line-through' },
  saveBadge: {
    background: 'rgba(0,163,255,0.08)', color: '#0D2B5E',
    padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600',
    border: '1px solid rgba(0,163,255,0.15)',
  },
  description: { color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 16px' },
  stockRow: { marginBottom: '16px' },
  inStock: { color: '#10b981', fontSize: '14px', fontWeight: '600' },
  outStock: { color: '#ef4444', fontSize: '14px', fontWeight: '600' },
  actions: { marginBottom: '20px' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' },
  qtyLabel: { color: '#475569', fontWeight: '600', fontSize: '14px' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: {
    width: '38px', height: '38px', border: '1.5px solid rgba(13,43,94,0.1)',
    borderRadius: '10px', background: '#f8fafc', cursor: 'pointer',
    fontSize: '18px', fontWeight: '700', color: '#0D2B5E', transition: 'all 0.2s ease',
  },
  qtyNum: { minWidth: '36px', textAlign: 'center', fontWeight: '700', fontSize: '16px', color: '#0D2B5E' },
  btnRow: { display: 'flex', gap: '12px' },
  addCartBtn: {
    flex: 1, background: '#0D2B5E', color: '#fff', border: 'none',
    padding: '15px 20px', borderRadius: '12px', fontSize: '15px',
    fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease',
    boxShadow: '0 4px 16px rgba(13,43,94,0.15)',
  },
  wishlistBtn: {
    background: '#ffffff', border: '1.5px solid #e2e8f0',
    padding: '15px 20px', borderRadius: '12px', fontSize: '14px',
    cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center',
    gap: '6px', transition: 'all 0.2s ease',
  },
  features: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
    background: 'rgba(0,163,255,0.03)', borderRadius: '14px',
    padding: '18px', border: '1px solid rgba(0,163,255,0.08)',
  },
  feature: {
    display: 'flex', gap: '10px', fontSize: '13px', color: '#475569', alignItems: 'center',
  },
  featureIcon: {
    width: '32px', height: '32px', borderRadius: '8px',
    background: '#0D2B5E', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  tabsSection: {
    background: '#ffffff', borderRadius: '20px',
    boxShadow: '0 2px 12px rgba(13,43,94,0.05)',
    border: '1px solid rgba(13,43,94,0.06)',
  },
  tabs: { display: 'flex', borderBottom: '1px solid rgba(13,43,94,0.06)' },
  tab: {
    padding: '16px 28px', border: 'none', background: 'none', cursor: 'pointer',
    fontSize: '15px', color: '#64748b', fontWeight: '600',
    borderBottom: '3px solid transparent', transition: 'all 0.2s ease',
  },
  activeTab: { color: '#0D2B5E', borderBottom: '3px solid #00a3ff' },
  tabContent: { padding: '24px' },
  specsTable: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  specKey: {
    padding: '12px 16px', color: '#64748b', fontWeight: '600',
    width: '200px', borderBottom: '1px solid rgba(13,43,94,0.06)',
  },
  specVal: { padding: '12px 16px', color: '#0D2B5E', borderBottom: '1px solid rgba(13,43,94,0.06)' },
  reviewForm: {
    background: '#f8fafc', borderRadius: '14px', padding: '22px', marginBottom: '24px',
    border: '1px solid rgba(13,43,94,0.06)',
  },
  reviewFormTitle: {
    fontSize: '16px', fontWeight: '700', color: '#0D2B5E', margin: '0 0 16px',
    fontFamily: "'Outfit', sans-serif",
  },
  field: { marginBottom: '12px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '4px' },
  select: {
    padding: '8px 12px', border: '1.5px solid rgba(13,43,94,0.1)',
    borderRadius: '8px', fontSize: '14px', width: '100%', outline: 'none',
  },
  input: {
    width: '100%', padding: '10px 14px', border: '1.5px solid rgba(13,43,94,0.1)',
    borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  submitBtn: {
    background: '#0D2B5E', color: '#fff', border: 'none',
    padding: '10px 24px', borderRadius: '10px', cursor: 'pointer',
    fontWeight: '600', fontSize: '14px', transition: 'all 0.2s ease',
  },
  reviewCard: {
    background: '#f8fafc', borderRadius: '14px', padding: '18px',
    marginBottom: '12px', border: '1px solid rgba(13,43,94,0.04)',
  },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  reviewAvatar: {
    width: '38px', height: '38px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #0D2B5E, #00a3ff)',
    color: '#ffffff', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: '700', flexShrink: 0, fontSize: '15px',
  },
};

export default ProductDetailPage;
