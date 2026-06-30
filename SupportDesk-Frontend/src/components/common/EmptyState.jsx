import React from "react";
import styles from "./EmptyState.module.css";

export default function EmptyState({
  title = "No results found",
  description = "Try adjusting your search or filters.",
  action,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
