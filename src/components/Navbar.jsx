// =============================================
//  RHYTHMIX — Navbar Component
// =============================================
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './Navbar.module.css';

export default function Navbar({ searchQuery, onSearch }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>♪</span>
          <span className={styles.logoText}>rhythmix</span>
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.search}
            type="text"
            placeholder="Search songs or artists…"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
          />
          {searchQuery && (
            <button className={styles.clearBtn} onClick={() => onSearch('')}>✕</button>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className={styles.userPill}>
            <div className={styles.avatar}>{user?.avatar}</div>
            <span className={styles.userName}>{user?.name}</span>
          </div>

          <button className={styles.logoutBtn} onClick={logout} title="Log out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
