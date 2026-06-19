import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, toggleWishlist } from '../utils/api';
import { useCart } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    document.title = 'My Wishlist — TechZone';
    getWishlist()
      .then(res => setWishlist(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId) => {
    try {
      await toggleWishlist(productId);
      setWishlist(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist!');
    } catch { toast.error('Failed to remove'); }
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    handleRemove(product._id);
    toast.success('Added to cart!');
  };

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.spinner} />
      <p style={{ color: '#64748b', marginTop: '12px' }}>Loading wishlist...</p>
    </div>
  );

  return (
    <div style={s.container}>
      <h1 style={s.title}>
        <FiHeart size={22} style={{ color: '#ef4444' }} /> My Wishlist
        <span style={s.titleCount}>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
      </h1>

      {wishlist.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>
            <FiHeart size={48} />
          </div>
          <h3 style={s.emptyTitle}>Your wishlist is empty</h3>
          <p style={s.emptySub}>Save your favorite products here and buy them later!</p>
          <Link to="/products" style={s.shopBtn}>Browse Products <FiArrowRight size={14} /></Link>
        </div>
      ) : (
        <div style={s.grid}>
          {wishlist.map(product => (
            <div key={product._id} style={s.card}>
              <button onClick={() => handleRemove(product._id)} style={s.removeBtn} title="Remove from wishlist">
                <FiTrash2 size={14} />
              </button>
              <Link to={`/product/${product._id}`}>
                <div style={s.imgWrap}>
                  <img src={product.images?.[0]?.url || 'https://via.placeholder.com/180x150?text=No+Image'} alt={product.name} style={s.img} />
                </div>
              </Link>
              <div style={s.info}>
                <p style={s.brand}>{product.brand}</p>
                <Link to={`/product/${product._id}`} style={s.name}>{product.name}</Link>
                <p style={s.price}>Rs. {product.price?.toLocaleString()}</p>
                <button
                  onClick={() => handleMoveToCart(product)}
                  disabled={product.stock === 0}
                  style={product.stock > 0 ? s.cartBtn : s.cartBtnDisabled}
                >
                  {product.stock > 0 ? <><FiShoppingCart size={13} /> Move to Cart</> : '❌ Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const s = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' },
  title: {
    fontSize: '26px', fontWeight: '800', color: '#0D2B5E', margin: '0 0 24px',
    fontFamily: "'Outfit', 'Inter', sans-serif",
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  titleCount: { fontSize: '14px', fontWeight: '500', color: '#64748b' },
  loadingWrap: {
    textAlign: 'center', padding: '80px', display: 'flex',
    flexDirection: 'column', alignItems: 'center',
  },
  spinner: {
    width: '36px', height: '36px', border: '3px solid #e2e8f0',
    borderTopColor: '#0D2B5E', borderRadius: '50%', animation: 'tz-rotate 0.8s linear infinite',
  },
  empty: { textAlign: 'center', padding: '80px 20px', maxWidth: '380px', margin: '0 auto' },
  emptyIcon: {
    width: '90px', height: '90px', borderRadius: '50%',
    background: 'rgba(239,68,68,0.06)', color: '#ef4444',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
  },
  emptyTitle: {
    fontSize: '20px', fontWeight: '700', color: '#0D2B5E', margin: '0 0 8px',
    fontFamily: "'Outfit', sans-serif",
  },
  emptySub: { color: '#64748b', fontSize: '14px', margin: '0 0 24px' },
  shopBtn: {
    background: '#0D2B5E', color: '#fff', textDecoration: 'none',
    padding: '12px 28px', borderRadius: '10px', fontWeight: '700',
    fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px',
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px',
  },
  card: {
    background: '#ffffff', borderRadius: '16px', overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(13,43,94,0.05)',
    border: '1px solid rgba(13,43,94,0.06)', position: 'relative',
    transition: 'all 0.3s ease',
  },
  removeBtn: {
    position: 'absolute', top: '12px', right: '12px',
    background: '#ffffff', border: '1px solid rgba(13,43,94,0.08)',
    borderRadius: '10px', width: '36px', height: '36px',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: '#ef4444', zIndex: 1,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s ease',
  },
  imgWrap: {
    background: '#f8fafc', padding: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  img: { width: '100%', height: '170px', objectFit: 'contain' },
  info: { padding: '16px' },
  brand: {
    color: '#64748b', fontSize: '11px', fontWeight: '600',
    textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: '0.5px',
  },
  name: {
    color: '#0D2B5E', fontSize: '14px', fontWeight: '600',
    textDecoration: 'none', display: 'block', marginBottom: '8px',
    lineHeight: '1.4',
  },
  price: {
    color: '#0D2B5E', fontSize: '17px', fontWeight: '800', margin: '0 0 12px',
    fontFamily: "'Outfit', sans-serif",
  },
  cartBtn: {
    width: '100%', background: '#0D2B5E', color: '#fff', border: 'none',
    padding: '10px', borderRadius: '10px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '6px', transition: 'all 0.2s ease',
  },
  cartBtnDisabled: {
    width: '100%', background: '#e2e8f0', color: '#94a3b8', border: 'none',
    padding: '10px', borderRadius: '10px', cursor: 'not-allowed',
    fontSize: '13px', textAlign: 'center',
  },
};

export default WishlistPage;
