// =============================================
//  RHYTHMIX — Login Page
// =============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './Login.module.css';

export default function Login() {
  const { login, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate async auth
    await new Promise(r => setTimeout(r, 600));
    const result = login(username.trim(), password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  const fillDemo = () => { setUsername('demo'); setPassword('demo123'); setError(''); };

  return (
    <div className={`${styles.page} ${mounted ? styles.visible : ''}`}>
      {/* Ambient blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      {/* Theme toggle top-right */}
      <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>♪</span>
          <span className={styles.logoText}>rhythmix</span>
        </div>
        <p className={styles.tagline}>Your smart music companion</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>👤</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                className={styles.input}
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass(s => !s)}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={`${styles.loginBtn} ${loading ? styles.loading : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}><span>or try a demo</span></div>

        <button className={styles.demoBtn} onClick={fillDemo} type="button">
          Fill demo credentials
        </button>

        <p className={styles.hint}>
          Hint: <code>demo / demo123</code>
        </p>
      </div>
    </div>
  );
}
