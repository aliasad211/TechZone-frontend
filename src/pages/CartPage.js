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
      <div style={s.emptyIcon}><FiShoppingCart size={40} /></div>
      <h2 style={s.emptyTitle}>Your cart is empty</h2>
      <p style={s.emptySub}>Looks like you haven&apos;t added anything to your cart yet.</p>
      <Link to="/products" style={s.shopBtn}>Start Shopping <FiArrowRight size={16} /></Link>
    </div>
  );

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h1 style={s.title}>Shopping Cart</h1>
        <span style={s.titleCount}>{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
      </div>
      <div style={s.layout} className="tz-cart-layout">
        {/* Items */}
        <div style={{ flex: 1, minWidth: 0 }}>
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
                <FiTruck size={14} style={{ color: 'var(--tz-ink)' }} />
                <span style={s.shipProgressText}>
                  Add Rs. {(5000 - cartTotal).toLocaleString()} more for free shipping
                </span>
              </div>
              <div style={s.progressTrack}>
                <div style={{ ...s.progressFill, width: `${freeShipProgress}%` }} />
              </div>
            </div>
          )}

          <div style={s.row}><span>Items Total</span><span>Rs. {cartTotal.toLocaleString()}</span></div>
          <div style={s.row}>
            <span>Shipping</span>
            <span>{shipping === 0 ? <span style={{ color: 'var(--tz-success)', fontWeight: '600' }}>FREE</span> : `Rs. ${shipping}`}</span>
          </div>
          <div style={s.row}><span>Tax (5%)</span><span>Rs. {tax}</span></div>
          <div style={s.totalRow}>
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
          {shipping === 0 && <p style={s.freeShipMsg}>You qualify for free delivery.</p>}
          <button onClick={handleCheckout} style={s.checkoutBtn}>
            Checkout <FiArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const s = {
  container: { maxWidth: '1140px', margin: '0 auto', padding: '40px 24px' },
  header: { display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '28px' },
  title: {
    fontSize: '28px', fontWeight: '700', color: 'var(--tz-ink)', margin: 0,
    fontFamily: "'Outfit', 'Inter', sans-serif", letterSpacing: '-0.02em',
  },
  titleCount: { fontSize: '14px', fontWeight: '500', color: 'var(--tz-text-muted)' },
  layout: { display: 'flex', gap: '28px', alignItems: 'flex-start' },
  item: {
    background: 'var(--tz-paper)', borderRadius: '14px', padding: '18px',
    display: 'flex', gap: '16px', marginBottom: '12px',
    border: '1px solid var(--tz-border)', alignItems: 'center',
    transition: 'all 0.2s ease',
  },
  imgWrap: {
    width: '88px', height: '88px', borderRadius: '12px',
    background: 'var(--tz-canvas)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
  },
  img: { width: '100%', height: '100%', objectFit: 'contain', padding: '8px' },
  itemName: {
    color: 'var(--tz-ink)', textDecoration: 'none', fontWeight: '600', fontSize: '15px',
    display: 'block', lineHeight: '1.35',
  },
  brand: { color: 'var(--tz-text-muted)', fontSize: '12px', margin: '4px 0' },
  price: { color: 'var(--tz-text-body)', fontWeight: '600', margin: '4px 0', fontSize: '14px' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '6px' },
  qtyBtn: {
    width: '34px', height: '34px', border: '1px solid var(--tz-border)',
    borderRadius: '8px', background: 'var(--tz-canvas)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--tz-ink)', transition: 'all 0.2s ease',
  },
  qty: { minWidth: '32px', textAlign: 'center', fontWeight: '700', fontSize: '15px', color: 'var(--tz-ink)' },
  subTotal: { fontWeight: '700', color: 'var(--tz-ink)', margin: '0 0 6px', fontSize: '15px' },
  removeBtn: {
    background: 'none', border: 'none', color: 'var(--tz-text-muted)', cursor: 'pointer',
    fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px',
    marginLeft: 'auto', transition: 'color 0.2s ease',
  },
  actionsRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px',
  },
  continueLink: {
    color: 'var(--tz-ink)', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '6px',
  },
  clearBtn: {
    background: 'none', border: '1px solid var(--tz-border)',
    color: 'var(--tz-text-secondary)', padding: '9px 18px', borderRadius: '9px',
    cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s ease',
  },
  summary: {
    width: '340px', background: 'var(--tz-paper)', borderRadius: '16px',
    padding: '28px', border: '1px solid var(--tz-border)', flexShrink: 0,
    position: 'sticky', top: '88px',
  },
  summaryTitle: {
    fontSize: '18px', fontWeight: '700', color: 'var(--tz-ink)', margin: '0 0 20px',
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em',
  },
  shipProgress: {
    background: 'var(--tz-canvas)', borderRadius: '10px',
    padding: '14px', marginBottom: '20px', border: '1px solid var(--tz-border)',
  },
  shipProgressHeader: {
    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px',
  },
  shipProgressText: { color: 'var(--tz-text-body)', fontSize: '12px', fontWeight: '600' },
  progressTrack: {
    height: '6px', borderRadius: '3px', background: 'var(--tz-canvas-2)', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: '3px', background: 'var(--tz-ink)',
    transition: 'width 0.4s ease',
  },
  row: {
    display: 'flex', justifyContent: 'space-between', marginBottom: '12px',
    fontSize: '14px', color: 'var(--tz-text-secondary)',
  },
  totalRow: {
    display: 'flex', justifyContent: 'space-between',
    fontWeight: '700', fontSize: '18px', borderTop: '1px solid var(--tz-border)',
    paddingTop: '16px', marginTop: '4px', color: 'var(--tz-ink)',
    fontFamily: "'Outfit', sans-serif",
  },
  freeShipMsg: {
    color: 'var(--tz-success)', fontSize: '12px', textAlign: 'center', marginTop: '10px', fontWeight: 500,
  },
  checkoutBtn: {
    width: '100%', background: 'var(--tz-ink)', color: '#fff', border: 'none',
    padding: '15px', borderRadius: '12px', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', marginTop: '16px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease',
  },
  empty: {
    textAlign: 'center', padding: '110px 20px', maxWidth: '420px', margin: '0 auto',
  },
  emptyIcon: {
    width: '88px', height: '88px', borderRadius: '20px',
    background: 'var(--tz-canvas)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px',
    color: 'var(--tz-text-muted)',
  },
  emptyTitle: {
    fontSize: '22px', fontWeight: '700', color: 'var(--tz-ink)', margin: '0 0 8px',
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em',
  },
  emptySub: { color: 'var(--tz-text-secondary)', fontSize: '14px', margin: '0 0 26px' },
  shopBtn: {
    background: 'var(--tz-ink)', color: '#fff', textDecoration: 'none',
    padding: '14px 30px', borderRadius: '12px', fontSize: '15px',
    fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '8px',
  },
};

export default CartPage;
