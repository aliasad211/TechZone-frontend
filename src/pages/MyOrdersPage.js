import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../utils/api';
import { FiPackage, FiArrowRight, FiChevronRight } from 'react-icons/fi';

const STATUS_COLOR = {
  Pending: { bg: 'rgba(245,158,11,0.1)', text: '#92400e', border: 'rgba(245,158,11,0.2)' },
  Processing: { bg: 'rgba(0,163,255,0.08)', text: '#0D2B5E', border: 'rgba(0,163,255,0.15)' },
  Shipped: { bg: 'rgba(139,92,246,0.08)', text: '#5b21b6', border: 'rgba(139,92,246,0.15)' },
  Delivered: { bg: 'rgba(16,185,129,0.08)', text: '#065f46', border: 'rgba(16,185,129,0.15)' },
  Cancelled: { bg: 'rgba(239,68,68,0.08)', text: '#991b1b', border: 'rgba(239,68,68,0.15)' }
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Orders — TechZone';
    getMyOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.spinner} />
      <p style={{ color: '#64748b', marginTop: '12px' }}>Loading orders...</p>
    </div>
  );

  return (
    <div style={s.container}>
      <h1 style={s.title}>
        <FiPackage size={22} /> My Orders
        <span style={s.titleCount}>{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </h1>

      {orders.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}><FiPackage size={48} /></div>
          <h3 style={s.emptyTitle}>No orders yet</h3>
          <p style={s.emptySub}>You haven&apos;t placed any orders. Start shopping!</p>
          <Link to="/products" style={s.shopBtn}>Start Shopping <FiArrowRight size={14} /></Link>
        </div>
      ) : (
        <div>
          {orders.map(order => {
            const sc = STATUS_COLOR[order.orderStatus] || STATUS_COLOR.Pending;
            return (
              <div key={order._id} style={s.orderCard}>
                <div style={s.orderHeader}>
                  <div>
                    <p style={s.orderId}>Order #{order._id.slice(-10).toUpperCase()}</p>
                    <p style={s.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ ...s.statusBadge, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                      {order.orderStatus}
                    </span>
                    <p style={s.totalAmt}>Rs. {order.totalPrice?.toLocaleString()}</p>
                  </div>
                </div>

                <div style={s.items}>
                  {order.orderItems.slice(0, 3).map((item, i) => (
                    <div key={i} style={s.itemRow}>
                      <div style={s.itemImgWrap}>
                        <img src={item.image || 'https://via.placeholder.com/48'} alt={item.name} style={s.itemImg} />
                      </div>
                      <div>
                        <p style={s.itemName}>{item.name}</p>
                        <p style={s.itemMeta}>Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <p style={{ color: '#64748b', fontSize: '13px', margin: '8px 0 0' }}>+{order.orderItems.length - 3} more items</p>
                  )}
                </div>

                <div style={s.orderFooter}>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                    {' · '}
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}
                  </div>
                  <Link to={`/order/${order._id}`} style={s.detailsBtn}>
                    View Details <FiChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const s = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '30px 20px' },
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
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: {
    width: '90px', height: '90px', borderRadius: '50%',
    background: 'rgba(0,163,255,0.06)', color: '#00a3ff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
  },
  emptyTitle: { fontSize: '20px', fontWeight: '700', color: '#0D2B5E', margin: '0 0 8px' },
  emptySub: { color: '#64748b', fontSize: '14px', margin: '0 0 24px' },
  shopBtn: {
    background: '#0D2B5E', color: '#fff', textDecoration: 'none',
    padding: '12px 28px', borderRadius: '10px', fontWeight: '700', fontSize: '14px',
    display: 'inline-flex', alignItems: 'center', gap: '6px',
  },
  orderCard: {
    background: '#ffffff', borderRadius: '18px', padding: '22px',
    marginBottom: '16px', boxShadow: '0 2px 12px rgba(13,43,94,0.04)',
    border: '1px solid rgba(13,43,94,0.06)', transition: 'all 0.2s ease',
  },
  orderHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '16px', paddingBottom: '16px',
    borderBottom: '1px solid rgba(13,43,94,0.04)',
  },
  orderId: {
    fontWeight: '700', color: '#0D2B5E', margin: 0, fontSize: '15px',
    fontFamily: "'Outfit', sans-serif",
  },
  orderDate: { color: '#64748b', fontSize: '13px', margin: '4px 0 0' },
  statusBadge: {
    padding: '4px 14px', borderRadius: '20px', fontSize: '12px',
    fontWeight: '700', display: 'inline-block',
  },
  totalAmt: {
    fontWeight: '800', color: '#0D2B5E', fontSize: '16px', margin: '6px 0 0',
    fontFamily: "'Outfit', sans-serif",
  },
  items: { marginBottom: '16px' },
  itemRow: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' },
  itemImgWrap: {
    width: '48px', height: '48px', borderRadius: '10px',
    background: '#f8fafc', overflow: 'hidden', flexShrink: 0,
    border: '1px solid rgba(13,43,94,0.04)',
  },
  itemImg: { width: '100%', height: '100%', objectFit: 'contain' },
  itemName: { margin: 0, fontWeight: '600', color: '#0D2B5E', fontSize: '14px' },
  itemMeta: { margin: '2px 0 0', color: '#64748b', fontSize: '12px' },
  orderFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: '14px', borderTop: '1px solid rgba(13,43,94,0.04)',
  },
  detailsBtn: {
    color: '#00a3ff', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '4px',
  },
};

export default MyOrdersPage;
