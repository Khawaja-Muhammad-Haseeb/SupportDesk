import React from "react";
import styles from "./Loader.module.css";

export default function Loader({ size = "md", text = "Loading..." }) {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}

export function InlineLoader() {
  return <div className={`${styles.spinner} ${styles.sm} ${styles.inline}`} />;
}
