import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => (
  <footer style={s.footer}>
    <div style={s.container}>
      {/* Top Grid */}
      <div style={s.grid}>
        {/* Brand Column */}
        <div style={s.brandCol}>
          <div style={s.logoWrap}>
            <svg width="32" height="32" viewBox="0 0 100 100">
              <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="#00a3ff" stroke="#00a3ff" strokeWidth="4" />
              <polygon points="50,12 83,31 83,69 50,88 17,69 17,31" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <text x="50" y="58" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="900" fontFamily="system-ui, sans-serif">TZ</text>
            </svg>
            <div>
              <span style={s.logoTech}>Tech</span>
              <span style={s.logoZone}>Zone</span>
            </div>
          </div>
          <p style={s.desc}>Pakistan&apos;s premium electronics store. Latest gadgets, unbeatable prices, and lightning-fast delivery.</p>
          <div style={s.socials}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={s.socialIcon} aria-label="Facebook"><FaFacebookF size={14} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={s.socialIcon} aria-label="Twitter"><FaTwitter size={14} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={s.socialIcon} aria-label="Instagram"><FaInstagram size={14} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={s.socialIcon} aria-label="YouTube"><FaYoutube size={14} /></a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 style={s.heading}>Categories</h4>
          {['Mobiles', 'Laptops', 'TVs', 'Audio', 'Gaming', 'Cameras'].map(c => (
            <Link key={c} to={`/products?category=${c}`} style={s.link}>{c}</Link>
          ))}
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={s.heading}>Quick Links</h4>
          <Link to="/products" style={s.link}>All Products</Link>
          <Link to="/my-orders" style={s.link}>My Orders</Link>
          <Link to="/wishlist" style={s.link}>Wishlist</Link>
          <Link to="/profile" style={s.link}>My Profile</Link>
          <Link to="/cart" style={s.link}>Shopping Cart</Link>
        </div>

        {/* Contact */}
        <div>
          <h4 style={s.heading}>Contact Us</h4>
          <p style={s.contactText}>📧 support@techzone.pk</p>
          <p style={s.contactText}>📱 +92-300-1234567</p>
          <p style={s.contactText}>📍 Islamabad, Pakistan</p>
          <p style={{ ...s.contactText, marginTop: '12px' }}>🕐 Mon – Sat: 9AM – 10PM</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div style={s.paymentStrip}>
        <span style={s.payLabel}>We Accept:</span>
        <div style={s.payBadges}>
          {['Visa', 'Mastercard', 'JazzCash', 'EasyPaisa', 'COD'].map(p => (
            <span key={p} style={s.payBadge}>{p}</span>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={s.bottom}>
        <p style={s.copyright}>© {new Date().getFullYear()} TechZone. All rights reserved. Pakistan&apos;s Tech Store.</p>
      </div>
    </div>
  </footer>
);

const s = {
  footer: {
    background: 'linear-gradient(180deg, #0D2B5E 0%, #0a1e3f 100%)',
    marginTop: '0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '50px 20px 20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '36px',
    marginBottom: '36px',
  },
  brandCol: {
    maxWidth: '280px',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px',
  },
  logoTech: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: "'Outfit', sans-serif",
  },
  logoZone: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#00a3ff',
    fontFamily: "'Outfit', sans-serif",
  },
  desc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    lineHeight: '1.7',
    marginBottom: '16px',
  },
  socials: {
    display: 'flex',
    gap: '8px',
  },
  socialIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  heading: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '700',
    margin: '0 0 16px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    position: 'relative',
    paddingBottom: '10px',
  },
  link: {
    display: 'block',
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: '13px',
    marginBottom: '8px',
    transition: 'color 0.2s ease',
    paddingLeft: '0',
  },
  contactText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    margin: '0 0 8px',
  },
  paymentStrip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    padding: '18px 0',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    flexWrap: 'wrap',
  },
  payLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '12px',
    fontWeight: '600',
  },
  payBadges: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  payBadge: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  bottom: {
    paddingTop: '18px',
    textAlign: 'center',
  },
  copyright: {
    margin: 0,
    color: 'rgba(255,255,255,0.3)',
    fontSize: '12px',
  },
};

// Add hover styles
const footerStyle = document.createElement('style');
footerStyle.textContent = `
  footer a:hover { color: #00a3ff !important; }
  footer a[style*="socialIcon"]:hover, .tz-social-icon:hover { background: rgba(0,163,255,0.15) !important; color: #00a3ff !important; border-color: rgba(0,163,255,0.3) !important; }
`;
if (!document.getElementById('tz-footer-styles')) {
  footerStyle.id = 'tz-footer-styles';
  document.head.appendChild(footerStyle);
}

export default Footer;
