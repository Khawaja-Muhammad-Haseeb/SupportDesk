import React from "react";
import styles from "./Textarea.module.css";

export default function Textarea({
  label,
  id,
  error,
  touched,
  hint,
  rows = 4,
  className = "",
  ...props
}) {
  const isValid = touched && !error;
  const isInvalid = touched && !!error;

  return (
    <div className={`${styles.field} ${className}`}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
      <textarea
        id={id}
        rows={rows}
        className={`${styles.textarea} ${isValid ? styles.valid : ""} ${isInvalid ? styles.invalid : ""}`}
        {...props}
      />
      {isInvalid && <span className={styles.errorMsg}>{error}</span>}
      {isValid && !hint && <span className={styles.successMsg}>Looks good!</span>}
      {hint && !isInvalid && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
