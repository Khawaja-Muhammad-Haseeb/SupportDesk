import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardPage.module.css";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/dashboard/StatCard";
import RecentTicketsTable from "../components/dashboard/RecentTicketsTable";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import * as ticketService from "../services/ticketService";

const STAT_CONFIG = [
  {
    key: "total",
    title: "Total Tickets",
    color: "#6C4AB6",
    bg: "#ede9fe",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    key: "open",
    title: "Open",
    color: "#1D4ED8",
    bg: "#DBEAFE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    key: "inProgress",
    title: "In Progress",
    color: "#6C4AB6",
    bg: "#EDE9FE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
  {
    key: "resolved",
    title: "Resolved",
    color: "#059669",
    bg: "#D1FAE5",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    key: "urgent",
    title: "Urgent",
    color: "#DC2626",
    bg: "#FEE2E2",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ticketService
      .getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <p style={{ color: "var(--danger)", padding: 20 }}>Error: {error}</p>;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of all support activity"
        action={
          <Button onClick={() => navigate("/create-ticket")}>
            + New Ticket
          </Button>
        }
      />

      <div className={styles.statsGrid}>
        {STAT_CONFIG.map((s) => (
          <StatCard
            key={s.key}
            title={s.title}
            value={stats[s.key]}
            icon={s.icon}
            color={s.color}
            bg={s.bg}
          />
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Tickets</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/tickets")}>
            View All →
          </Button>
        </div>
        {stats.recentTickets.length > 0 ? (
          <RecentTicketsTable tickets={stats.recentTickets} />
        ) : (
          <p className={styles.empty}>No tickets yet.</p>
        )}
      </div>
    </div>
  );
}
