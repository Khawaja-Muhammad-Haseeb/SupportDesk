import React from "react";
import styles from "./StatCard.module.css";

export default function StatCard({ title, value, icon, color, bg }) {
  return (
    <div className={styles.card} style={{ "--accent": color, "--accent-bg": bg }}>
      <div className={styles.iconWrap}>
        {icon}
      </div>
      <div className={styles.info}>
        <span className={styles.value}>{value}</span>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
}
