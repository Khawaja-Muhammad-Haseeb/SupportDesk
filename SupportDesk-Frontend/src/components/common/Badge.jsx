import React from "react";
import styles from "./Badge.module.css";
import { getPriorityColor, getStatusColor, capitalize } from "../../utils/helpers";

export function PriorityBadge({ priority }) {
  const { bg, color } = getPriorityColor(priority);
  return (
    <span className={styles.badge} style={{ background: bg, color }}>
      {capitalize(priority)}
    </span>
  );
}

export function StatusBadge({ status }) {
  const { bg, color } = getStatusColor(status);
  const label = status === "in-progress" ? "In Progress" : capitalize(status);
  return (
    <span className={styles.badge} style={{ background: bg, color }}>
      {label}
    </span>
  );
}

export function UrgentBadge() {
  return (
    <span className={`${styles.badge} ${styles.urgent}`}>
      Urgent
    </span>
  );
}

export default function Badge({ children, variant = "default" }) {
  return (
    <span className={`${styles.badge} ${styles[variant] || ""}`}>
      {children}
    </span>
  );
}
