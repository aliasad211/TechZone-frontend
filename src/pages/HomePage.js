import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../utils/api';
import { useCart } from '../context/AppContext';
import toast from 'react-hot-toast';
import {
  FiShoppingCart, FiTruck, FiShield, FiHeadphones, FiLock, FiArrowRight, FiStar,
  FiSmartphone, FiMonitor, FiTv, FiCamera, FiTablet, FiWatch, FiZap,
} from 'react-icons/fi';

const CATEGORIES = [
  { name: 'Mobiles', icon: <FiSmartphone size={22} /> },
  { name: 'Laptops', icon: <FiMonitor size={22} /> },
  { name: 'TVs', icon: <FiTv size={22} /> },
  { name: 'Audio', icon: <FiHeadphones size={22} /> },
  { name: 'Gaming', icon: <FiZap size={22} /> },
  { name: 'Cameras', icon: <FiCamera size={22} /> },
  { name: 'Tablets', icon: <FiTablet size={22} /> },
  { name: 'Wearables', icon: <FiWatch size={22} /> },
];

const WHY_CHOOSE = [
  { icon: <FiTruck size={22} />, title: 'Free Shipping', desc: 'On orders above Rs. 5,000' },
  { icon: <FiShield size={22} />, title: 'Official Warranty', desc: 'Genuine products guaranteed' },
  { icon: <FiHeadphones size={22} />, title: '24/7 Support', desc: 'Always here to help you' },
  { icon: <FiLock size={22} />, title: 'Secure Payment', desc: 'Your data is protected' },
];

const TESTIMONIALS = [
  { name: 'Ahmed Khan', city: 'Islamabad', rating: 5, text: 'Best electronics store in Pakistan! Got my iPhone delivered in just 2 days. Amazing service and genuine products.' },
  { name: 'Fatima Ali', city: 'Lahore', rating: 5, text: 'TechZone has the best prices. I compared everywhere and they were the cheapest. Plus the warranty gave me peace of mind.' },
  { name: 'Hassan Raza', city: 'Karachi', rating: 4, text: 'Ordered a gaming laptop and it arrived perfectly packed. Customer support was very helpful throughout the process.' },
];

