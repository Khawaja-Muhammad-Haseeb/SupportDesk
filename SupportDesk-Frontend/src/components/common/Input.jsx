import React from "react";
import styles from "./Input.module.css";

export default function Input({
  label,
  id,
  error,
  touched,
  hint,
  className = "",
  ...props
}) {
  const isValid = touched && !error;
  const isInvalid = touched && !!error;

  return (
    <div className={`${styles.field} ${className}`}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
      <input
        id={id}
        className={`${styles.input} ${isValid ? styles.valid : ""} ${isInvalid ? styles.invalid : ""}`}
        {...props}
      />
      {isInvalid && <span className={styles.errorMsg}>{error}</span>}
      {isValid && !hint && <span className={styles.successMsg}>Looks good!</span>}
      {hint && !isInvalid && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
