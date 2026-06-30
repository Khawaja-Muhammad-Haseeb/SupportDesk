import React, { createContext, useContext, useCallback } from "react";
import * as ticketService from "../services/ticketService";

/**
 * Lightweight context exposing ticket mutations backed by the API service.
 * List fetching is done per-page where needed (server-side pagination), so the
 * context intentionally does not cache a global ticket list.
 */
const TicketContext = createContext(null);

export function TicketProvider({ children }) {
  const addTicket = useCallback((data) => ticketService.createTicket(data), []);

  const editTicket = useCallback(
    (id, updates) => ticketService.updateTicket(id, updates),
    []
  );

  const changeStatus = useCallback(
    (id, status) => ticketService.updateStatus(id, status),
    []
  );

  return (
    <TicketContext.Provider value={{ addTicket, editTicket, changeStatus }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets must be used within TicketProvider");
  return ctx;
}
