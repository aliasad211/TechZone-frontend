import React, { useState } from 'react';
import { useAuth } from '../context/AppContext';
import { updateProfile } from '../utils/api';
import toast from 'react-hot-toast';
import { FiEdit3, FiSave, FiX, FiUser, FiMail, FiPhone, FiLock, FiShield } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!'); return;
    }
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      const { data } = await updateProfile(payload);
      login({ ...user, ...data });
      toast.success('Profile updated successfully!');
      setEditing(false);
      setForm(p => ({ ...p, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.container}>
      <h1 style={s.pageTitle}>My Profile</h1>
      <div style={s.layout}>
        {/* Profile Card */}
        <div style={s.profileCard}>
          <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <h2 style={s.name}>{user?.name}</h2>
          <p style={s.email}>{user?.email}</p>
          {user?.role === 'admin' && (
            <span style={s.adminBadge}><FiShield size={12} /> Admin</span>
          )}
          <div style={s.divider} />
          <p style={s.joined}>Member since {new Date().getFullYear()}</p>
        </div>

        {/* Edit Form */}
        <div style={s.formCard}>
          <div style={s.formHeader}>
            <h2 style={s.cardTitle}>Account Information</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} style={s.editBtn}>
                <FiEdit3 size={14} /> Edit
              </button>
            )}
          </div>

          {!editing ? (
            <div>
              {[
                { icon: <FiUser size={15} />, label: 'Full Name', value: user?.name },
                { icon: <FiMail size={15} />, label: 'Email', value: user?.email },
                { icon: <FiPhone size={15} />, label: 'Phone', value: user?.phone || '—' },
                { icon: <FiLock size={15} />, label: 'Password', value: '••••••••' },
              ].map((row, i) => (
                <div key={i} style={s.infoRow}>
                  <div style={s.infoLeft}>
                    <span style={s.infoIcon}>{row.icon}</span>
                    <span style={s.infoLabel}>{row.label}</span>
                  </div>
                  <span style={s.infoVal}>{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={s.field}>
                <label style={s.label}><FiUser size={13} /> Full Name</label>
                <input style={s.input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div style={s.field}>
                <label style={s.label}><FiMail size={13} /> Email (cannot be changed)</label>
                <input style={{ ...s.input, background: '#f8fafc', color: '#94a3b8' }} value={user?.email} disabled />
              </div>
              <div style={s.field}>
                <label style={s.label}><FiPhone size={13} /> Phone</label>
                <input style={s.input} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="03001234567" type="tel" />
              </div>

              <div style={s.passwordSection}>
                <p style={s.passwordHint}>Want to change your password? (optional)</p>
                <div style={s.field}>
                  <label style={s.label}><FiLock size={13} /> New Password</label>
                  <input style={s.input} type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" />
                </div>
                <div style={s.field}>
                  <label style={s.label}><FiLock size={13} /> Confirm Password</label>
                  <input style={s.input} type="password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="••••••••" />
                </div>
              </div>

              <div style={s.formActions}>
                <button type="submit" disabled={loading} style={s.saveBtn}>
                  <FiSave size={14} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditing(false)} style={s.cancelBtn}>
                  <FiX size={14} /> Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '30px 20px' },
  pageTitle: {
    fontSize: '26px', fontWeight: '800', color: '#0D2B5E', margin: '0 0 24px',
    fontFamily: "'Outfit', 'Inter', sans-serif",
  },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  profileCard: {
    width: '240px', background: '#ffffff', borderRadius: '20px',
    padding: '36px 24px', textAlign: 'center',
    boxShadow: '0 2px 12px rgba(13,43,94,0.05)',
    border: '1px solid rgba(13,43,94,0.06)', flexShrink: 0,
  },
  avatar: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #0D2B5E, #00a3ff)',
    color: '#fff', fontSize: '32px', fontWeight: '800',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(0,163,255,0.2)',
  },
  name: {
    fontSize: '18px', fontWeight: '700', color: '#0D2B5E', margin: '0 0 4px',
    fontFamily: "'Outfit', sans-serif",
  },
  email: { color: '#64748b', fontSize: '13px', margin: '0 0 12px', wordBreak: 'break-all' },
  adminBadge: {
    background: 'rgba(0,163,255,0.08)', color: '#0D2B5E',
    padding: '4px 14px', borderRadius: '20px', fontSize: '12px',
    fontWeight: '700', display: 'inline-flex', alignItems: 'center',
    gap: '4px', border: '1px solid rgba(0,163,255,0.15)',
  },
  divider: {
    height: '1px', background: 'rgba(13,43,94,0.06)', margin: '16px 0',
  },
  joined: { color: '#94a3b8', fontSize: '12px', margin: 0 },
  formCard: {
    flex: 1, background: '#ffffff', borderRadius: '20px',
    padding: '30px', boxShadow: '0 2px 12px rgba(13,43,94,0.05)',
    border: '1px solid rgba(13,43,94,0.06)',
  },
  formHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '18px', fontWeight: '700', color: '#0D2B5E', margin: 0,
    fontFamily: "'Outfit', sans-serif",
  },
  editBtn: {
    background: 'rgba(0,163,255,0.06)', color: '#0D2B5E', border: '1px solid rgba(0,163,255,0.15)',
    padding: '8px 18px', borderRadius: '10px', cursor: 'pointer',
    fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
    transition: 'all 0.2s ease',
  },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 0', borderBottom: '1px solid rgba(13,43,94,0.04)',
  },
  infoLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  infoIcon: { color: '#00a3ff', display: 'flex', alignItems: 'center' },
  infoLabel: { color: '#64748b', fontSize: '14px' },
  infoVal: { color: '#0D2B5E', fontWeight: '600', fontSize: '14px' },
  field: { marginBottom: '14px' },
  label: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px',
  },
  input: {
    width: '100%', padding: '11px 14px', border: '1.5px solid rgba(13,43,94,0.1)',
    borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  passwordSection: {
    borderTop: '1px solid rgba(13,43,94,0.06)', paddingTop: '18px', marginTop: '18px',
  },
  passwordHint: {
    fontSize: '13px', color: '#64748b', margin: '0 0 14px',
  },
  formActions: { display: 'flex', gap: '10px', marginTop: '8px' },
  saveBtn: {
    background: '#0D2B5E', color: '#fff', border: 'none',
    padding: '11px 24px', borderRadius: '10px', cursor: 'pointer',
    fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center',
    gap: '6px', transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(13,43,94,0.15)',
  },
  cancelBtn: {
    background: '#f8fafc', color: '#475569', border: '1px solid rgba(13,43,94,0.1)',
    padding: '11px 20px', borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px',
  },
};

export default ProfilePage;
