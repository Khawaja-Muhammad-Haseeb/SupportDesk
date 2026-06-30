import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TicketsTable.module.css";
import { PriorityBadge, StatusBadge, UrgentBadge } from "../common/Badge";
import Button from "../common/Button";
import { formatDate } from "../../utils/helpers";

export default function TicketsTable({ tickets, sortField, sortDir, onSort }) {
  const navigate = useNavigate();

  function SortIcon({ field }) {
    if (sortField !== field) {
      return (
        <svg className={styles.sortIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      );
    }
    return sortDir === "asc" ? (
      <svg className={`${styles.sortIcon} ${styles.active}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    ) : (
      <svg className={`${styles.sortIcon} ${styles.active}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => onSort("id")} className={styles.sortable}>
                Ticket ID <SortIcon field="id" />
              </th>
              <th onClick={() => onSort("customerName")} className={styles.sortable}>
                Customer <SortIcon field="customerName" />
              </th>
              <th>Email</th>
              <th>Subject</th>
              <th onClick={() => onSort("priority")} className={styles.sortable}>
                Priority <SortIcon field="priority" />
              </th>
              <th onClick={() => onSort("status")} className={styles.sortable}>
                Status <SortIcon field="status" />
              </th>
              <th onClick={() => onSort("createdAt")} className={styles.sortable}>
                Created <SortIcon field="createdAt" />
              </th>
              <th>Flag</th>
              <th>Actions</th>
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
                </td>
                <td>
                  <span className={styles.customerName}>{ticket.customerName}</span>
                </td>
                <td>
                  <span className={styles.email}>{ticket.customerEmail}</span>
                </td>
                <td>
                  <span className={styles.subject}>{ticket.subject}</span>
                </td>
                <td><PriorityBadge priority={ticket.priority} /></td>
                <td><StatusBadge status={ticket.status} /></td>
                <td className={styles.date}>{formatDate(ticket.createdAt)}</td>
                <td>
                  {ticket.isUrgent ? <UrgentBadge /> : <span className={styles.noFlag}>—</span>}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
