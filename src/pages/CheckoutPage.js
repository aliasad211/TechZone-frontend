import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../utils/api';
import { useCart } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiCheck, FiArrowRight } from 'react-icons/fi';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [address, setAddress] = useState({
    street: '', city: '', state: '', zipCode: '', phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const shipping = cartTotal > 5000 ? 0 : 200;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + shipping + tax;

  const handleAddressChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0]?.url || '',
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total
      };
      const { data } = await createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={s.container}>
      <h1 style={s.title}>Checkout</h1>

      {/* Progress Steps */}
      <div style={s.steps}>
        {['Shipping Address', 'Review & Place Order'].map((label, i) => (
          <React.Fragment key={i}>
            <div style={s.step}>
              <div style={{
                ...s.stepCircle,
                ...(step > i + 1 ? s.doneCircle : step === i + 1 ? s.activeCircle : {}),
              }}>
                {step > i + 1 ? <FiCheck size={14} /> : i + 1}
              </div>
              <span style={{
                ...s.stepLabel,
                ...(step === i + 1 ? { color: '#0D2B5E', fontWeight: '600' } : {}),
              }}>{label}</span>
            </div>
            {i < 1 && (
              <div style={{ ...s.stepLine, ...(step > 1 ? { background: 'linear-gradient(90deg, #0D2B5E, #00a3ff)' } : {}) }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={s.layout}>
        {/* Left: Form or Review */}
        <div style={{ flex: 1 }}>
          {step === 1 ? (
            <div style={s.card}>
              <div style={s.cardHeader}>
                <FiMapPin size={18} style={{ color: '#00a3ff' }} />
                <h2 style={s.cardTitle}>Shipping Address</h2>
              </div>
              <form onSubmit={handleAddressSubmit}>
                <div style={s.field}>
                  <label style={s.label}>Street Address *</label>
                  <input style={s.input} name="street" value={address.street} onChange={handleAddressChange} required placeholder="House/Flat no, Street, Area" />
                </div>
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>City *</label>
                    <input style={s.input} name="city" value={address.city} onChange={handleAddressChange} required placeholder="Islamabad" />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Province *</label>
                    <select style={s.input} name="state" value={address.state} onChange={handleAddressChange} required>
                      <option value="">Select Province</option>
                      {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'AJK', 'GB'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>Zip Code</label>
                    <input style={s.input} name="zipCode" value={address.zipCode} onChange={handleAddressChange} placeholder="44000" />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Phone Number *</label>
                    <input style={s.input} name="phone" value={address.phone} onChange={handleAddressChange} required placeholder="03001234567" type="tel" />
                  </div>
                </div>

                <div style={s.paymentSection}>
                  <div style={s.cardHeader}>
                    <FiCreditCard size={18} style={{ color: '#00a3ff' }} />
                    <h3 style={s.cardTitle}>Payment Method</h3>
                  </div>
                  <div style={s.paymentOptions}>
                    {[
                      { value: 'COD', label: '💵 Cash on Delivery', desc: 'Pay with cash upon delivery' },
                      { value: 'Online', label: '💳 Online Payment', desc: 'Card / EasyPaisa / JazzCash' }
                    ].map(opt => (
                      <div key={opt.value} onClick={() => setPaymentMethod(opt.value)} style={{ ...s.payOption, ...(paymentMethod === opt.value ? s.activePayOption : {}) }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <input type="radio" checked={paymentMethod === opt.value} readOnly style={{ marginTop: '2px', accentColor: '#0D2B5E' }} />
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: '#0D2B5E' }}>{opt.label}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>{opt.desc}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" style={s.nextBtn}>
                  Continue to Review <FiArrowRight size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={{ fontSize: '18px' }}>📦</span>
                <h2 style={s.cardTitle}>Order Review</h2>
              </div>

              <div style={s.reviewSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={s.reviewLabel}>Delivery Address</h4>
                  <button onClick={() => setStep(1)} style={s.editBtn}>Edit</button>
                </div>
                <p style={s.reviewText}>{address.street}, {address.city}, {address.state} {address.zipCode}</p>
                <p style={s.reviewText}>📱 {address.phone}</p>
              </div>

              <div style={s.reviewSection}>
                <h4 style={s.reviewLabel}>Payment Method</h4>
                <p style={s.reviewText}>{paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}</p>
              </div>

              <div style={s.reviewSection}>
                <h4 style={s.reviewLabel}>Items ({cartItems.length})</h4>
                {cartItems.map(item => (
                  <div key={item._id} style={s.reviewItem}>
                    <img src={item.images?.[0]?.url || 'https://via.placeholder.com/50'} alt={item.name} style={s.reviewItemImg} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: '600', color: '#0D2B5E', fontSize: '14px' }}>{item.name}</p>
                      <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '13px' }}>Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <span style={{ fontWeight: '700', color: '#0D2B5E' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <button onClick={handlePlaceOrder} disabled={loading} style={s.orderBtn}>
                {loading ? 'Placing Order...' : '🎉 Place Order'}
              </button>
            </div>
          )}
        </div>

        {/* Right: Price Summary */}
        <div style={s.summary}>
          <h3 style={s.summaryTitle}>Price Summary</h3>
          <div style={s.summaryRow}><span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span><span>Rs. {cartTotal.toLocaleString()}</span></div>
          <div style={s.summaryRow}>
            <span>Delivery</span>
            <span style={{ color: shipping === 0 ? '#10b981' : '#475569', fontWeight: shipping === 0 ? '600' : '400' }}>
              {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
            </span>
          </div>
          <div style={s.summaryRow}><span>Tax (5%)</span><span>Rs. {tax}</span></div>
          <div style={s.summaryTotal}>
            <span>Total Amount</span>
            <span style={{ color: '#0D2B5E' }}>Rs. {total.toLocaleString()}</span>
          </div>
          {shipping === 0 && <p style={{ color: '#10b981', fontSize: '12px', textAlign: 'center', marginTop: '8px' }}>🎉 You qualify for free delivery!</p>}
        </div>
      </div>
    </div>
  );
};

const s = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' },
  title: {
    fontSize: '28px', fontWeight: '800', color: '#0D2B5E', margin: '0 0 24px',
    fontFamily: "'Outfit', 'Inter', sans-serif",
  },
  steps: { display: 'flex', alignItems: 'center', marginBottom: '32px' },
  step: { display: 'flex', alignItems: 'center', gap: '8px' },
  stepCircle: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: '#e2e8f0', color: '#94a3b8',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '14px', flexShrink: 0,
  },
  activeCircle: { background: '#0D2B5E', color: '#fff' },
  doneCircle: { background: '#00a3ff', color: '#fff' },
  stepLabel: { fontSize: '14px', color: '#94a3b8', whiteSpace: 'nowrap' },
  stepLine: {
    flex: 1, height: '2px', background: '#e2e8f0', margin: '0 14px',
    borderRadius: '1px',
  },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  card: {
    background: '#ffffff', borderRadius: '18px', padding: '30px',
    boxShadow: '0 2px 12px rgba(13,43,94,0.05)',
    border: '1px solid rgba(13,43,94,0.06)',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '18px', fontWeight: '700', color: '#0D2B5E', margin: 0,
    fontFamily: "'Outfit', sans-serif",
  },
  field: { marginBottom: '14px', flex: 1 },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
  input: {
    width: '100%', padding: '11px 14px', border: '1.5px solid rgba(13,43,94,0.1)',
    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  paymentSection: { marginTop: '28px' },
  paymentOptions: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' },
  payOption: {
    padding: '14px', border: '2px solid rgba(13,43,94,0.08)',
    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease',
  },
  activePayOption: {
    border: '2px solid #0D2B5E', background: 'rgba(0,163,255,0.04)',
  },
  nextBtn: {
    width: '100%', background: '#0D2B5E', color: '#fff', border: 'none',
    padding: '15px', borderRadius: '12px', fontSize: '16px', fontWeight: '700',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', transition: 'all 0.2s ease',
    boxShadow: '0 4px 16px rgba(13,43,94,0.15)',
  },
  orderBtn: {
    width: '100%', background: 'linear-gradient(135deg, #0D2B5E, #00a3ff)',
    color: '#fff', border: 'none', padding: '16px', borderRadius: '12px',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px',
    transition: 'all 0.2s ease', boxShadow: '0 4px 20px rgba(0,163,255,0.2)',
  },
  reviewSection: {
    background: '#f8fafc', borderRadius: '12px', padding: '18px',
    marginBottom: '14px', border: '1px solid rgba(13,43,94,0.04)',
  },
  reviewLabel: {
    fontSize: '12px', fontWeight: '700', color: '#64748b', margin: '0 0 6px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  reviewText: { color: '#0D2B5E', fontSize: '14px', margin: '0 0 4px' },
  editBtn: {
    background: 'none', border: 'none', color: '#00a3ff',
    cursor: 'pointer', fontSize: '13px', fontWeight: '600',
  },
  reviewItem: {
    display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px',
  },
  reviewItemImg: {
    width: '48px', height: '48px', objectFit: 'contain',
    background: '#ffffff', borderRadius: '10px', border: '1px solid rgba(13,43,94,0.06)',
  },
  summary: {
    width: '280px', background: '#ffffff', borderRadius: '18px',
    padding: '26px', boxShadow: '0 2px 12px rgba(13,43,94,0.05)',
    border: '1px solid rgba(13,43,94,0.06)', flexShrink: 0,
    position: 'sticky', top: '84px',
  },
  summaryTitle: {
    fontSize: '18px', fontWeight: '700', color: '#0D2B5E', margin: '0 0 18px',
    fontFamily: "'Outfit', sans-serif",
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', marginBottom: '10px',
    fontSize: '14px', color: '#475569',
  },
  summaryTotal: {
    display: 'flex', justifyContent: 'space-between',
    fontWeight: '800', fontSize: '18px',
    borderTop: '2px solid rgba(13,43,94,0.06)',
    paddingTop: '14px', marginTop: '14px',
    fontFamily: "'Outfit', sans-serif",
  },
};

export default CheckoutPage;
