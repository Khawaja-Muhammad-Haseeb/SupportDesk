import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecentTicketsTable.module.css";
import { PriorityBadge, StatusBadge, UrgentBadge } from "../common/Badge";
import { formatDate } from "../../utils/helpers";

export default function RecentTicketsTable({ tickets }) {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className={styles.row}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <td>
                  <span className={styles.ticketId}>{ticket.id}</span>
                  {ticket.isUrgent && (
                    <span className={styles.urgentDot} title="Urgent" />
                  )}
                </td>
                <td>
                  <div className={styles.customer}>
                    <span className={styles.name}>{ticket.customerName}</span>
                    <span className={styles.email}>{ticket.customerEmail}</span>
                  </div>
                </td>
                <td className={styles.subject}>{ticket.subject}</td>
                <td><PriorityBadge priority={ticket.priority} /></td>
                <td><StatusBadge status={ticket.status} /></td>
                <td className={styles.date}>{formatDate(ticket.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
