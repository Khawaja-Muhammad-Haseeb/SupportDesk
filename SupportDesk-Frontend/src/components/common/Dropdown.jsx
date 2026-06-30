import React from "react";
import styles from "./Dropdown.module.css";

export default function Dropdown({
  label,
  id,
  options = [],
  error,
  touched,
  placeholder = "Select...",
  className = "",
  ...props
}) {
  const isValid = touched && !error;
  const isInvalid = touched && !!error;

  return (
    <div className={`${styles.field} ${className}`}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
      <select
        id={id}
        className={`${styles.select} ${isValid ? styles.valid : ""} ${isInvalid ? styles.invalid : ""}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {isInvalid && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}
