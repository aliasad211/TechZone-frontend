import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../utils/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page };
      if (filter) params.status = filter;
      const { data } = await getAllOrders(params);
      setOrders(data.orders);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, filter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated!');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Orders Management</h1>

      {/* Filter */}
      <div style={styles.filterBar}>
        {['', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            style={{ ...styles.filterBtn, ...(filter === s ? styles.activeFilter : {}) }}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <p style={{ color: '#64748b' }}>Loading...</p> : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="7" style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }}>No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order._id} style={{ background: '#fff' }}>
                  <td style={styles.td}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td style={styles.td}>
                    <strong>{order.user?.name || 'Guest'}</strong>
                    <br /><small style={{ color: '#94a3b8' }}>{order.user?.email}</small>
                  </td>
                  <td style={styles.td}>{order.orderItems.length} items</td>
                  <td style={{ ...styles.td, fontWeight: '700' }}>Rs. {order.totalPrice?.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString('en-PK')}</td>
                  <td style={styles.td}>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={styles.select}
                    >
                      {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div style={styles.pagination}>
          {[...Array(pages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{ ...styles.pageBtn, ...(page === i + 1 ? styles.activePage : {}) }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  filterBar: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  filterBtn: { padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#475569', transition: 'all 0.2s' },
  activeFilter: { background: '#1e293b', color: '#fff', border: '1px solid #1e293b' },
  tableWrap: { background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: { background: '#f8fafc', padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#475569' },
  td: { padding: '12px 16px', color: '#1e293b', borderBottom: '1px solid #f1f5f9' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' },
  select: { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  pagination: { display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'center' },
  pageBtn: { width: '36px', height: '36px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '14px' },
  activePage: { background: '#1e293b', color: '#fff', border: '1px solid #1e293b' }
};

export default AdminOrders;
