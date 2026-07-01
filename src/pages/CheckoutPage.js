import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../utils/api';
import { useCart } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiCheck, FiArrowRight, FiPackage, FiDollarSign, FiPhone } from 'react-icons/fi';

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
      toast.success('Order placed successfully!');
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
                ...(step === i + 1 ? { color: 'var(--tz-ink)', fontWeight: '600' } : {}),
              }}>{label}</span>
            </div>
            {i < 1 && (
              <div style={{ ...s.stepLine, ...(step > 1 ? { background: 'var(--tz-ink)' } : {}) }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={s.layout} className="tz-checkout-layout">
        {/* Left: Form or Review */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {step === 1 ? (
            <div style={s.card}>
              <div style={s.cardHeader}>
                <FiMapPin size={18} style={{ color: 'var(--tz-ink)' }} />
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
                    <FiCreditCard size={18} style={{ color: 'var(--tz-ink)' }} />
                    <h3 style={s.cardTitle}>Payment Method</h3>
                  </div>
                  <div style={s.paymentOptions}>
                    {[
                      { value: 'COD', label: 'Cash on Delivery', desc: 'Pay with cash upon delivery', icon: <FiDollarSign size={16} /> },
                      { value: 'Online', label: 'Online Payment', desc: 'Card / EasyPaisa / JazzCash', icon: <FiCreditCard size={16} /> }
                    ].map(opt => (
                      <div key={opt.value} onClick={() => setPaymentMethod(opt.value)} style={{ ...s.payOption, ...(paymentMethod === opt.value ? s.activePayOption : {}) }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <input type="radio" checked={paymentMethod === opt.value} readOnly style={{ marginTop: '3px', accentColor: 'var(--tz-ink)' }} />
                          <div style={{ color: 'var(--tz-ink)', marginTop: '1px' }}>{opt.icon}</div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--tz-ink)' }}>{opt.label}</div>
                            <div style={{ color: 'var(--tz-text-secondary)', fontSize: '12px' }}>{opt.desc}</div>
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
                <FiPackage size={18} style={{ color: 'var(--tz-ink)' }} />
                <h2 style={s.cardTitle}>Order Review</h2>
              </div>

              <div style={s.reviewSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={s.reviewLabel}>Delivery Address</h4>
                  <button onClick={() => setStep(1)} style={s.editBtn}>Edit</button>
                </div>
                <p style={s.reviewText}>{address.street}, {address.city}, {address.state} {address.zipCode}</p>
                <p style={{ ...s.reviewText, display: 'flex', alignItems: 'center', gap: '6px' }}><FiPhone size={13} /> {address.phone}</p>
              </div>

              <div style={s.reviewSection}>
                <h4 style={s.reviewLabel}>Payment Method</h4>
                <p style={s.reviewText}>{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
              </div>

              <div style={s.reviewSection}>
                <h4 style={s.reviewLabel}>Items ({cartItems.length})</h4>
                {cartItems.map(item => (
                  <div key={item._id} style={s.reviewItem}>
                    <img src={item.images?.[0]?.url || 'https://via.placeholder.com/50'} alt={item.name} style={s.reviewItemImg} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: '600', color: 'var(--tz-ink)', fontSize: '14px' }}>{item.name}</p>
                      <p style={{ margin: '2px 0 0', color: 'var(--tz-text-secondary)', fontSize: '13px' }}>Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <span style={{ fontWeight: '700', color: 'var(--tz-ink)' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <button onClick={handlePlaceOrder} disabled={loading} style={s.orderBtn}>
                {loading ? 'Placing Order...' : 'Place Order'}
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
            <span style={{ color: shipping === 0 ? 'var(--tz-success)' : 'var(--tz-text-secondary)', fontWeight: shipping === 0 ? '600' : '400' }}>
              {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
            </span>
          </div>
          <div style={s.summaryRow}><span>Tax (5%)</span><span>Rs. {tax}</span></div>
          <div style={s.summaryTotal}>
            <span>Total Amount</span>
            <span style={{ color: 'var(--tz-ink)' }}>Rs. {total.toLocaleString()}</span>
          </div>
          {shipping === 0 && <p style={{ color: 'var(--tz-success)', fontSize: '12px', textAlign: 'center', marginTop: '10px', fontWeight: 500 }}>You qualify for free delivery.</p>}
        </div>
      </div>
    </div>
  );
};

const s = {
  container: { maxWidth: '1040px', margin: '0 auto', padding: '40px 24px' },
  title: {
    fontSize: '28px', fontWeight: '700', color: 'var(--tz-ink)', margin: '0 0 28px',
    fontFamily: "'Outfit', 'Inter', sans-serif", letterSpacing: '-0.02em',
  },
  steps: { display: 'flex', alignItems: 'center', marginBottom: '36px' },
  step: { display: 'flex', alignItems: 'center', gap: '10px' },
  stepCircle: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: 'var(--tz-canvas-2)', color: 'var(--tz-text-muted)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '14px', flexShrink: 0,
  },
  activeCircle: { background: 'var(--tz-ink)', color: '#fff' },
  doneCircle: { background: 'var(--tz-ink)', color: '#fff' },
  stepLabel: { fontSize: '14px', color: 'var(--tz-text-muted)', whiteSpace: 'nowrap' },
  stepLine: {
    flex: 1, height: '2px', background: 'var(--tz-border)', margin: '0 16px',
    borderRadius: '1px', transition: 'background 0.3s ease',
  },
  layout: { display: 'flex', gap: '28px', alignItems: 'flex-start' },
  card: {
    background: 'var(--tz-paper)', borderRadius: '18px', padding: '32px',
    border: '1px solid var(--tz-border)',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px',
  },
  cardTitle: {
    fontSize: '18px', fontWeight: '700', color: 'var(--tz-ink)', margin: 0,
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em',
  },
  field: { marginBottom: '16px', flex: 1 },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--tz-text-body)', marginBottom: '7px' },
  input: {
    width: '100%', padding: '11px 14px', border: '1px solid var(--tz-border)',
    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    background: 'var(--tz-canvas)', color: 'var(--tz-ink)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  paymentSection: { marginTop: '28px' },
  paymentOptions: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' },
  payOption: {
    padding: '14px', border: '1px solid var(--tz-border)',
    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease',
  },
  activePayOption: {
    border: '1px solid var(--tz-ink)', background: 'var(--tz-canvas)',
    boxShadow: 'inset 0 0 0 1px var(--tz-ink)',
  },
  nextBtn: {
    width: '100%', background: 'var(--tz-ink)', color: '#fff', border: 'none',
    padding: '15px', borderRadius: '12px', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', transition: 'all 0.2s ease',
  },
  orderBtn: {
    width: '100%', background: 'var(--tz-ink)',
    color: '#fff', border: 'none', padding: '16px', borderRadius: '12px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px',
    transition: 'all 0.2s ease',
  },
  reviewSection: {
    background: 'var(--tz-canvas)', borderRadius: '12px', padding: '18px',
    marginBottom: '14px', border: '1px solid var(--tz-border)',
  },
  reviewLabel: {
    fontSize: '12px', fontWeight: '600', color: 'var(--tz-text-muted)', margin: '0 0 8px',
    textTransform: 'uppercase', letterSpacing: '0.8px',
  },
  reviewText: { color: 'var(--tz-ink)', fontSize: '14px', margin: '0 0 4px' },
  editBtn: {
    background: 'none', border: 'none', color: 'var(--tz-ink)',
    cursor: 'pointer', fontSize: '13px', fontWeight: '600', textDecoration: 'underline',
  },
  reviewItem: {
    display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px',
  },
  reviewItemImg: {
    width: '48px', height: '48px', objectFit: 'contain',
    background: 'var(--tz-paper)', borderRadius: '10px', border: '1px solid var(--tz-border)',
  },
  summary: {
    width: '300px', background: 'var(--tz-paper)', borderRadius: '18px',
    padding: '28px', border: '1px solid var(--tz-border)', flexShrink: 0,
    position: 'sticky', top: '88px',
  },
  summaryTitle: {
    fontSize: '18px', fontWeight: '700', color: 'var(--tz-ink)', margin: '0 0 20px',
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em',
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', marginBottom: '12px',
    fontSize: '14px', color: 'var(--tz-text-secondary)',
  },
  summaryTotal: {
    display: 'flex', justifyContent: 'space-between',
    fontWeight: '700', fontSize: '18px',
    borderTop: '1px solid var(--tz-border)',
    paddingTop: '16px', marginTop: '4px', color: 'var(--tz-ink)',
    fontFamily: "'Outfit', sans-serif",
  },
};

export default CheckoutPage;
