import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../context/AppContext';
import { FiSearch, FiMenu, FiX, FiShoppingCart, FiHeart, FiPackage, FiUser, FiLogOut, FiShield } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <nav style={{ ...s.nav, ...(scrolled ? s.navScrolled : {}) }}>
      <div style={s.container}>
        <Link to="/" style={s.logoWrap} onClick={() => setMenuOpen(false)}>
          <span style={s.logoMark}>TZ</span>
          <div style={s.logoText}>
            <span style={s.logoTech}>Tech</span>
            <span style={s.logoZone}>Zone</span>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="tz-nav-search-desktop" style={s.searchForm}>
          <FiSearch style={s.searchIcon} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={s.searchInput}
            className="tz-search-input"
            id="nav-search"
          />
          <button type="submit" style={s.searchBtn}>Search</button>
        </form>

        <div className="tz-nav-desktop" style={s.desktopLinks}>
          <Link to="/products" style={s.navLink} className="tz-nav-link">Products</Link>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" style={{ ...s.navLink, color: 'var(--tz-accent)' }} className="tz-nav-link"><FiShield size={14} /> Admin</Link>}
              <Link to="/wishlist" style={s.navLink} className="tz-nav-link"><FiHeart size={14} /> Wishlist</Link>
              <Link to="/my-orders" style={s.navLink} className="tz-nav-link"><FiPackage size={14} /> Orders</Link>
              <Link to="/profile" style={s.navLink} className="tz-nav-link"><FiUser size={14} /> {user.name.split(' ')[0]}</Link>
              <button onClick={handleLogout} style={s.logoutBtn} className="tz-nav-ghost"><FiLogOut size={13} /> Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.navLink} className="tz-nav-link">Login</Link>
              <Link to="/register" style={s.registerBtn} className="tz-nav-cta">Register</Link>
            </>
          )}
          <Link to="/cart" style={s.cartBtn} className="tz-nav-cart" id="nav-cart">
            <FiShoppingCart size={19} />
            {cartCount > 0 && <span style={s.badge}>{cartCount}</span>}
          </Link>
        </div>

        <div className="tz-nav-mobile-right" style={s.mobileRight}>
          <Link to="/cart" style={s.cartBtn} className="tz-nav-cart">
            <FiShoppingCart size={19} />
            {cartCount > 0 && <span style={s.badge}>{cartCount}</span>}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} style={s.hamburger} aria-label="Toggle menu">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={s.mobileMenu}>
          <form onSubmit={handleSearch} style={s.mobileSearchForm}>
            <FiSearch style={{ ...s.searchIcon, left: '14px' }} />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...s.searchInput, borderRadius: '10px', paddingRight: '14px', width: '100%' }} className="tz-search-input" />
          </form>
          <Link to="/products" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">Products</Link>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">Admin Panel</Link>}
              <Link to="/wishlist" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">Wishlist</Link>
              <Link to="/my-orders" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">My Orders</Link>
              <Link to="/profile" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">Profile</Link>
              <button onClick={handleLogout} style={s.mobileLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">Login</Link>
              <Link to="/register" style={{ ...s.mobileLink, color: 'var(--tz-accent)', fontWeight: '600' }} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const s = {
  nav: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid var(--tz-border)',
    transition: 'all 0.3s ease',
  },
  navScrolled: {
    boxShadow: '0 1px 20px rgba(22, 23, 27, 0.06)',
    background: 'rgba(255, 255, 255, 0.95)',
  },
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    height: '72px',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoMark: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'var(--tz-ink)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 800,
    fontSize: '15px',
    letterSpacing: '-0.02em',
  },
  logoText: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0px',
  },
  logoTech: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--tz-ink)',
    fontFamily: "'Outfit', 'Inter', sans-serif",
    letterSpacing: '-0.02em',
  },
  logoZone: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--tz-accent)',
    fontFamily: "'Outfit', 'Inter', sans-serif",
    letterSpacing: '-0.02em',
  },
  searchForm: {
    display: 'flex',
    flex: 1,
    maxWidth: '440px',
    position: 'relative',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    color: 'var(--tz-text-muted)',
    fontSize: '15px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    padding: '11px 14px 11px 40px',
    border: '1px solid var(--tz-border)',
    borderRadius: '10px 0 0 10px',
    background: 'var(--tz-canvas)',
    color: 'var(--tz-ink)',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  searchBtn: {
    padding: '11px 20px',
    background: 'var(--tz-ink)',
    border: '1px solid var(--tz-ink)',
    borderRadius: '0 10px 10px 0',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    transition: 'background 0.2s ease',
  },
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  navLink: {
    color: 'var(--tz-text-body)',
    textDecoration: 'none',
    fontSize: '13.5px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid var(--tz-border)',
    color: 'var(--tz-text-body)',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13.5px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  registerBtn: {
    background: 'var(--tz-accent)',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '9px 18px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  cartBtn: {
    position: 'relative',
    color: 'var(--tz-ink)',
    textDecoration: 'none',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 10px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  badge: {
    position: 'absolute',
    top: '-1px',
    right: '-2px',
    background: 'var(--tz-accent)',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '10px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--tz-paper)',
  },
  mobileRight: {
    display: 'none',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto',
  },
  hamburger: {
    background: 'none',
    border: 'none',
    color: 'var(--tz-ink)',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
  },
  mobileMenu: {
    position: 'absolute',
    top: '72px',
    left: 0,
    right: 0,
    background: 'var(--tz-paper)',
    borderTop: '1px solid var(--tz-border)',
    padding: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    animation: 'tz-slideDown 0.3s ease',
    boxShadow: '0 10px 30px rgba(22,23,27,0.08)',
    zIndex: 999,
  },
  mobileSearchForm: {
    position: 'relative',
    marginBottom: '8px',
  },
  mobileLink: {
    color: 'var(--tz-text-body)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    padding: '11px 14px',
    borderRadius: '8px',
    display: 'block',
    transition: 'background 0.2s ease',
  },
  mobileLogout: {
    background: 'none',
    border: '1px solid var(--tz-border)',
    color: 'var(--tz-text-body)',
    padding: '11px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    textAlign: 'left',
    marginTop: '4px',
  },
};

const responsiveStyle = document.createElement('style');
responsiveStyle.textContent = `
  @media (max-width: 860px) {
    .tz-nav-desktop { display: none !important; }
    .tz-nav-mobile-right { display: flex !important; }
    .tz-nav-search-desktop { display: none !important; }
  }
  @media (min-width: 861px) {
    .tz-nav-mobile-right { display: none !important; }
    .tz-nav-desktop { display: flex !important; }
    .tz-nav-search-desktop { display: flex !important; }
  }
  .tz-nav-link:hover { background: var(--tz-canvas) !important; color: var(--tz-ink) !important; }
  .tz-nav-ghost:hover { border-color: var(--tz-ink) !important; color: var(--tz-ink) !important; }
  .tz-nav-cta:hover { background: var(--tz-accent-hover) !important; }
  .tz-nav-cart:hover { background: var(--tz-canvas) !important; }
  .tz-nav-mobile-link:hover { background: var(--tz-canvas) !important; }
  .tz-search-input:focus { border-color: var(--tz-accent) !important; background: #ffffff !important; box-shadow: 0 0 0 3px var(--tz-accent-soft) !important; }
`;
if (!document.getElementById('tz-nav-responsive')) {
  responsiveStyle.id = 'tz-nav-responsive';
  document.head.appendChild(responsiveStyle);
}

export default Navbar;
