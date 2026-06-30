import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TicketDetailPage.module.css";
import * as ticketService from "../services/ticketService";
import { useTickets } from "../context/TicketContext";
import PageHeader from "../components/common/PageHeader";
import { PriorityBadge, StatusBadge, UrgentBadge } from "../components/common/Badge";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { formatDateTime } from "../utils/helpers";
import { InlineLoader } from "../components/common/Loader";

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { changeStatus } = useTickets();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    ticketService
      .getTicketById(id)
      .then((t) => {
        setTicket(t);
        setSelectedStatus(t.status);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusUpdate() {
    if (selectedStatus === ticket.status) return;
    setUpdating(true);
    setUpdateMsg(null);
    try {
      await changeStatus(id, selectedStatus);
      // Refresh the ticket from the backend so all fields reflect server state.
      const refreshed = await ticketService.getTicketById(id);
      setTicket(refreshed);
      setSelectedStatus(refreshed.status);
      setUpdateMsg({ type: "success", text: "Status updated successfully." });
    } catch (e) {
      setUpdateMsg({ type: "error", text: e.message });
    } finally {
      setUpdating(false);
      setTimeout(() => setUpdateMsg(null), 3000);
    }
  }

  if (loading) return <Loader text="Loading ticket..." />;
  if (error) {
    return (
      <div>
        <PageHeader title="Ticket Not Found" action={<Button variant="secondary" onClick={() => navigate("/tickets")}>← Back</Button>} />
        <p style={{ color: "var(--danger)" }}>Error: {error}</p>
      </div>
    );
  }

  const statusChanged = selectedStatus !== ticket.status;

  return (
    <div>
      <PageHeader
        title={`Ticket ${ticket.id}`}
        subtitle={ticket.subject}
        action={
          <Button variant="secondary" onClick={() => navigate("/tickets")}>
            ← Back to Tickets
          </Button>
        }
      />

      <div className={styles.grid}>
        {/* Main info card */}
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Ticket Details</h2>
            <div className={styles.badges}>
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
              {ticket.isUrgent && <UrgentBadge />}
            </div>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Subject</span>
              <span className={styles.fieldValue}>{ticket.subject}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>Description</span>
              <p className={styles.description}>{ticket.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className={styles.sidebar}>
          {/* Customer */}
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Customer</h3>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Name</span>
              <span className={styles.infoValue}>{ticket.customerName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email</span>
              <a href={`mailto:${ticket.customerEmail}`} className={styles.emailLink}>
                {ticket.customerEmail}
              </a>
            </div>
          </div>

          {/* Metadata */}
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Metadata</h3>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Priority</span>
              <PriorityBadge priority={ticket.priority} />
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Status</span>
              <StatusBadge status={ticket.status} />
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Urgent</span>
              <span className={styles.infoValue}>{ticket.isUrgent ? "Yes" : "No"}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Created</span>
              <span className={styles.infoValue}>{formatDateTime(ticket.createdAt)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Updated</span>
              <span className={styles.infoValue}>{formatDateTime(ticket.updatedAt)}</span>
            </div>
          </div>

          {/* Status update */}
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Update Status</h3>

            {updateMsg && (
              <div
                className={`${styles.updateMsg} ${updateMsg.type === "success" ? styles.success : styles.error}`}
              >
                {updateMsg.text}
              </div>
            )}

            <select
              className={styles.statusSelect}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <Button
              fullWidth
              disabled={!statusChanged || updating}
              onClick={handleStatusUpdate}
              className={styles.updateBtn}
            >
              {updating ? <><InlineLoader /> Updating...</> : "Update Status"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
