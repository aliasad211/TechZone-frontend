import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../utils/api';
import { useCart } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiTruck, FiShield, FiHeadphones, FiLock, FiArrowRight, FiStar, FiChevronRight } from 'react-icons/fi';

const CATEGORIES = [
  { name: 'Mobiles', icon: '📱', gradient: 'linear-gradient(135deg, #0D2B5E, #1a4a8a)' },
  { name: 'Laptops', icon: '💻', gradient: 'linear-gradient(135deg, #15253F, #0D2B5E)' },
  { name: 'TVs', icon: '📺', gradient: 'linear-gradient(135deg, #0D2B5E, #00a3ff)' },
  { name: 'Audio', icon: '🎧', gradient: 'linear-gradient(135deg, #15253F, #1a4a8a)' },
  { name: 'Gaming', icon: '🎮', gradient: 'linear-gradient(135deg, #1a4a8a, #00a3ff)' },
  { name: 'Cameras', icon: '📷', gradient: 'linear-gradient(135deg, #0D2B5E, #15253F)' },
  { name: 'Tablets', icon: '📟', gradient: 'linear-gradient(135deg, #15253F, #0D2B5E)' },
  { name: 'Wearables', icon: '⌚', gradient: 'linear-gradient(135deg, #0D2B5E, #00a3ff)' },
];

