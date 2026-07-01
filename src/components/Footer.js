import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => (
  <footer style={s.footer}>
    <div style={s.container}>
      <div style={s.grid}>
        <div style={s.brandCol}>
          <div style={s.logoWrap}>
            <span style={s.logoMark}>TZ</span>
            <div>
              <span style={s.logoTech}>Tech</span>
              <span style={s.logoZone}>Zone</span>
            </div>
          </div>
          <p style={s.desc}>Pakistan&apos;s premium electronics store. Latest gadgets, unbeatable prices, and lightning-fast delivery.</p>
          <div style={s.socials}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={s.socialIcon} className="tz-social" aria-label="Facebook"><FaFacebookF size={13} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={s.socialIcon} className="tz-social" aria-label="Twitter"><FaTwitter size={13} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={s.socialIcon} className="tz-social" aria-label="Instagram"><FaInstagram size={13} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={s.socialIcon} className="tz-social" aria-label="YouTube"><FaYoutube size={13} /></a>
          </div>
        </div>

        <div>
          <h4 style={s.heading}>Categories</h4>
          {['Mobiles', 'Laptops', 'TVs', 'Audio', 'Gaming', 'Cameras'].map(c => (
            <Link key={c} to={`/products?category=${c}`} style={s.link} className="tz-foot-link">{c}</Link>
          ))}
        </div>

        <div>
          <h4 style={s.heading}>Quick Links</h4>
          <Link to="/products" style={s.link} className="tz-foot-link">All Products</Link>
          <Link to="/my-orders" style={s.link} className="tz-foot-link">My Orders</Link>
          <Link to="/wishlist" style={s.link} className="tz-foot-link">Wishlist</Link>
          <Link to="/profile" style={s.link} className="tz-foot-link">My Profile</Link>
          <Link to="/cart" style={s.link} className="tz-foot-link">Shopping Cart</Link>
        </div>

        <div>
          <h4 style={s.heading}>Contact</h4>
          <p style={s.contactText}>support@techzone.pk</p>
          <p style={s.contactText}>+92-300-1234567</p>
          <p style={s.contactText}>Islamabad, Pakistan</p>
          <p style={{ ...s.contactText, marginTop: '12px' }}>Mon – Sat: 9AM – 10PM</p>
        </div>
      </div>

      <div style={s.paymentStrip}>
        <span style={s.payLabel}>We Accept</span>
        <div style={s.payBadges}>
          {['Visa', 'Mastercard', 'JazzCash', 'EasyPaisa', 'COD'].map(p => (
            <span key={p} style={s.payBadge}>{p}</span>
          ))}
        </div>
      </div>

      <div style={s.bottom}>
        <p style={s.copyright}>© {new Date().getFullYear()} TechZone. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const s = {
  footer: {
    background: 'var(--tz-ink)',
    marginTop: '0',
  },
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '64px 24px 24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  brandCol: {
    maxWidth: '300px',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  logoMark: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.14)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 800,
    fontSize: '14px',
  },
  logoTech: {
    fontSize: '19px',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '-0.02em',
  },
  logoZone: {
    fontSize: '19px',
    fontWeight: '700',
    color: 'var(--tz-accent-light)',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '-0.02em',
  },
  desc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13.5px',
    lineHeight: '1.7',
    marginBottom: '18px',
  },
  socials: {
    display: 'flex',
    gap: '8px',
  },
  socialIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '9px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.65)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  heading: {
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
    margin: '0 0 18px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  },
  link: {
    display: 'block',
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: '13.5px',
    marginBottom: '10px',
    transition: 'color 0.2s ease',
  },
  contactText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13.5px',
    margin: '0 0 10px',
  },
  paymentStrip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    padding: '24px 0',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    flexWrap: 'wrap',
  },
  payLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  payBadges: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  payBadge: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)',
    padding: '5px 13px',
    borderRadius: '7px',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  bottom: {
    paddingTop: '22px',
    textAlign: 'center',
  },
  copyright: {
    margin: 0,
    color: 'rgba(255,255,255,0.35)',
    fontSize: '12.5px',
  },
};

const footerStyle = document.createElement('style');
footerStyle.textContent = `
  .tz-foot-link:hover { color: #ffffff !important; }
  .tz-social:hover { background: var(--tz-accent) !important; color: #ffffff !important; border-color: var(--tz-accent) !important; }
`;
if (!document.getElementById('tz-footer-styles')) {
  footerStyle.id = 'tz-footer-styles';
  document.head.appendChild(footerStyle);
}

export default Footer;
