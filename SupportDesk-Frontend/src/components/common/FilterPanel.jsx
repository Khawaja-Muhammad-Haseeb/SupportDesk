import React from "react";
import styles from "./FilterPanel.module.css";

export default function FilterPanel({ filters, onFilterChange, onReset }) {
  const hasActive = filters.priority || filters.status || filters.sort !== "newest";

  return (
    <div className={styles.panel}>
      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label}>Priority</label>
          <select
            className={styles.select}
            value={filters.priority}
            onChange={(e) => onFilterChange("priority", e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Status</label>
          <select
            className={styles.select}
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Sort</label>
          <select
            className={styles.select}
            value={filters.sort}
            onChange={(e) => onFilterChange("sort", e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {hasActive && (
          <button className={styles.resetBtn} onClick={onReset}>
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
