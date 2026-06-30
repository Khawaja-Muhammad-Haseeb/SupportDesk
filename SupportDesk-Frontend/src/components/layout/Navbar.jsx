import React from "react";
import styles from "./Navbar.module.css";

export default function Navbar({ onMenuToggle }) {
  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className={styles.brand}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className={styles.brandName}>SupportDesk</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.avatar}>
          <span>AD</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Admin</span>
          <span className={styles.userRole}>Support Agent</span>
        </div>
      </div>
    </header>
  );
}
