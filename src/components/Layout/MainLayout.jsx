import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './MainLayout.module.css';

const MainLayout = ({ children, user, navigate, notificationCount }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.layoutContainer}>
      <Sidebar user={user} navigate={navigate} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={styles.mainWrapper}>
        <Header user={user} notificationCount={notificationCount} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className={styles.contentArea}>
          <div className={styles.pageContent}>
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 90, backdropFilter: 'blur(2px)' }} 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
