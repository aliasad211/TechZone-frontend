import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiArrowRight, FiArrowLeft, FiTruck } from 'react-icons/fi';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) { toast.error('Please login first!'); navigate('/login'); return; }
    navigate('/checkout');
  };

  const shipping = cartTotal > 5000 ? 0 : 200;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + shipping + tax;
  const freeShipProgress = Math.min((cartTotal / 5000) * 100, 100);

  if (cartItems.length === 0) return (
    <div style={s.empty}>
      <div style={s.emptyIcon}><FiShoppingCart size={48} /></div>
      <h2 style={s.emptyTitle}>Your cart is empty!</h2>
      <p style={s.emptySub}>Looks like you haven&apos;t added anything to your cart yet.</p>
      <Link to="/products" style={s.shopBtn}>Start Shopping <FiArrowRight size={16} /></Link>
    </div>
  );

  return (
    <div style={s.container}>
      <h1 style={s.title}>
        <FiShoppingCart size={22} /> Shopping Cart
        <span style={s.titleCount}>{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
      </h1>
      <div style={s.layout}>
        {/* Items */}
        <div style={{ flex: 1 }}>
          {cartItems.map(item => (
            <div key={item._id} style={s.item}>
              <div style={s.imgWrap}>
                <img src={item.images?.[0]?.url || 'https://via.placeholder.com/80'} alt={item.name} style={s.img} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/product/${item._id}`} style={s.itemName}>{item.name}</Link>
                <p style={s.brand}>{item.brand}</p>
                <p style={s.price}>Rs. {item.price.toLocaleString()}</p>
              </div>
              <div style={s.qtyControls}>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={s.qtyBtn}><FiMinus size={14} /></button>
                <span style={s.qty}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={s.qtyBtn} disabled={item.quantity >= item.stock}><FiPlus size={14} /></button>
              </div>
              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <p style={s.subTotal}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                <button onClick={() => removeFromCart(item._id)} style={s.removeBtn}>
                  <FiTrash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))}
          <div style={s.actionsRow}>
            <Link to="/products" style={s.continueLink}><FiArrowLeft size={14} /> Continue Shopping</Link>
            <button onClick={() => { clearCart(); toast.success('Cart cleared!'); }} style={s.clearBtn}>Clear Cart</button>
          </div>
        </div>

        {/* Summary */}
        <div style={s.summary}>
          <h3 style={s.summaryTitle}>Order Summary</h3>

          {/* Free shipping progress */}
          {cartTotal < 5000 && (
            <div style={s.shipProgress}>
              <div style={s.shipProgressHeader}>
                <FiTruck size={14} style={{ color: '#00a3ff' }} />
                <span style={s.shipProgressText}>
                  Add Rs. {(5000 - cartTotal).toLocaleString()} more for free shipping!
                </span>
              </div>
              <div style={s.progressTrack}>
                <div style={{ ...s.progressFill, width: `${freeShipProgress}%` }} />
              </div>
            </div>
          )}

          <div style={s.row}><span>Items Total:</span><span>Rs. {cartTotal.toLocaleString()}</span></div>
          <div style={s.row}>
            <span>Shipping:</span>
            <span>{shipping === 0 ? <span style={{ color: '#10b981', fontWeight: '600' }}>FREE</span> : `Rs. ${shipping}`}</span>
          </div>
          <div style={s.row}><span>Tax (5%):</span><span>Rs. {tax}</span></div>
          <div style={s.totalRow}>
            <span>Total:</span>
            <span style={{ color: '#0D2B5E' }}>Rs. {total.toLocaleString()}</span>
          </div>
          {shipping === 0 && <p style={s.freeShipMsg}>🎉 You qualify for free delivery!</p>}
          <button onClick={handleCheckout} style={s.checkoutBtn}>
            Checkout <FiArrowRight size={16} />
          </button>
        </div>
      </div>
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
  titleCount: {
    fontSize: '14px', fontWeight: '500', color: '#64748b', marginLeft: '4px',
  },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  item: {
    background: '#ffffff', borderRadius: '14px', padding: '18px',
    display: 'flex', gap: '16px', marginBottom: '12px',
    boxShadow: '0 2px 10px rgba(13,43,94,0.04)',
    border: '1px solid rgba(13,43,94,0.06)', alignItems: 'center',
    transition: 'all 0.2s ease',
  },
  imgWrap: {
    width: '85px', height: '85px', borderRadius: '12px',
    background: '#f8fafc', display: 'flex', alignItems: 'center',
    justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
  },
  img: { width: '100%', height: '100%', objectFit: 'contain', padding: '6px' },
  itemName: {
    color: '#0D2B5E', textDecoration: 'none', fontWeight: '600', fontSize: '15px',
    display: 'block', lineHeight: '1.3',
  },
  brand: { color: '#94a3b8', fontSize: '12px', margin: '3px 0' },
  price: { color: '#00a3ff', fontWeight: '700', margin: '4px 0', fontSize: '15px' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '6px' },
  qtyBtn: {
    width: '34px', height: '34px', border: '1.5px solid rgba(13,43,94,0.1)',
    borderRadius: '8px', background: '#f8fafc', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#0D2B5E', transition: 'all 0.2s ease',
  },
  qty: { minWidth: '32px', textAlign: 'center', fontWeight: '700', fontSize: '15px', color: '#0D2B5E' },
  subTotal: { fontWeight: '700', color: '#0D2B5E', margin: '0 0 6px', fontSize: '15px' },
  removeBtn: {
    background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer',
    fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px',
    marginLeft: 'auto',
  },
  actionsRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px',
  },
  continueLink: {
    color: '#00a3ff', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '6px',
  },
  clearBtn: {
    background: 'none', border: '1.5px solid rgba(13,43,94,0.1)',
    color: '#94a3b8', padding: '8px 18px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s ease',
  },
  summary: {
    width: '320px', background: '#ffffff', borderRadius: '16px',
    padding: '28px', boxShadow: '0 2px 12px rgba(13,43,94,0.05)',
    border: '1px solid rgba(13,43,94,0.06)', flexShrink: 0,
    position: 'sticky', top: '84px',
  },
  summaryTitle: {
    fontSize: '18px', fontWeight: '700', color: '#0D2B5E', margin: '0 0 18px',
    fontFamily: "'Outfit', sans-serif",
  },
  shipProgress: {
    background: 'rgba(0,163,255,0.04)', borderRadius: '10px',
    padding: '12px', marginBottom: '18px', border: '1px solid rgba(0,163,255,0.1)',
  },
  shipProgressHeader: {
    display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
  },
  shipProgressText: { color: '#0D2B5E', fontSize: '12px', fontWeight: '600' },
  progressTrack: {
    height: '6px', borderRadius: '3px', background: 'rgba(13,43,94,0.08)', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: '3px',
    background: 'linear-gradient(90deg, #0D2B5E, #00a3ff)',
    transition: 'width 0.4s ease',
  },
  row: {
    display: 'flex', justifyContent: 'space-between', marginBottom: '10px',
    fontSize: '14px', color: '#475569',
  },
  totalRow: {
    display: 'flex', justifyContent: 'space-between',
    fontWeight: '800', fontSize: '18px', borderTop: '2px solid rgba(13,43,94,0.06)',
    paddingTop: '14px', marginTop: '14px', color: '#0D2B5E',
    fontFamily: "'Outfit', sans-serif",
  },
  freeShipMsg: {
    color: '#10b981', fontSize: '12px', textAlign: 'center', marginTop: '8px',
  },
  checkoutBtn: {
    width: '100%', background: '#0D2B5E', color: '#fff', border: 'none',
    padding: '15px', borderRadius: '12px', fontSize: '16px', fontWeight: '700',
    cursor: 'pointer', marginTop: '14px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease',
    boxShadow: '0 4px 16px rgba(13,43,94,0.15)',
  },
  empty: {
    textAlign: 'center', padding: '100px 20px', maxWidth: '420px', margin: '0 auto',
  },
  emptyIcon: {
    width: '90px', height: '90px', borderRadius: '50%',
    background: 'rgba(0,163,255,0.06)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
    color: '#00a3ff',
  },
  emptyTitle: {
    fontSize: '22px', fontWeight: '700', color: '#0D2B5E', margin: '0 0 8px',
    fontFamily: "'Outfit', sans-serif",
  },
  emptySub: { color: '#64748b', fontSize: '14px', margin: '0 0 24px' },
  shopBtn: {
    background: '#0D2B5E', color: '#fff', textDecoration: 'none',
    padding: '14px 32px', borderRadius: '12px', fontSize: '15px',
    fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 16px rgba(13,43,94,0.15)',
  },
};

export default CartPage;
