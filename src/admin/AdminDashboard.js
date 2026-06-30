import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../utils/api';

const StatCard = ({ title, value, link }) => (
  <Link to={link || '#'} style={styles.statCard}>
    <div>
      <p style={styles.statLabel}>{title}</p>
      <h2 style={styles.statValue}>{value}</h2>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;
  if (!stats) return <div style={styles.loading}>Failed to load stats</div>;

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div>
      <h1 style={styles.pageTitle}>Dashboard</h1>

      {/* Stat Cards */}
      <div style={styles.statsGrid}>
        <StatCard title="Total Revenue" value={`Rs. ${stats.totalRevenue?.toLocaleString()}`} link="/admin/orders" />
        <StatCard title="Total Orders" value={stats.totalOrders} link="/admin/orders" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} link="/admin/orders" />
        <StatCard title="Total Products" value={stats.totalProducts} link="/admin/products" />
        <StatCard title="Total Users" value={stats.totalUsers} link="/admin/users" />
      </div>

      {/* Monthly Sales Table */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Monthly Sales (Last 6 Months)</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Month</th>
              <th style={styles.th}>Orders</th>
              <th style={styles.th}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {stats.monthlySales?.length > 0 ? stats.monthlySales.map((m, i) => (
              <tr key={i} style={{ background: '#fff' }}>
                <td style={styles.td}>{MONTHS[m._id.month - 1]} {m._id.year}</td>
                <td style={styles.td}>{m.orders}</td>
                <td style={{ ...styles.td, fontWeight: '600' }}>Rs. {m.revenue?.toLocaleString()}</td>
              </tr>
            )) : (
              <tr><td colSpan="3" style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }}>No sales data yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Top Products */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Top Selling Products</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Units Sold</th>
            </tr>
          </thead>
          <tbody>
            {stats.topProducts?.length > 0 ? stats.topProducts.map((p, i) => (
              <tr key={i} style={{ background: '#fff' }}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{p.name || 'Unknown Product'}</td>
                <td style={{ ...styles.td, fontWeight: '600' }}>{p.totalSold}</td>
              </tr>
            )) : (
              <tr><td colSpan="3" style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }}>No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
          <Link to="/admin/products/add" style={styles.actionBtn}>Add Product</Link>
          <Link to="/admin/orders" style={styles.actionBtn}>View Pending Orders</Link>
          <Link to="/admin/users" style={styles.actionBtn}>Manage Users</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageTitle: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 24px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' },
  statCard: { background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', textDecoration: 'none', display: 'block' },
  statLabel: { color: '#64748b', fontSize: '14px', margin: '0 0 8px' },
  statValue: { fontSize: '28px', fontWeight: '800', margin: 0, color: '#1e293b' },
  section: { background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e2e8f0' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: { background: '#f8fafc', padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#475569' },
  td: { padding: '12px 16px', color: '#1e293b', borderBottom: '1px solid #e2e8f0' },
  loading: { padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '18px' },
  quickActions: { background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' },
  actionBtn: { background: '#1e293b', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.2s' }
};

export default AdminDashboard;
