import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../utils/api';
import { FiArrowLeft, FiCheck, FiMapPin } from 'react-icons/fi';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const STATUS_COLOR = {
  Pending: '#f59e0b', Processing: '#00a3ff', Shipped: '#8b5cf6',
  Delivered: '#10b981', Cancelled: '#ef4444'
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then(res => {
        setOrder(res.data);
        document.title = `Order #${res.data._id.slice(-10).toUpperCase()} — TechZone`;
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.spinner} />
      <p style={{ color: '#64748b', marginTop: '12px' }}>Loading order details...</p>
    </div>
  );
  if (!order) return <div style={s.loadingWrap}>Order not found</div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div style={s.container}>
      <div style={s.backRow}>
        <Link to="/my-orders" style={s.backLink}><FiArrowLeft size={14} /> My Orders</Link>
        <span style={{ color: '#94a3b8' }}>·</span>
        <span style={{ color: '#64748b', fontSize: '14px' }}>Order #{order._id.slice(-10).toUpperCase()}</span>
      </div>

      <div style={s.layout}>
        <div style={{ flex: 1 }}>
          {/* Status Timeline */}
          {order.orderStatus !== 'Cancelled' && (
            <div style={s.card}>
              <h3 style={s.cardTitle}>Order Status</h3>
              <div style={s.timeline}>
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} style={s.timelineItem}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        ...s.dot,
                        ...(i <= currentStep ? {
                          background: STATUS_COLOR[order.orderStatus],
                          color: '#ffffff',
                          border: 'none',
                        } : {}),
                      }}>
                        {i < currentStep ? <FiCheck size={14} /> : i + 1}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div style={{
                          ...s.line,
                          ...(i < currentStep ? { background: STATUS_COLOR[order.orderStatus] } : {}),
                        }} />
                      )}
                    </div>
                    <span style={{
                      ...s.stepLabel,
                      ...(i === currentStep ? {
                        color: STATUS_COLOR[order.orderStatus],
                        fontWeight: '700',
                      } : {}),
                    }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {order.orderStatus === 'Cancelled' && (
            <div style={{ ...s.card, background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.15)' }}>
              <h3 style={{ ...s.cardTitle, color: '#ef4444' }}>Order Cancelled</h3>
              <p style={{ color: '#64748b', margin: 0 }}>This order has been cancelled.</p>
            </div>
          )}

          {/* Order Items */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>Order Items ({order.orderItems.length})</h3>
            {order.orderItems.map((item, i) => (
              <div key={i} style={s.itemRow}>
                <div style={s.itemImgWrap}>
                  <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} style={s.itemImg} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={s.itemName}>{item.name}</p>
                  <p style={s.itemMeta}>Quantity: {item.quantity}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={s.itemPrice}>Rs. {item.price?.toLocaleString()}</p>
                  <p style={s.itemMeta}>Subtotal: Rs. {(item.price * item.quantity)?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div style={s.card}>
            <h3 style={s.cardTitle}><FiMapPin size={16} style={{ color: '#00a3ff' }} /> Shipping Address</h3>
            <p style={s.addressText}>{order.shippingAddress?.street}</p>
            <p style={s.addressText}>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
            <p style={s.addressText}>📱 {order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Price Summary */}
        <div style={s.sidebar}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>Price Breakdown</h3>
            <div style={s.priceRow}><span>Items Price</span><span>Rs. {order.itemsPrice?.toLocaleString()}</span></div>
            <div style={s.priceRow}>
              <span>Shipping</span>
              <span>{order.shippingPrice === 0 ? <span style={{ color: '#10b981', fontWeight: '600' }}>FREE</span> : `Rs. ${order.shippingPrice}`}</span>
            </div>
            <div style={s.priceRow}><span>Tax</span><span>Rs. {order.taxPrice?.toLocaleString()}</span></div>
            <div style={s.totalRow}>
              <span>Total</span>
              <span style={{ color: '#0D2B5E' }}>Rs. {order.totalPrice?.toLocaleString()}</span>
            </div>
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>Payment Info</h3>
            <div style={s.priceRow}><span>Method</span><span>{order.paymentMethod === 'COD' ? '💵 COD' : '💳 Online'}</span></div>
            <div style={s.priceRow}>
              <span>Status</span>
              <span style={{ color: order.paymentStatus === 'Paid' ? '#10b981' : '#f59e0b', fontWeight: '600' }}>
                {order.paymentStatus}
              </span>
            </div>
            <div style={s.priceRow}><span>Order Date</span><span>{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</span></div>
            {order.deliveredAt && (
              <div style={s.priceRow}>
                <span>Delivered</span>
                <span style={{ color: '#10b981' }}>{new Date(order.deliveredAt).toLocaleDateString('en-PK')}</span>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{
              ...s.bigStatus,
              background: (STATUS_COLOR[order.orderStatus] || '#94a3b8') + '15',
              color: STATUS_COLOR[order.orderStatus] || '#94a3b8',
              border: `1.5px solid ${(STATUS_COLOR[order.orderStatus] || '#94a3b8')}30`,
            }}>
              {order.orderStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' },
  loadingWrap: {
    textAlign: 'center', padding: '80px', display: 'flex',
    flexDirection: 'column', alignItems: 'center', color: '#64748b',
  },
  spinner: {
    width: '36px', height: '36px', border: '3px solid #e2e8f0',
    borderTopColor: '#0D2B5E', borderRadius: '50%', animation: 'tz-rotate 0.8s linear infinite',
  },
  backRow: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px',
  },
  backLink: {
    color: '#00a3ff', textDecoration: 'none', fontSize: '14px',
    display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500',
  },
  layout: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  card: {
    background: '#ffffff', borderRadius: '18px', padding: '24px',
    marginBottom: '16px', boxShadow: '0 2px 12px rgba(13,43,94,0.04)',
    border: '1px solid rgba(13,43,94,0.06)',
  },
  cardTitle: {
    fontSize: '16px', fontWeight: '700', color: '#0D2B5E', margin: '0 0 18px',
    fontFamily: "'Outfit', sans-serif",
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  sidebar: { width: '280px', flexShrink: 0 },
  timeline: { display: 'flex', gap: '0' },
  timelineItem: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px',
  },
  dot: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: '#f8fafc', color: '#94a3b8',
    border: '2px solid #e2e8f0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '13px', transition: 'all 0.3s ease',
  },
  line: {
    width: '2px', height: '24px', background: '#e2e8f0',
    transition: 'background 0.3s ease',
  },
  stepLabel: { fontSize: '12px', color: '#94a3b8', textAlign: 'center' },
  itemRow: {
    display: 'flex', gap: '14px', alignItems: 'center',
    paddingBottom: '14px', marginBottom: '14px',
    borderBottom: '1px solid rgba(13,43,94,0.04)',
  },
  itemImgWrap: {
    width: '64px', height: '64px', borderRadius: '12px',
    background: '#f8fafc', overflow: 'hidden', flexShrink: 0,
    border: '1px solid rgba(13,43,94,0.04)',
  },
  itemImg: { width: '100%', height: '100%', objectFit: 'contain' },
  itemName: { margin: 0, fontWeight: '600', color: '#0D2B5E', fontSize: '14px' },
  itemMeta: { margin: '4px 0 0', color: '#64748b', fontSize: '13px' },
  itemPrice: { margin: 0, fontWeight: '700', color: '#0D2B5E', fontSize: '15px' },
  addressText: { margin: '0 0 4px', color: '#475569', fontSize: '14px' },
  priceRow: {
    display: 'flex', justifyContent: 'space-between', marginBottom: '10px',
    fontSize: '14px', color: '#475569',
  },
  totalRow: {
    display: 'flex', justifyContent: 'space-between',
    fontWeight: '800', fontSize: '17px',
    borderTop: '2px solid rgba(13,43,94,0.06)',
    paddingTop: '14px', marginTop: '8px',
    fontFamily: "'Outfit', sans-serif",
  },
  bigStatus: {
    padding: '10px 28px', borderRadius: '20px', fontSize: '15px',
    fontWeight: '700', display: 'inline-block',
  },
};

export default OrderDetailPage;
