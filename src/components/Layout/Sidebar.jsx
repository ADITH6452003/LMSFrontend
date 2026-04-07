import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ user, navigate, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 1, label: 'Dashboard', icon: '📊', link: '/' },
    { id: 2, label: 'Apply Leave', icon: '📝', link: '/apply', hideFor: ['principal'] },
    { id: 3, label: 'View Leave', icon: '📅', link: '/view-leave', hideFor: ['principal'] },
    { id: 4, label: 'Leave Approvals', icon: '✅', link: '/approvals', hideFor: ['student'] }, /* For Admin/Manager */
    { id: 5, label: 'Manage Users', icon: '👥', link: '/manage-users', hideFor: ['student'] }, /* Restrict to Management roles exclusively */
  ];

  const visibleMenuItems = menuItems.filter(item => 
    !item.hideFor || !item.hideFor.includes(user?.role)
  );

  const handleNavigation = (e, link) => {
    e.preventDefault();
    if (navigate) {
      navigate(link);
    }
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>LMS</div>
        <h2 className={styles.brandTitle}>LeaveFlow</h2>
        <button className={styles.mobileCloseBtn} onClick={() => setIsOpen(false)}>✕</button>
      </div>

      <nav className={styles.navMenu}>
        <span className={styles.menuLabel}>MAIN MENU</span>
        <ul className={styles.navList}>
          {visibleMenuItems.map((item) => (
            <li key={item.id} className={styles.navItem}>
              <a 
                href={item.link} 
                className={styles.navLink}
                onClick={(e) => handleNavigation(e, item.link)}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.linkText}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.supportBox}>
          <p className={styles.supportTitle}>Need Help?</p>
          <p className={styles.supportText}>Contact HR for queries regarding policy.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