const WHY_CHOOSE = [
  { icon: <FiTruck size={28} />, title: 'Free Shipping', desc: 'On orders above Rs. 5,000' },
  { icon: <FiShield size={28} />, title: 'Official Warranty', desc: 'Genuine products guaranteed' },
  { icon: <FiHeadphones size={28} />, title: '24/7 Support', desc: 'Always here to help you' },
  { icon: <FiLock size={28} />, title: 'Secure Payment', desc: 'Your data is protected' },
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

  // Countdown timer state (flash deals)
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 45, seconds: 30 });

  useEffect(() => {
    document.title = 'TechZone — Pakistan\'s Best Electronics Store';
    getFeaturedProducts()
      .then(res => setFeatured(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) { seconds--; }
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        else { hours = 8; minutes = 45; seconds = 30; } // Reset
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
      {/* ===== HERO SECTION ===== */}
      <section style={st.hero}>
        {/* Floating shapes */}
        <div style={st.heroShape1} />
        <div style={st.heroShape2} />
        <div style={st.heroShape3} />
        <div style={st.heroContent}>
          <div style={st.heroBadge}>
            <FiStar size={12} /> Pakistan&apos;s #1 Tech Store
          </div>
          <h1 style={st.heroTitle}>
            Discover the Latest <span style={{ color: '#00a3ff' }}>Technology</span>
          </h1>
          <p style={st.heroSub}>
            Premium gadgets at unbeatable prices with fast delivery across Pakistan.
            Shop smartphones, laptops, gaming gear and more.
          </p>
          <div style={st.heroBtns}>
            <button onClick={() => navigate('/products')} style={st.heroBtn}>
              Shop Now <FiArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/products?category=Mobiles')} style={st.heroBtn2}>
              View Mobiles <FiChevronRight size={16} />
            </button>
          </div>
          <div style={st.heroStats}>
            <div style={st.heroStat}><span style={st.heroStatNum}>10K+</span><span style={st.heroStatLabel}>Products</span></div>
            <div style={st.heroStatDivider} />
            <div style={st.heroStat}><span style={st.heroStatNum}>50K+</span><span style={st.heroStatLabel}>Customers</span></div>
            <div style={st.heroStatDivider} />
            <div style={st.heroStat}><span style={st.heroStatNum}>4.9★</span><span style={st.heroStatLabel}>Rating</span></div>
          </div>
        </div>
      </section>

      <div style={st.container}>
        {/* ===== WHY CHOOSE US ===== */}
        <section style={st.whySection}>
          <div style={st.whyGrid}>
            {WHY_CHOOSE.map((item, i) => (
              <div key={i} style={st.whyCard}>
                <div style={st.whyIcon}>{item.icon}</div>
                <h4 style={st.whyTitle}>{item.title}</h4>
                <p style={st.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CATEGORIES ===== */}
        <section style={st.section}>
          <div style={st.sectionHeader}>
            <div>
              <h2 style={st.sectionTitle}>Shop by Category</h2>
              <p style={st.sectionSub}>Browse our wide range of products</p>
            </div>
          </div>
          <div style={st.catGrid}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} style={st.catCard}>
                <div style={{ ...st.catIconBg, background: cat.gradient }}>
                  <span style={st.catEmoji}>{cat.icon}</span>
                </div>
                <span style={st.catName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== FLASH DEALS ===== */}
        <section style={st.flashBanner}>
          <div style={st.flashLeft}>
            <div style={st.flashBadge}>⚡ Flash Deals</div>
            <h3 style={st.flashTitle}>Today&apos;s Hot Offers</h3>
            <p style={st.flashSub}>Limited time deals — grab them before they&apos;re gone!</p>
          </div>
          <div style={st.flashTimer}>
            <div style={st.timerBox}><span style={st.timerNum}>{pad(timeLeft.hours)}</span><span style={st.timerLabel}>Hours</span></div>
            <span style={st.timerSep}>:</span>
            <div style={st.timerBox}><span style={st.timerNum}>{pad(timeLeft.minutes)}</span><span style={st.timerLabel}>Minutes</span></div>
            <span style={st.timerSep}>:</span>
            <div style={st.timerBox}><span style={st.timerNum}>{pad(timeLeft.seconds)}</span><span style={st.timerLabel}>Seconds</span></div>
          </div>
          <button onClick={() => navigate('/products')} style={st.flashBtn}>
            View Deals <FiArrowRight size={14} />
          </button>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section style={st.section}>
          <div style={st.sectionHeader}>
            <div>
              <h2 style={st.sectionTitle}>Featured Products</h2>
              <p style={st.sectionSub}>Handpicked by our team</p>
            </div>
            <Link to="/products" style={st.viewAllLink}>View All <FiArrowRight size={14} /></Link>
          </div>

          {loading ? (
            <div style={st.loadingGrid}>
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
                <div key={product._id} style={st.productCard}>
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
                      <span style={st.ratingBadge}>⭐ {product.ratings || '0'}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        style={product.stock > 0 ? st.addBtn : st.addBtnDisabled}
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
              <h2 style={st.sectionTitle}>What Our Customers Say</h2>
              <p style={st.sectionSub}>Trusted by thousands across Pakistan</p>
            </div>
          </div>
          <div style={st.testimonialGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={st.testimonialCard}>
                <div style={st.testimonialStars}>
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
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
        <section style={st.shippingBanner}>
          <div>
            <h3 style={st.shipTitle}>🚚 Free Shipping on Orders Above Rs. 5,000</h3>
            <p style={st.shipSub}>Fast and secure delivery all across Pakistan</p>
          </div>
          <button onClick={() => navigate('/products')} style={st.shipBtn}>
            Start Shopping <FiArrowRight size={14} />
          </button>
        </section>

        {/* ===== NEWSLETTER ===== */}
        <section style={st.newsletter}>
          <div style={st.nlContent}>
            <h3 style={st.nlTitle}>Stay Updated with TechZone</h3>
            <p style={st.nlSub}>Get notified about new arrivals, exclusive deals, and tech news.</p>
            <div style={st.nlForm}>
              <input type="email" placeholder="Enter your email address" style={st.nlInput} />
              <button style={st.nlBtn} onClick={() => toast.success('Subscribed successfully!')}>Subscribe</button>
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
    background: 'linear-gradient(135deg, #0D2B5E 0%, #15253F 50%, #0a1e3f 100%)',
    padding: '90px 20px 70px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroShape1: {
    position: 'absolute', top: '10%', left: '8%', width: '120px', height: '120px',
    border: '2px solid rgba(0,163,255,0.12)', borderRadius: '24px',
    transform: 'rotate(45deg)', animation: 'tz-float 6s ease-in-out infinite',
  },
  heroShape2: {
    position: 'absolute', bottom: '15%', right: '10%', width: '80px', height: '80px',
    background: 'rgba(0,163,255,0.06)', borderRadius: '50%',
    animation: 'tz-float 8s ease-in-out infinite 1s',
  },
  heroShape3: {
    position: 'absolute', top: '30%', right: '20%', width: '50px', height: '50px',
    border: '2px solid rgba(0,163,255,0.08)', borderRadius: '12px',
    transform: 'rotate(20deg)', animation: 'tz-float 5s ease-in-out infinite 2s',
  },
  heroContent: {
    maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 1,
    animation: 'tz-slideUp 0.8s ease',
  },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(0,163,255,0.12)', border: '1px solid rgba(0,163,255,0.2)',
    color: '#00a3ff', padding: '6px 16px', borderRadius: '30px',
    fontSize: '12px', fontWeight: '600', marginBottom: '20px', letterSpacing: '0.5px',
  },
  heroTitle: {
    color: '#ffffff', fontSize: '48px', fontWeight: '800',
    margin: '0 0 18px', lineHeight: '1.15',
    fontFamily: "'Outfit', 'Inter', sans-serif",
    letterSpacing: '-0.02em',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.6)', fontSize: '17px',
    margin: '0 0 32px', lineHeight: '1.6', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto',
  },
  heroBtns: {
    display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px',
  },
  heroBtn: {
    background: '#00a3ff', color: '#fff', border: 'none',
    padding: '15px 32px', borderRadius: '12px', fontSize: '15px',
    cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px',
    transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0,163,255,0.3)',
  },
  heroBtn2: {
    background: 'transparent', color: '#00a3ff',
    border: '2px solid rgba(0,163,255,0.4)',
    padding: '14px 32px', borderRadius: '12px', fontSize: '15px',
    cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px',
    transition: 'all 0.3s ease',
  },
  heroStats: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px',
    flexWrap: 'wrap',
  },
  heroStat: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  heroStatNum: {
    color: '#ffffff', fontSize: '22px', fontWeight: '800',
    fontFamily: "'Outfit', sans-serif",
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: '500', marginTop: '2px',
  },
  heroStatDivider: {
    width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)',
  },

  /* Container */
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },

  /* Why Choose */
  whySection: {
    margin: '-40px 0 0', position: 'relative', zIndex: 2,
  },
  whyGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
  },
  whyCard: {
    background: '#ffffff', borderRadius: '16px', padding: '28px 20px',
    textAlign: 'center', boxShadow: '0 8px 30px rgba(13,43,94,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid rgba(13,43,94,0.06)',
  },
  whyIcon: {
    width: '56px', height: '56px', borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(0,163,255,0.08), rgba(13,43,94,0.06))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 14px', color: '#0D2B5E',
  },
  whyTitle: {
    fontSize: '15px', fontWeight: '700', color: '#0D2B5E', margin: '0 0 6px',
    fontFamily: "'Outfit', sans-serif",
  },
  whyDesc: {
    fontSize: '12px', color: '#64748b', margin: 0, lineHeight: '1.5',
  },

  /* Sections */
  section: { margin: '50px 0' },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    marginBottom: '24px', flexWrap: 'wrap', gap: '12px',
  },
  sectionTitle: {
    fontSize: '26px', fontWeight: '800', color: '#0D2B5E', margin: 0,
    fontFamily: "'Outfit', 'Inter', sans-serif", letterSpacing: '-0.02em',
  },
  sectionSub: {
    fontSize: '14px', color: '#64748b', margin: '4px 0 0',
  },
  viewAllLink: {
    color: '#00a3ff', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '4px', transition: 'gap 0.2s ease',
  },

  /* Categories */
  catGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px',
  },
  catCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
    padding: '22px 10px 18px', background: '#ffffff', borderRadius: '16px',
    textDecoration: 'none', boxShadow: '0 2px 12px rgba(13,43,94,0.05)',
    transition: 'all 0.3s ease', border: '1px solid rgba(13,43,94,0.06)',
    cursor: 'pointer',
  },
  catIconBg: {
    width: '52px', height: '52px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform 0.3s ease',
  },
  catEmoji: { fontSize: '24px', filter: 'grayscale(0)' },
  catName: {
    color: '#0D2B5E', fontSize: '12px', fontWeight: '600', textAlign: 'center',
  },

  /* Flash Deals */
  flashBanner: {
    background: 'linear-gradient(135deg, #0D2B5E, #15253F)',
    borderRadius: '20px', padding: '36px 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    margin: '50px 0', flexWrap: 'wrap', gap: '20px',
    border: '1px solid rgba(0,163,255,0.15)',
    boxShadow: '0 0 40px rgba(0,163,255,0.08)',
  },
  flashLeft: {},
  flashBadge: {
    display: 'inline-block', background: 'rgba(0,163,255,0.15)',
    color: '#00a3ff', padding: '4px 14px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '700', marginBottom: '10px',
  },
  flashTitle: {
    color: '#ffffff', fontSize: '22px', fontWeight: '800', margin: '0 0 6px',
    fontFamily: "'Outfit', sans-serif",
  },
  flashSub: {
    color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0,
  },
  flashTimer: {
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  timerBox: {
    background: 'rgba(0,163,255,0.12)', borderRadius: '12px',
    padding: '12px 16px', textAlign: 'center', minWidth: '70px',
    border: '1px solid rgba(0,163,255,0.2)',
  },
  timerNum: {
    display: 'block', color: '#00a3ff', fontSize: '24px', fontWeight: '800',
    fontFamily: "'Outfit', monospace", animation: 'tz-countPulse 1s ease infinite',
  },
  timerLabel: {
    color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '1px',
  },
  timerSep: {
    color: '#00a3ff', fontSize: '24px', fontWeight: '800',
  },
  flashBtn: {
    background: '#00a3ff', color: '#ffffff', border: 'none',
    padding: '12px 28px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: '6px', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(0,163,255,0.3)',
  },

  /* Products */
  productGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px',
  },
  productCard: {
    background: '#ffffff', borderRadius: '16px', overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(13,43,94,0.05)',
    border: '1px solid rgba(13,43,94,0.06)',
    transition: 'all 0.3s ease', position: 'relative',
  },
  discountTag: {
    position: 'absolute', top: '12px', left: '12px', zIndex: 2,
    background: '#ef4444', color: '#fff', padding: '4px 10px',
    borderRadius: '8px', fontSize: '12px', fontWeight: '700',
  },
  productImgWrap: {
    background: '#f8fafc', padding: '12px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  productImg: {
    width: '100%', height: '180px', objectFit: 'contain',
  },
  productInfo: { padding: '16px' },
  productBrand: {
    color: '#64748b', fontSize: '11px', margin: '0 0 4px',
    textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px',
  },
  productName: {
    color: '#0D2B5E', fontSize: '14px', fontWeight: '600',
    textDecoration: 'none', display: 'block', marginBottom: '8px',
    lineHeight: '1.4',
  },
  priceRow: {
    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px',
  },
  productPrice: {
    color: '#0D2B5E', fontSize: '17px', fontWeight: '800',
    fontFamily: "'Outfit', sans-serif",
  },
  originalPrice: {
    color: '#94a3b8', fontSize: '12px', textDecoration: 'line-through',
  },
  cardFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  ratingBadge: {
    background: 'rgba(251,191,36,0.1)', color: '#92400e',
    padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
  },
  addBtn: {
    background: '#0D2B5E', color: '#fff', border: 'none',
    padding: '7px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center',
    gap: '5px', transition: 'all 0.2s ease',
  },
  addBtnDisabled: {
    background: '#e2e8f0', color: '#94a3b8', border: 'none',
    padding: '7px 16px', borderRadius: '8px', cursor: 'not-allowed',
    fontSize: '12px',
  },

  /* Loading Skeleton */
  loadingGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px',
  },
  skeleton: {
    background: '#ffffff', borderRadius: '16px', overflow: 'hidden',
    border: '1px solid rgba(13,43,94,0.06)',
  },
  skeletonImg: {
    height: '200px', background: 'linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%)',
    backgroundSize: '200% 100%', animation: 'tz-shimmer 1.5s infinite',
  },
  skeletonBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' },
  skeletonLine: {
    height: '12px', borderRadius: '6px',
    background: 'linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%)',
    backgroundSize: '200% 100%', animation: 'tz-shimmer 1.5s infinite',
  },

  /* Testimonials */
  testimonialGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px',
  },
  testimonialCard: {
    background: '#ffffff', borderRadius: '16px', padding: '28px',
    boxShadow: '0 2px 12px rgba(13,43,94,0.05)',
    border: '1px solid rgba(13,43,94,0.06)', transition: 'all 0.3s ease',
  },
  testimonialStars: {
    color: '#fbbf24', fontSize: '16px', marginBottom: '14px', letterSpacing: '2px',
  },
  testimonialText: {
    color: '#475569', fontSize: '14px', lineHeight: '1.7', margin: '0 0 18px',
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  testimonialAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #0D2B5E, #00a3ff)',
    color: '#fff', fontSize: '16px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  testimonialName: {
    fontSize: '14px', fontWeight: '600', color: '#0D2B5E', margin: 0,
  },
  testimonialCity: {
    fontSize: '12px', color: '#64748b', margin: '2px 0 0',
  },

  /* Brands */
  brandSection: {
    textAlign: 'center', margin: '50px 0', padding: '30px 0',
    borderTop: '1px solid rgba(13,43,94,0.06)',
    borderBottom: '1px solid rgba(13,43,94,0.06)',
  },
  brandLabel: {
    color: '#94a3b8', fontSize: '12px', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 18px',
  },
  brandGrid: {
    display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap',
  },
  brandItem: {
    color: '#0D2B5E', fontSize: '16px', fontWeight: '700', opacity: 0.35,
    fontFamily: "'Outfit', sans-serif", letterSpacing: '1px',
    transition: 'opacity 0.2s ease', cursor: 'default',
  },

  /* Shipping Banner */
  shippingBanner: {
    background: 'linear-gradient(135deg, #0D2B5E, #00a3ff)',
    borderRadius: '20px', padding: '36px 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    margin: '50px 0', flexWrap: 'wrap', gap: '20px',
    color: '#ffffff',
  },
  shipTitle: {
    fontSize: '22px', fontWeight: '800', margin: '0 0 6px',
    fontFamily: "'Outfit', sans-serif",
  },
  shipSub: {
    margin: 0, opacity: 0.7, fontSize: '14px',
  },
  shipBtn: {
    background: '#ffffff', color: '#0D2B5E', border: 'none',
    padding: '12px 28px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: '6px', transition: 'all 0.3s ease',
  },

  /* Newsletter */
  newsletter: {
    background: '#ffffff', borderRadius: '20px', padding: '50px 40px',
    textAlign: 'center', margin: '0 0 50px',
    boxShadow: '0 4px 24px rgba(13,43,94,0.06)',
    border: '1px solid rgba(13,43,94,0.06)',
  },
  nlContent: { maxWidth: '480px', margin: '0 auto' },
  nlTitle: {
    fontSize: '24px', fontWeight: '800', color: '#0D2B5E', margin: '0 0 8px',
    fontFamily: "'Outfit', sans-serif",
  },
  nlSub: {
    color: '#64748b', fontSize: '14px', margin: '0 0 24px', lineHeight: '1.6',
  },
  nlForm: {
    display: 'flex', gap: '10px', maxWidth: '420px', margin: '0 auto',
  },
  nlInput: {
    flex: 1, padding: '12px 16px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  nlBtn: {
    background: '#0D2B5E', color: '#fff', border: 'none',
    padding: '12px 24px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
};

// Responsive overrides
const homeStyle = document.createElement('style');
homeStyle.textContent = `
  @media (max-width: 900px) {
    .tz-why-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 768px) {
    .tz-hero-title { font-size: 32px !important; }
    .tz-cat-grid { grid-template-columns: repeat(4, 1fr) !important; }
    .tz-testimonial-grid { grid-template-columns: 1fr !important; }
    .tz-flash-banner { flex-direction: column; text-align: center; }
    .tz-nl-form { flex-direction: column !important; }
  }
  @media (max-width: 480px) {
    .tz-why-grid { grid-template-columns: 1fr 1fr !important; }
    .tz-cat-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
`;
if (!document.getElementById('tz-home-responsive')) {
  homeStyle.id = 'tz-home-responsive';
  document.head.appendChild(homeStyle);
}

export default HomePage;
