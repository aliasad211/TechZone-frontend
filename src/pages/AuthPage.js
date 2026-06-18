import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login as loginAPI, register as registerAPI } from '../utils/api';
import { useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './AuthPage.css';

const TechZoneLogo = ({ light = false }) => {
  const brandDark = '#0D2B5E';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', textDecoration: 'none' }}>
      {/* Hexagon icon */}
      <svg width="45" height="45" viewBox="0 0 100 100" style={{ filter: `drop-shadow(0px 2px 4px ${light ? 'rgba(255,255,255,0.1)' : 'rgba(13,43,94,0.15)'})` }}>
        {/* Outer Hexagon border & background */}
        <polygon 
          points="50,5 90,28 90,72 50,95 10,72 10,28" 
          fill={light ? '#ffffff' : brandDark} 
          stroke={light ? '#ffffff' : brandDark} 
          strokeWidth="4" 
        />
        {/* Inner border style */}
        <polygon 
          points="50,12 83,31 83,69 50,88 17,69 17,31" 
          fill="none" 
          stroke={light ? 'rgba(13, 43, 94, 0.2)' : 'rgba(255, 255, 255, 0.3)'} 
          strokeWidth="2" 
        />
        {/* Six small circles/dots at the corners */}
        <circle cx="50" cy="18" r="3" fill={light ? brandDark : '#ffffff'} />
        <circle cx="78" cy="34" r="3" fill={light ? brandDark : '#ffffff'} />
        <circle cx="78" cy="66" r="3" fill={light ? brandDark : '#ffffff'} />
        <circle cx="50" cy="82" r="3" fill={light ? brandDark : '#ffffff'} />
        <circle cx="22" cy="66" r="3" fill={light ? brandDark : '#ffffff'} />
        <circle cx="22" cy="34" r="3" fill={light ? brandDark : '#ffffff'} />
        {/* Centered TZ text */}
        <text 
          x="50" 
          y="58" 
          textAnchor="middle" 
          fill={light ? brandDark : '#ffffff'} 
          fontSize="28" 
          fontWeight="900" 
          fontFamily="system-ui, sans-serif"
        >
          TZ
        </text>
      </svg>

      {/* Text block */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', lineHeight: '1' }}>
          <span style={{ 
            fontSize: '28px', 
            fontWeight: '800', 
            color: light ? '#ffffff' : brandDark,
            fontFamily: "'Outfit', 'Inter', sans-serif"
          }}>
            Tech
          </span>
          <span style={{ 
            fontSize: '28px', 
            fontWeight: '800', 
            color: light ? '#ffffff' : '#00a3ff',
            fontFamily: "'Outfit', 'Inter', sans-serif"
          }}>
            Zone
          </span>
          <span style={{ 
            fontSize: '10px', 
            fontWeight: 'bold', 
            color: light ? '#ffffff' : brandDark, 
            alignSelf: 'flex-start', 
            marginLeft: '2px',
            marginTop: '2px'
          }}>
            ®
          </span>
        </div>
        
        {/* Tagline "PAKISTAN'S TECH STORE" */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px', 
          width: '100%',
          marginTop: '3px'
        }}>
          <span style={{ height: '1px', flex: 1, backgroundColor: light ? 'rgba(255, 255, 255, 0.4)' : 'rgba(13, 43, 94, 0.3)' }}></span>
          <span style={{ 
            fontSize: '8px', 
            fontWeight: '700', 
            letterSpacing: '1.5px', 
            color: light ? 'rgba(255, 255, 255, 0.7)' : '#64748b',
            whiteSpace: 'nowrap'
          }}>
            PAKISTAN'S TECH STORE
          </span>
          <span style={{ height: '1px', flex: 1, backgroundColor: light ? 'rgba(255, 255, 255, 0.4)' : 'rgba(13, 43, 94, 0.3)' }}></span>
        </div>
      </div>
    </div>
  );
};

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const isLogin = location.pathname === '/login';

  // Forms state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  // Focus & Toggle States
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Set document title dynamically for SEO
  useEffect(() => {
    document.title = isLogin ? 'Login | TechZone' : 'Register | TechZone';
  }, [isLogin]);

  // Clear forms and toggles on mode transition
  useEffect(() => {
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', password: '', confirm: '' });
    setShowForgotPassword(false);
    setForgotEmail('');
    setShowLoginPassword(false);
    setShowRegisterPassword(false);
    setShowRegisterConfirm(false);
    setAgreePolicy(false);
  }, [isLogin]);

  // Email format validator
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Strict validations
    if (!validateEmail(loginForm.email)) {
      toast.error('Please enter a valid email address!');
      return;
    }
    if (loginForm.password.length < 8) {
      toast.error('Password must be at least 8 characters long!');
      return;
    }

    setLoading(true);
    try {
      const { data } = await loginAPI(loginForm);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Strict validations
    if (!registerForm.name.trim()) {
      toast.error('Please enter your name!');
      return;
    }
    if (!validateEmail(registerForm.email)) {
      toast.error('Please enter a valid email address!');
      return;
    }
    if (registerForm.password.length < 8) {
      toast.error('Password must be at least 8 characters long!');
      return;
    }
    if (registerForm.password !== registerForm.confirm) {
      toast.error('Passwords do not match!');
      return;
    }
    if (!agreePolicy) {
      toast.error('You must agree to the Privacy Policy & Terms!');
      return;
    }

    setLoading(true);
    try {
      await registerAPI({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password
      });
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(forgotEmail)) {
      toast.error('Please enter a valid email address!');
      return;
    }
    setLoading(true);
    // Simulate reset link email sending
    setTimeout(() => {
      toast.success(`Password reset link sent to ${forgotEmail}!`);
      setLoading(false);
      setShowForgotPassword(false);
      setForgotEmail('');
    }, 1000);
  };

  return (
    <main className="auth-page-wrapper">
      <div className={`auth-card-container ${isLogin ? 'login-mode' : 'register-mode'}`}>
        
        {/* Sign In Form Container */}
        <div className="auth-form-container auth-sign-in-container">
          {showForgotPassword ? (
            <form className="auth-form" onSubmit={handleForgotPasswordSubmit} id="forgot-form">
              <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
                <TechZoneLogo />
              </div>
              <h1 className="auth-title">Reset Password</h1>
              <p className="auth-form-text" style={{ marginBottom: '25px' }}>
                Enter your email address to receive a password reset link
              </p>
              
              <div className="auth-input-group">
                <input 
                  id="forgot-email"
                  className="auth-input" 
                  type="email" 
                  placeholder="Email" 
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required 
                />
              </div>
              
              <button className="auth-submit-btn" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'SEND RESET LINK'}
              </button>
              
              <button 
                type="button" 
                className="auth-back-btn" 
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleLoginSubmit} id="login-form">
              <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
                <TechZoneLogo />
              </div>
              <h1 className="auth-title">Sign In</h1>
              
              <div className="auth-social-container">
                <button type="button" className="auth-social-btn" aria-label="Sign in with Google"><FaGoogle /></button>
                <button type="button" className="auth-social-btn" aria-label="Sign in with Facebook"><FaFacebookF /></button>
                <button type="button" className="auth-social-btn" aria-label="Sign in with Github"><FaGithub /></button>
                <button type="button" className="auth-social-btn" aria-label="Sign in with LinkedIn"><FaLinkedinIn /></button>
              </div>
              
              <p className="auth-form-text">or use your email account</p>
              
              <div className="auth-input-group">
                <input 
                  id="login-email"
                  className="auth-input" 
                  type="email" 
                  placeholder="Email" 
                  value={loginForm.email}
                  onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                  required 
                />
              </div>
              
              <div className="auth-input-group">
                <div className="auth-password-wrapper">
                  <input 
                    id="login-password"
                    className="auth-input" 
                    type={showLoginPassword ? 'text' : 'password'} 
                    placeholder="Password" 
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    required 
                  />
                  <button 
                    type="button" 
                    className="auth-password-toggle" 
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
              </div>

              <span className="auth-forgot-link" onClick={() => setShowForgotPassword(true)}>
                Forgot Password?
              </span>
              
              <button className="auth-submit-btn" type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'SIGN IN'}
              </button>
              
              {/* Mobile View Toggle */}
              <p className="auth-mobile-toggle">
                Don't have an account? 
                <button type="button" className="auth-mobile-toggle-btn" onClick={() => navigate('/register')}>Sign Up</button>
              </p>
            </form>
          )}
        </div>

        {/* Sign Up Form Container */}
        <div className="auth-form-container auth-sign-up-container">
          <form className="auth-form" onSubmit={handleRegisterSubmit} id="register-form">
            <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
              <TechZoneLogo />
            </div>
            <h1 className="auth-title">Create Account</h1>
            
            <div className="auth-social-container">
              <button type="button" className="auth-social-btn" aria-label="Sign up with Google"><FaGoogle /></button>
              <button type="button" className="auth-social-btn" aria-label="Sign up with Facebook"><FaFacebookF /></button>
              <button type="button" className="auth-social-btn" aria-label="Sign up with Github"><FaGithub /></button>
              <button type="button" className="auth-social-btn" aria-label="Sign up with LinkedIn"><FaLinkedinIn /></button>
            </div>
            
            <p className="auth-form-text">or use your email for registration</p>
            
            <div className="auth-input-group">
              <input 
                id="register-name"
                className="auth-input" 
                type="text" 
                placeholder="Name" 
                value={registerForm.name}
                onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))}
                required 
              />
            </div>
            
            <div className="auth-input-group">
              <input 
                id="register-email"
                className="auth-input" 
                type="email" 
                placeholder="Email" 
                value={registerForm.email}
                onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))}
                required 
              />
            </div>
            
            <div className="auth-input-group">
              <div className="auth-password-wrapper">
                <input 
                  id="register-password"
                  className="auth-input" 
                  type={showRegisterPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  value={registerForm.password}
                  onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))}
                  required 
                />
                <button 
                  type="button" 
                  className="auth-password-toggle" 
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                >
                  {showRegisterPassword ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <div className="auth-password-wrapper">
                <input 
                  id="register-confirm"
                  className="auth-input" 
                  type={showRegisterConfirm ? 'text' : 'password'} 
                  placeholder="Confirm Password" 
                  value={registerForm.confirm}
                  onChange={e => setRegisterForm(p => ({ ...p, confirm: e.target.value }))}
                  required 
                />
                <button 
                  type="button" 
                  className="auth-password-toggle" 
                  onClick={() => setShowRegisterConfirm(!showRegisterConfirm)}
                  aria-label={showRegisterConfirm ? 'Hide password' : 'Show password'}
                >
                  {showRegisterConfirm ? <FiEye /> : <FiEyeOff />}
                </button>
              </div>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className="auth-checkbox-group">
              <input 
                type="checkbox" 
                id="privacy-policy" 
                checked={agreePolicy} 
                onChange={e => setAgreePolicy(e.target.checked)} 
              />
              <label htmlFor="privacy-policy" className="auth-checkbox-label">
                I agree to the <Link to="/privacy" className="auth-policy-link">Privacy Policy</Link> & <Link to="/terms" className="auth-policy-link">Terms</Link>
              </label>
            </div>
            
            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'SIGN UP'}
            </button>
            
            {/* Mobile View Toggle */}
            <p className="auth-mobile-toggle">
              Already have an account? 
              <button type="button" className="auth-mobile-toggle-btn" onClick={() => navigate('/login')}>Sign In</button>
            </p>
          </form>
        </div>

        {/* Desktop Sliding Overlay Container */}
        <div className="auth-overlay-container">
          <div className="auth-overlay">
            
            {/* Left Overlay (shown in register-mode) */}
            <div className="auth-overlay-panel auth-overlay-left">
              <h2 className="auth-overlay-title">Welcome Back!</h2>
              <p className="auth-overlay-desc">
                Enter your personal details to use all of site features
              </p>
              <button 
                type="button" 
                className="auth-ghost-btn" 
                id="signIn"
                onClick={() => navigate('/login')}
              >
                SIGN IN
              </button>
            </div>
            
            {/* Right Overlay (shown in login-mode) */}
            <div className="auth-overlay-panel auth-overlay-right">
              <h2 className="auth-overlay-title">Hello, Friend!</h2>
              <p className="auth-overlay-desc">
                Enter your personal details and start your journey with us
              </p>
              <button 
                type="button" 
                className="auth-ghost-btn" 
                id="signUp"
                onClick={() => navigate('/register')}
              >
                SIGN UP
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </main>
  );
};

export default AuthPage;
