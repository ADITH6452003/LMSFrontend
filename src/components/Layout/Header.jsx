import React from 'react';
import styles from './Header.module.css';

const Header = ({ user, notificationCount, onMenuClick }) => {
  const name = user?.name || 'Guest User';
  const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Visitor';
  
  // Create initials like "AB" from "Adith B"
  const initials = name
    .split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={onMenuClick}>
        ☰
      </button>

      <div style={{ flex: 1 }}></div>

      <div className={styles.headerActions}>
        <button className={styles.iconBtn}>
          🔔
          {notificationCount > 0 && (
            <span className={styles.notificationBadge}>{notificationCount}</span>
          )}
        </button>
        
        <div className={styles.divider}></div>
        
        <div className={styles.userProfile}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{name}</p>
            <p className={styles.userRole}>{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
