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
        {/* Logo */}
        <Link to="/" style={s.logoWrap} onClick={() => setMenuOpen(false)}>
          <svg width="34" height="34" viewBox="0 0 100 100">
            <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="#00a3ff" stroke="#00a3ff" strokeWidth="4" />
            <polygon points="50,12 83,31 83,69 50,88 17,69 17,31" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <text x="50" y="58" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="900" fontFamily="system-ui, sans-serif">TZ</text>
          </svg>
          <div style={s.logoText}>
            <span style={s.logoTech}>Tech</span>
            <span style={s.logoZone}>Zone</span>
          </div>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} style={s.searchForm}>
          <FiSearch style={s.searchIcon} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={s.searchInput}
            id="nav-search"
          />
          <button type="submit" style={s.searchBtn}>Search</button>
        </form>

        {/* Desktop Links */}
        <div style={s.desktopLinks}>
          <Link to="/products" style={s.navLink}>
            Products
          </Link>

          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" style={{ ...s.navLink, color: '#00a3ff' }}>
                  <FiShield size={14} /> Admin
                </Link>
              )}
              <Link to="/wishlist" style={s.navLink}>
                <FiHeart size={14} /> Wishlist
              </Link>
              <Link to="/my-orders" style={s.navLink}>
                <FiPackage size={14} /> Orders
              </Link>
              <Link to="/profile" style={s.navLink}>
                <FiUser size={14} /> {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} style={s.logoutBtn}>
                <FiLogOut size={13} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.navLink}>Login</Link>
              <Link to="/register" style={s.registerBtn}>Register</Link>
            </>
          )}

          <Link to="/cart" style={s.cartBtn} id="nav-cart">
            <FiShoppingCart size={18} />
            {cartCount > 0 && <span style={s.badge}>{cartCount}</span>}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div style={s.mobileRight}>
          <Link to="/cart" style={s.cartBtn}>
            <FiShoppingCart size={18} />
            {cartCount > 0 && <span style={s.badge}>{cartCount}</span>}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} style={s.hamburger} aria-label="Toggle menu">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div style={s.mobileMenu}>
          <form onSubmit={handleSearch} style={s.mobileSearchForm}>
            <FiSearch style={{ ...s.searchIcon, left: '14px' }} />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...s.searchInput, borderRadius: '10px', paddingRight: '14px' }} />
          </form>
          <Link to="/products" style={s.mobileLink} onClick={() => setMenuOpen(false)}>Products</Link>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" style={s.mobileLink} onClick={() => setMenuOpen(false)}>⚡ Admin Panel</Link>}
              <Link to="/wishlist" style={s.mobileLink} onClick={() => setMenuOpen(false)}>❤️ Wishlist</Link>
              <Link to="/my-orders" style={s.mobileLink} onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
              <Link to="/profile" style={s.mobileLink} onClick={() => setMenuOpen(false)}>👤 Profile</Link>
              <button onClick={handleLogout} style={s.mobileLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={{ ...s.mobileLink, color: '#00a3ff', fontWeight: '600' }} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const s = {
  nav: {
    background: 'rgba(13, 43, 94, 0.97)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '0 20px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(0, 163, 255, 0.1)',
    transition: 'all 0.3s ease',
  },
  navScrolled: {
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
    background: 'rgba(13, 43, 94, 0.99)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    height: '68px',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoText: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0px',
  },
  logoTech: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: "'Outfit', 'Inter', sans-serif",
  },
  logoZone: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#00a3ff',
    fontFamily: "'Outfit', 'Inter', sans-serif",
  },
  searchForm: {
    display: 'flex',
    flex: 1,
    maxWidth: '420px',
    position: 'relative',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#64748b',
    fontSize: '15px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    padding: '10px 14px 10px 38px',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '10px 0 0 10px',
    background: 'rgba(255,255,255,0.08)',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  searchBtn: {
    padding: '10px 18px',
    background: '#00a3ff',
    border: 'none',
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
    gap: '6px',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  navLink: {
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    padding: '6px 10px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.7)',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.2s ease',
  },
  registerBtn: {
    background: '#00a3ff',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  cartBtn: {
    position: 'relative',
    color: '#00a3ff',
    textDecoration: 'none',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  badge: {
    position: 'absolute',
    top: '-2px',
    right: '0px',
    background: '#00a3ff',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '10px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #0D2B5E',
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
    color: '#ffffff',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
  },
  mobileMenu: {
    position: 'absolute',
    top: '68px',
    left: 0,
    right: 0,
    background: '#0D2B5E',
    borderTop: '1px solid rgba(0,163,255,0.1)',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    animation: 'tz-slideDown 0.3s ease',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  mobileSearchForm: {
    position: 'relative',
    marginBottom: '8px',
  },
  mobileLink: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '10px 14px',
    borderRadius: '8px',
    display: 'block',
    transition: 'background 0.2s ease',
  },
  mobileLogout: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.7)',
    padding: '10px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'left',
    marginTop: '4px',
  },
};

/* Responsive: hide desktop links on small screens, show hamburger */
const styleTag = document.createElement('style');
styleTag.textContent = `
  @media (max-width: 768px) {
    nav div[style*="desktopLinks"] { display: none !important; }
  }
`;
/* We use a className approach for responsiveness below */
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
  .tz-nav-link:hover { background: rgba(255,255,255,0.08) !important; color: #ffffff !important; }
  .tz-nav-mobile-link:hover { background: rgba(255,255,255,0.08) !important; }
  .tz-search-input:focus { border-color: rgba(0,163,255,0.5) !important; background: rgba(255,255,255,0.12) !important; box-shadow: 0 0 0 3px rgba(0,163,255,0.1) !important; }
`;
if (!document.getElementById('tz-nav-responsive')) {
  responsiveStyle.id = 'tz-nav-responsive';
  document.head.appendChild(responsiveStyle);
}

// Re-export with classNames applied
const NavbarWithResponsive = () => {
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
          <svg width="34" height="34" viewBox="0 0 100 100">
            <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="#00a3ff" stroke="#00a3ff" strokeWidth="4" />
            <polygon points="50,12 83,31 83,69 50,88 17,69 17,31" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <text x="50" y="58" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="900" fontFamily="system-ui, sans-serif">TZ</text>
          </svg>
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
              {isAdmin && <Link to="/admin" style={{ ...s.navLink, color: '#00a3ff' }} className="tz-nav-link"><FiShield size={14} /> Admin</Link>}
              <Link to="/wishlist" style={s.navLink} className="tz-nav-link"><FiHeart size={14} /> Wishlist</Link>
              <Link to="/my-orders" style={s.navLink} className="tz-nav-link"><FiPackage size={14} /> Orders</Link>
              <Link to="/profile" style={s.navLink} className="tz-nav-link"><FiUser size={14} /> {user.name.split(' ')[0]}</Link>
              <button onClick={handleLogout} style={s.logoutBtn} className="tz-nav-link"><FiLogOut size={13} /> Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.navLink} className="tz-nav-link">Login</Link>
              <Link to="/register" style={s.registerBtn}>Register</Link>
            </>
          )}
          <Link to="/cart" style={s.cartBtn} id="nav-cart">
            <FiShoppingCart size={18} />
            {cartCount > 0 && <span style={s.badge}>{cartCount}</span>}
          </Link>
        </div>

        <div className="tz-nav-mobile-right" style={s.mobileRight}>
          <Link to="/cart" style={s.cartBtn}>
            <FiShoppingCart size={18} />
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
          <Link to="/products" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">📱 Products</Link>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">⚡ Admin Panel</Link>}
              <Link to="/wishlist" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">❤️ Wishlist</Link>
              <Link to="/my-orders" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">📦 My Orders</Link>
              <Link to="/profile" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">👤 Profile</Link>
              <button onClick={handleLogout} style={s.mobileLogout}>🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.mobileLink} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">🔐 Login</Link>
              <Link to="/register" style={{ ...s.mobileLink, color: '#00a3ff', fontWeight: '600' }} onClick={() => setMenuOpen(false)} className="tz-nav-mobile-link">✨ Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarWithResponsive;