const BRANDS = ['Samsung', 'Apple', 'Sony', 'HP', 'Dell', 'Xiaomi', 'OnePlus', 'JBL', 'Canon', 'Lenovo'];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 45, seconds: 30 });

  useEffect(() => {
    document.title = 'TechZone — Pakistan\'s Best Electronics Store';
    getFeaturedProducts()
      .then(res => setFeatured(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) { seconds--; }
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        else { hours = 8; minutes = 45; seconds = 30; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div>
      {/* ===== HERO ===== */}
      <section style={st.hero}>
        <div style={st.heroInner}>
          <div style={st.heroBadge}>
            <FiStar size={12} /> Pakistan&apos;s #1 Tech Store
          </div>
          <h1 style={st.heroTitle} className="tz-hero-title">
            Discover the latest<br />in <span style={st.heroAccent}>technology</span>.
          </h1>
          <p style={st.heroSub}>
            Premium gadgets at unbeatable prices with fast delivery across Pakistan —
            smartphones, laptops, gaming gear and more.
          </p>
          <div style={st.heroBtns}>
            <button onClick={() => navigate('/products')} style={st.heroBtn} className="tz-btn-ink">
              Shop Now <FiArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/products?category=Mobiles')} style={st.heroBtn2} className="tz-btn-outline">
              Browse Mobiles
            </button>
          </div>
          <div style={st.heroStats}>
            <div style={st.heroStat}><span style={st.heroStatNum}>10K+</span><span style={st.heroStatLabel}>Products</span></div>
            <div style={st.heroStatDivider} />
            <div style={st.heroStat}><span style={st.heroStatNum}>50K+</span><span style={st.heroStatLabel}>Customers</span></div>
            <div style={st.heroStatDivider} />
            <div style={st.heroStat}><span style={st.heroStatNum}>4.9</span><span style={st.heroStatLabel}>Avg. Rating</span></div>
          </div>
        </div>
      </section>

      <div style={st.container}>
        {/* ===== WHY CHOOSE ===== */}
        <section style={st.whySection}>
          <div style={st.whyGrid} className="tz-why-grid">
            {WHY_CHOOSE.map((item, i) => (
              <div key={i} style={st.whyCard}>
                <div style={st.whyIcon}>{item.icon}</div>
                <div>
                  <h4 style={st.whyTitle}>{item.title}</h4>
                  <p style={st.whyDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CATEGORIES ===== */}
        <section style={st.section}>
          <div style={st.sectionHeader}>
            <div>
              <h2 style={st.sectionTitle}>Shop by category</h2>
              <p style={st.sectionSub}>Browse our full range of products</p>
            </div>
          </div>
          <div style={st.catGrid} className="tz-cat-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} style={st.catCard} className="tz-cat-card">
                <div style={st.catIconBg}>{cat.icon}</div>
                <span style={st.catName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== FLASH DEALS ===== */}
        <section style={st.flashBanner} className="tz-flash-banner">
          <div>
            <div style={st.flashBadge}><FiZap size={12} /> Flash Deals</div>
            <h3 style={st.flashTitle}>Today&apos;s hot offers</h3>
            <p style={st.flashSub}>Limited time deals — grab them before they&apos;re gone.</p>
          </div>
          <div style={st.flashTimer}>
            <div style={st.timerBox}><span style={st.timerNum}>{pad(timeLeft.hours)}</span><span style={st.timerLabel}>Hrs</span></div>
            <span style={st.timerSep}>:</span>
            <div style={st.timerBox}><span style={st.timerNum}>{pad(timeLeft.minutes)}</span><span style={st.timerLabel}>Min</span></div>
            <span style={st.timerSep}>:</span>
            <div style={st.timerBox}><span style={st.timerNum}>{pad(timeLeft.seconds)}</span><span style={st.timerLabel}>Sec</span></div>
          </div>
          <button onClick={() => navigate('/products')} style={st.flashBtn} className="tz-btn-accent">
            View Deals <FiArrowRight size={14} />
          </button>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section style={st.section}>
          <div style={st.sectionHeader}>
            <div>
              <h2 style={st.sectionTitle}>Featured products</h2>
              <p style={st.sectionSub}>Handpicked by our team</p>
            </div>
            <Link to="/products" style={st.viewAllLink} className="tz-view-all">View all <FiArrowRight size={14} /></Link>
          </div>

          {loading ? (
            <div style={st.productGrid}>
              {[1,2,3,4].map(i => (
                <div key={i} style={st.skeleton}>
                  <div style={st.skeletonImg} />
                  <div style={st.skeletonBody}>
                    <div style={{ ...st.skeletonLine, width: '40%' }} />
                    <div style={{ ...st.skeletonLine, width: '80%' }} />
                    <div style={{ ...st.skeletonLine, width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={st.productGrid}>
              {featured.map(product => (
                <div key={product._id} style={st.productCard} className="tz-product-card">
                  {product.originalPrice && (
                    <div style={st.discountTag}>
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  <Link to={`/product/${product._id}`}>
                    <div style={st.productImgWrap}>
                      <img
                        src={product.images[0]?.url || 'https://via.placeholder.com/200x180?text=No+Image'}
                        alt={product.name}
                        style={st.productImg}
                      />
                    </div>
                  </Link>
                  <div style={st.productInfo}>
                    <p style={st.productBrand}>{product.brand}</p>
                    <Link to={`/product/${product._id}`} style={st.productName}>{product.name}</Link>
                    <div style={st.priceRow}>
                      <span style={st.productPrice}>Rs. {product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span style={st.originalPrice}>Rs. {product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <div style={st.cardFooter}>
                      <span style={st.ratingBadge}><FiStar size={11} fill="currentColor" /> {product.ratings || '0'}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        style={product.stock > 0 ? st.addBtn : st.addBtnDisabled}
                        className={product.stock > 0 ? 'tz-add-btn' : ''}
                      >
                        {product.stock > 0 ? <><FiShoppingCart size={13} /> Add</> : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section style={st.section}>
          <div style={st.sectionHeader}>
            <div>
              <h2 style={st.sectionTitle}>What our customers say</h2>
              <p style={st.sectionSub}>Trusted by thousands across Pakistan</p>
            </div>
          </div>
          <div style={st.testimonialGrid} className="tz-testimonial-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={st.testimonialCard}>
                <div style={st.testimonialStars}>
                  {Array.from({ length: t.rating }).map((_, k) => <FiStar key={k} size={15} fill="currentColor" />)}
                </div>
                <p style={st.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <div style={st.testimonialAuthor}>
                  <div style={st.testimonialAvatar}>{t.name.charAt(0)}</div>
                  <div>
                    <p style={st.testimonialName}>{t.name}</p>
                    <p style={st.testimonialCity}>{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== BRANDS ===== */}
        <section style={st.brandSection}>
          <p style={st.brandLabel}>Trusted Brands</p>
          <div style={st.brandGrid}>
            {BRANDS.map(b => (
              <div key={b} style={st.brandItem}>{b}</div>
            ))}
          </div>
        </section>

        {/* ===== SHIPPING BANNER ===== */}
        <section style={st.shippingBanner} className="tz-flash-banner">
          <div>
            <h3 style={st.shipTitle}>Free shipping on orders above Rs. 5,000</h3>
            <p style={st.shipSub}>Fast and secure delivery all across Pakistan.</p>
          </div>
          <button onClick={() => navigate('/products')} style={st.shipBtn}>
            Start Shopping <FiArrowRight size={14} />
          </button>
        </section>

        {/* ===== NEWSLETTER ===== */}
        <section style={st.newsletter}>
          <div style={st.nlContent}>
            <h3 style={st.nlTitle}>Stay updated with TechZone</h3>
            <p style={st.nlSub}>Get notified about new arrivals, exclusive deals, and tech news.</p>
            <div style={st.nlForm} className="tz-nl-form">
              <input type="email" placeholder="Enter your email address" style={st.nlInput} className="tz-nl-input" />
              <button style={st.nlBtn} className="tz-btn-ink" onClick={() => toast.success('Subscribed successfully!')}>Subscribe</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ===== STYLES ===== */
const st = {
  /* Hero */
  hero: {
    background: 'var(--tz-canvas)',
    borderBottom: '1px solid var(--tz-border)',
    padding: '96px 24px 88px',
    textAlign: 'center',
  },
  heroInner: {
    maxWidth: '780px', margin: '0 auto',
    animation: 'tz-slideUp 0.7s ease',
  },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'var(--tz-paper)', border: '1px solid var(--tz-border)',
    color: 'var(--tz-text-body)', padding: '7px 16px', borderRadius: '30px',
    fontSize: '12px', fontWeight: '600', marginBottom: '28px', letterSpacing: '0.3px',
  },
  heroTitle: {
    color: 'var(--tz-ink)', fontSize: '60px', fontWeight: '700',
    margin: '0 0 22px', lineHeight: '1.05',
    fontFamily: "'Outfit', 'Inter', sans-serif",
    letterSpacing: '-0.04em',
  },
  heroAccent: { color: 'var(--tz-accent)' },
  heroSub: {
    color: 'var(--tz-text-secondary)', fontSize: '18px',
    margin: '0 auto 36px', lineHeight: '1.6', maxWidth: '540px',
  },
  heroBtns: {
    display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '52px',
  },
  heroBtn: {
    background: 'var(--tz-ink)', color: '#fff', border: '1px solid var(--tz-ink)',
    padding: '15px 30px', borderRadius: '12px', fontSize: '15px',
    cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
    transition: 'all 0.25s ease',
  },
  heroBtn2: {
    background: 'var(--tz-paper)', color: 'var(--tz-ink)',
    border: '1px solid var(--tz-border)',
    padding: '15px 30px', borderRadius: '12px', fontSize: '15px',
    cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px',
    transition: 'all 0.25s ease',
  },
  heroStats: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px',
    flexWrap: 'wrap',
  },
  heroStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  heroStatNum: {
    color: 'var(--tz-ink)', fontSize: '24px', fontWeight: '700',
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em',
  },
  heroStatLabel: {
    color: 'var(--tz-text-muted)', fontSize: '12px', fontWeight: '500', marginTop: '4px',
  },
  heroStatDivider: { width: '1px', height: '34px', background: 'var(--tz-border)' },

  /* Container */
  container: { maxWidth: '1240px', margin: '0 auto', padding: '0 24px' },

  /* Why Choose */
  whySection: { margin: '56px 0 0' },
  whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  whyCard: {
    background: 'var(--tz-paper)', borderRadius: '14px', padding: '22px',
    display: 'flex', alignItems: 'center', gap: '14px',
    border: '1px solid var(--tz-border)',
  },
  whyIcon: {
    width: '46px', height: '46px', borderRadius: '11px',
    background: 'var(--tz-canvas)', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--tz-ink)',
  },
  whyTitle: {
    fontSize: '14.5px', fontWeight: '600', color: 'var(--tz-ink)', margin: '0 0 3px',
    fontFamily: "'Outfit', sans-serif",
  },
  whyDesc: { fontSize: '12.5px', color: 'var(--tz-text-secondary)', margin: 0, lineHeight: '1.4' },

  /* Sections */
  section: { margin: '72px 0' },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    marginBottom: '28px', flexWrap: 'wrap', gap: '12px',
  },
  sectionTitle: {
    fontSize: '30px', fontWeight: '700', color: 'var(--tz-ink)', margin: 0,
    fontFamily: "'Outfit', 'Inter', sans-serif", letterSpacing: '-0.03em',
  },
  sectionSub: { fontSize: '14.5px', color: 'var(--tz-text-secondary)', margin: '6px 0 0' },
  viewAllLink: {
    color: 'var(--tz-ink)', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '6px', transition: 'gap 0.2s ease',
  },

  /* Categories */
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px' },
  catCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
    padding: '24px 10px', background: 'var(--tz-paper)', borderRadius: '14px',
    textDecoration: 'none', border: '1px solid var(--tz-border)',
    transition: 'all 0.25s ease', cursor: 'pointer',
  },
  catIconBg: {
    width: '50px', height: '50px', borderRadius: '13px',
    background: 'var(--tz-canvas)', color: 'var(--tz-ink)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.25s ease',
  },
  catName: { color: 'var(--tz-ink)', fontSize: '12.5px', fontWeight: '600', textAlign: 'center' },

  /* Flash Deals */
  flashBanner: {
    background: 'var(--tz-ink)',
    borderRadius: '20px', padding: '38px 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    margin: '72px 0', flexWrap: 'wrap', gap: '22px',
  },
  flashBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
    color: 'var(--tz-accent-light)', padding: '5px 13px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '600', marginBottom: '12px',
  },
  flashTitle: {
    color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: '0 0 6px',
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em',
  },
  flashSub: { color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 },
  flashTimer: { display: 'flex', alignItems: 'center', gap: '8px' },
  timerBox: {
    background: 'rgba(255,255,255,0.06)', borderRadius: '12px',
    padding: '12px 14px', textAlign: 'center', minWidth: '64px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  timerNum: {
    display: 'block', color: '#ffffff', fontSize: '24px', fontWeight: '700',
    fontFamily: "'Outfit', monospace",
  },
  timerLabel: {
    color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '1px',
  },
  timerSep: { color: 'rgba(255,255,255,0.3)', fontSize: '22px', fontWeight: '700' },
  flashBtn: {
    background: 'var(--tz-accent)', color: '#ffffff', border: 'none',
    padding: '13px 26px', borderRadius: '11px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: '6px', transition: 'all 0.25s ease',
  },

  /* Products */
  productGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px',
  },
  productCard: {
    background: 'var(--tz-paper)', borderRadius: '14px', overflow: 'hidden',
    border: '1px solid var(--tz-border)',
    transition: 'all 0.25s ease', position: 'relative',
  },
  discountTag: {
    position: 'absolute', top: '12px', left: '12px', zIndex: 2,
    background: 'var(--tz-ink)', color: '#fff', padding: '4px 10px',
    borderRadius: '7px', fontSize: '11.5px', fontWeight: '700',
  },
  productImgWrap: {
    background: 'var(--tz-canvas)', padding: '20px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  productImg: { width: '100%', height: '180px', objectFit: 'contain' },
  productInfo: { padding: '18px' },
  productBrand: {
    color: 'var(--tz-text-muted)', fontSize: '11px', margin: '0 0 5px',
    textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.6px',
  },
  productName: {
    color: 'var(--tz-ink)', fontSize: '14px', fontWeight: '600',
    textDecoration: 'none', display: 'block', marginBottom: '10px',
    lineHeight: '1.4',
  },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' },
  productPrice: {
    color: 'var(--tz-ink)', fontSize: '18px', fontWeight: '700',
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em',
  },
  originalPrice: { color: 'var(--tz-text-muted)', fontSize: '12px', textDecoration: 'line-through' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  ratingBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    background: 'var(--tz-canvas)', color: 'var(--tz-text-body)',
    padding: '4px 9px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
  },
  addBtn: {
    background: 'var(--tz-ink)', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '12.5px', fontWeight: '600', display: 'flex', alignItems: 'center',
    gap: '5px', transition: 'all 0.2s ease',
  },
  addBtnDisabled: {
    background: 'var(--tz-canvas-2)', color: 'var(--tz-text-muted)', border: 'none',
    padding: '8px 16px', borderRadius: '8px', cursor: 'not-allowed',
    fontSize: '12.5px', fontWeight: 600,
  },

  /* Loading Skeleton */
  skeleton: {
    background: 'var(--tz-paper)', borderRadius: '14px', overflow: 'hidden',
    border: '1px solid var(--tz-border)',
  },
  skeletonImg: {
    height: '200px', background: 'linear-gradient(90deg, #f2f2ee 25%, #e7e7e1 50%, #f2f2ee 75%)',
    backgroundSize: '200% 100%', animation: 'tz-shimmer 1.5s infinite',
  },
  skeletonBody: { padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' },
  skeletonLine: {
    height: '12px', borderRadius: '6px',
    background: 'linear-gradient(90deg, #f2f2ee 25%, #e7e7e1 50%, #f2f2ee 75%)',
    backgroundSize: '200% 100%', animation: 'tz-shimmer 1.5s infinite',
  },

  /* Testimonials */
  testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  testimonialCard: {
    background: 'var(--tz-paper)', borderRadius: '16px', padding: '30px',
    border: '1px solid var(--tz-border)',
  },
  testimonialStars: {
    color: 'var(--tz-accent)', display: 'flex', gap: '3px', marginBottom: '16px',
  },
  testimonialText: {
    color: 'var(--tz-text-body)', fontSize: '14.5px', lineHeight: '1.7', margin: '0 0 20px',
  },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: '12px' },
  testimonialAvatar: {
    width: '42px', height: '42px', borderRadius: '50%',
    background: 'var(--tz-ink)', color: '#fff', fontSize: '16px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    fontFamily: "'Outfit', sans-serif",
  },
  testimonialName: { fontSize: '14px', fontWeight: '600', color: 'var(--tz-ink)', margin: 0 },
  testimonialCity: { fontSize: '12.5px', color: 'var(--tz-text-secondary)', margin: '2px 0 0' },

  /* Brands */
  brandSection: {
    textAlign: 'center', margin: '72px 0', padding: '36px 0',
    borderTop: '1px solid var(--tz-border)',
    borderBottom: '1px solid var(--tz-border)',
  },
  brandLabel: {
    color: 'var(--tz-text-muted)', fontSize: '11.5px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 22px',
  },
  brandGrid: { display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' },
  brandItem: {
    color: 'var(--tz-ink)', fontSize: '17px', fontWeight: '700', opacity: 0.4,
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em',
  },

  /* Shipping Banner */
  shippingBanner: {
    background: 'var(--tz-accent)',
    borderRadius: '20px', padding: '38px 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    margin: '72px 0', flexWrap: 'wrap', gap: '20px', color: '#ffffff',
  },
  shipTitle: {
    fontSize: '23px', fontWeight: '700', margin: '0 0 6px',
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em',
  },
  shipSub: { margin: 0, opacity: 0.85, fontSize: '14.5px' },
  shipBtn: {
    background: '#ffffff', color: 'var(--tz-accent)', border: 'none',
    padding: '13px 26px', borderRadius: '11px', fontSize: '14px',
    fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: '6px', transition: 'all 0.25s ease',
  },

  /* Newsletter */
  newsletter: {
    background: 'var(--tz-paper)', borderRadius: '20px', padding: '56px 40px',
    textAlign: 'center', margin: '0 0 72px',
    border: '1px solid var(--tz-border)',
  },
  nlContent: { maxWidth: '480px', margin: '0 auto' },
  nlTitle: {
    fontSize: '26px', fontWeight: '700', color: 'var(--tz-ink)', margin: '0 0 10px',
    fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em',
  },
  nlSub: { color: 'var(--tz-text-secondary)', fontSize: '14.5px', margin: '0 0 26px', lineHeight: '1.6' },
  nlForm: { display: 'flex', gap: '10px', maxWidth: '440px', margin: '0 auto' },
  nlInput: {
    flex: 1, padding: '13px 16px', border: '1px solid var(--tz-border)',
    borderRadius: '11px', fontSize: '14px', outline: 'none', background: 'var(--tz-canvas)',
    transition: 'border-color 0.2s ease',
  },
  nlBtn: {
    background: 'var(--tz-ink)', color: '#fff', border: '1px solid var(--tz-ink)',
    padding: '13px 26px', borderRadius: '11px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
};

/* Responsive + hover overrides */
const homeStyle = document.createElement('style');
homeStyle.textContent = `
  .tz-btn-ink:hover { background: var(--tz-ink-soft) !important; }
  .tz-btn-outline:hover { border-color: var(--tz-ink) !important; }
  .tz-btn-accent:hover { background: var(--tz-accent-hover) !important; }
  .tz-cat-card:hover { border-color: var(--tz-ink) !important; transform: translateY(-3px); }
  .tz-cat-card:hover > div { background: var(--tz-accent) !important; color: #fff !important; }
  .tz-product-card:hover { border-color: var(--tz-ink) !important; box-shadow: var(--tz-shadow-md) !important; }
  .tz-add-btn:hover { background: var(--tz-accent) !important; }
  .tz-view-all:hover { gap: 10px !important; color: var(--tz-accent) !important; }
  .tz-nl-input:focus { border-color: var(--tz-accent) !important; background: #fff !important; }
  @media (max-width: 900px) {
    .tz-why-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 768px) {
    .tz-hero-title { font-size: 38px !important; }
    .tz-cat-grid { grid-template-columns: repeat(4, 1fr) !important; }
    .tz-testimonial-grid { grid-template-columns: 1fr !important; }
    .tz-flash-banner { flex-direction: column; text-align: center; align-items: flex-start; }
    .tz-nl-form { flex-direction: column !important; }
  }
  @media (max-width: 480px) {
    .tz-why-grid { grid-template-columns: 1fr !important; }
    .tz-cat-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .tz-hero-title { font-size: 32px !important; }
  }
`;
if (!document.getElementById('tz-home-responsive')) {
  homeStyle.id = 'tz-home-responsive';
  document.head.appendChild(homeStyle);
}

export default HomePage;
