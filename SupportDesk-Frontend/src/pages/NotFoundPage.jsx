import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";
import Button from "../components/common/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.desc}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className={styles.actions}>
        <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
}
