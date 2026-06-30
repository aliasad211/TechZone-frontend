import React, { useState, useEffect } from 'react';
import { getAdminUsers, toggleBlockUser } from '../utils/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers()
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleBlock = async (id, name, isBlocked) => {
    const action = isBlocked ? 'unblock' : 'block';
    // TODO(security): Use framework-native modal instead of window.confirm
    if (!window.confirm(`Are you sure you want to ${action} "${name}"?`)) return;
    try {
      await toggleBlockUser(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
      toast.success(`User ${action}ed!`);
    } catch { toast.error('Action failed'); }
  };

  return (
    <div>
      <h1 style={styles.title}>Users Management</h1>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>Total: {users.length} users</p>

      {loading ? <p style={{ color: '#64748b' }}>Loading...</p> : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Name', 'Email', 'Phone', 'Joined', 'Status', 'Action'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ background: '#fff' }}>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.phone || '—'}</td>
                  <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString('en-PK')}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => handleToggleBlock(user._id, user.name, user.isBlocked)} style={{ ...styles.actionBtn, ...(user.isBlocked ? styles.unblockBtn : styles.blockBtn) }}>
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px' },
  tableWrap: { background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: { background: '#f8fafc', padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#475569' },
  td: { padding: '12px 16px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', border: '1px solid #e2e8f0' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' },
  actionBtn: { border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s' },
  blockBtn: { background: '#f1f5f9', color: '#b91c1c' },
  unblockBtn: { background: '#f1f5f9', color: '#334155' }
};

export default AdminUsers;
