import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../utils/api';
import { FiCheck, FiPackage, FiTruck, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    document.title = 'Order Placed Successfully! — TechZone';
    getOrderById(id).then(res => setOrder(res.data)).catch(console.error);
  }, [id]);

  const STEPS = [
    { label: 'Order Placed', icon: <FiCheck size={14} />, done: true },
    { label: 'Processing', icon: <FiShoppingBag size={14} />, done: false },
    { label: 'Shipped', icon: <FiTruck size={14} />, done: false },
    { label: 'Delivered', icon: <FiPackage size={14} />, done: false },
  ];

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Confetti particles */}
        <div style={s.confettiWrap}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              ...s.confettiDot,
              left: `${15 + i * 14}%`,
              background: ['#00a3ff', '#0D2B5E', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][i],
              animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>

        {/* Success Icon */}
        <div style={s.successIcon}>
          <div style={s.successCircle}>
            <FiCheck size={36} />
          </div>
        </div>

        <h1 style={s.title}>Order Placed Successfully!</h1>
        <p style={s.subtitle}>Thank you for your order. We&apos;ll start processing it right away.</p>

        {order && (
          <div style={s.orderInfo}>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Order ID:</span>
              <span style={s.infoVal}>#{order._id.slice(-10).toUpperCase()}</span>
            </div>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Total Amount:</span>
              <span style={{ ...s.infoVal, color: '#0D2B5E', fontWeight: '800', fontFamily: "'Outfit', sans-serif" }}>
                Rs. {order.totalPrice?.toLocaleString()}
              </span>
            </div>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Payment:</span>
              <span style={s.infoVal}>{order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online'}</span>
            </div>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Status:</span>
              <span style={{ ...s.infoVal, color: '#f59e0b', fontWeight: '600' }}>{order.orderStatus}</span>
            </div>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Delivery:</span>
              <span style={s.infoVal}>{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div style={s.timeline}>
          {STEPS.map((step, i) => (
            <div key={i} style={s.timelineStep}>
              <div style={{
                ...s.dot,
                ...(step.done ? { background: '#00a3ff', color: '#ffffff', border: '2px solid #00a3ff' } : {}),
              }}>
                {step.icon}
              </div>
              <span style={{
                fontSize: '12px',
                color: step.done ? '#00a3ff' : '#94a3b8',
                fontWeight: step.done ? '600' : '400',
              }}>{step.label}</span>
            </div>
          ))}
        </div>

        <div style={s.actions}>
          <Link to={`/order/${id}`} style={s.primaryBtn}>
            View Order Details <FiArrowRight size={14} />
          </Link>
          <Link to="/products" style={s.secondaryBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: '70vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '40px 20px',
  },
  card: {
    background: '#ffffff', borderRadius: '24px', padding: '50px 44px',
    maxWidth: '500px', width: '100%', textAlign: 'center',
    boxShadow: '0 8px 40px rgba(13,43,94,0.08)',
    border: '1px solid rgba(13,43,94,0.06)', position: 'relative',
    overflow: 'hidden', animation: 'tz-scaleIn 0.5s ease',
  },
  confettiWrap: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '60px',
    overflow: 'hidden', pointerEvents: 'none',
  },
  confettiDot: {
    position: 'absolute', top: '60px', width: '8px', height: '8px',
    borderRadius: '50%', animation: 'tz-confetti 1.5s ease-out forwards',
  },
  successIcon: { marginBottom: '20px' },
  successCircle: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #0D2B5E, #00a3ff)',
    color: '#ffffff', display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto',
    boxShadow: '0 8px 24px rgba(0,163,255,0.25)',
    animation: 'tz-pulseGlow 2s ease infinite',
  },
  title: {
    fontSize: '28px', fontWeight: '800', color: '#0D2B5E', margin: '0 0 8px',
    fontFamily: "'Outfit', 'Inter', sans-serif",
  },
  subtitle: { color: '#64748b', fontSize: '15px', margin: '0 0 28px', lineHeight: '1.5' },
  orderInfo: {
    background: '#f8fafc', borderRadius: '14px', padding: '22px',
    marginBottom: '24px', textAlign: 'left',
    border: '1px solid rgba(13,43,94,0.04)',
  },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px',
  },
  infoLabel: { color: '#64748b' },
  infoVal: { color: '#0D2B5E', fontWeight: '500' },
  timeline: {
    display: 'flex', justifyContent: 'space-between',
    background: '#f8fafc', borderRadius: '14px', padding: '18px',
    marginBottom: '28px', border: '1px solid rgba(13,43,94,0.04)',
  },
  timelineStep: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
  },
  dot: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: '#f8fafc', color: '#94a3b8',
    border: '2px solid #e2e8f0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  actions: {
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  primaryBtn: {
    background: '#0D2B5E', color: '#fff', textDecoration: 'none',
    padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    boxShadow: '0 4px 16px rgba(13,43,94,0.15)',
    transition: 'all 0.2s ease',
  },
  secondaryBtn: {
    background: '#f8fafc', color: '#475569', textDecoration: 'none',
    padding: '14px', borderRadius: '12px', fontWeight: '600', fontSize: '14px',
    display: 'block', border: '1px solid rgba(13,43,94,0.06)',
    transition: 'all 0.2s ease',
  },
};

export default OrderSuccessPage;
