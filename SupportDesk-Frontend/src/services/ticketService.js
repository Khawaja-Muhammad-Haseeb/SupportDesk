/**
 * Ticket Service — the single integration point with the FastAPI backend.
 *
 * Endpoints consumed:
 *   GET    /api/tickets
 *   POST   /api/tickets
 *   GET    /api/tickets/:id
 *   PATCH  /api/tickets/:id
 *   PATCH  /api/tickets/:id/status
 *   GET    /api/dashboard
 *
 * The backend uses uppercase enums (LOW/MEDIUM/HIGH, OPEN/IN_PROGRESS/RESOLVED).
 * The UI components use lowercase/hyphenated values, so this layer maps between
 * the two so the rest of the frontend stays untouched.
 */
import api from "./api";

const STATUS_API_TO_UI = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
};

const STATUS_UI_TO_API = {
  open: "OPEN",
  "in-progress": "IN_PROGRESS",
  resolved: "RESOLVED",
};

function priorityToUi(p) {
  return (p || "").toLowerCase();
}
function priorityToApi(p) {
  return (p || "").toUpperCase();
}
function statusToUi(s) {
  return STATUS_API_TO_UI[s] || s;
}
function statusToApi(s) {
  return STATUS_UI_TO_API[s] || s;
}

// Convert an API ticket into the shape the UI expects.
function mapTicket(t) {
  return {
    ...t,
    priority: priorityToUi(t.priority),
    status: statusToUi(t.status),
  };
}

// GET /api/tickets — supports search, filtering, sorting and pagination.
export async function getTickets(params = {}) {
  const query = {
    page: params.page || 1,
    limit: params.limit || 8,
    sort: params.sort || "newest",
  };
  if (params.search) query.search = params.search;
  if (params.priority) query.priority = priorityToApi(params.priority);
  if (params.status) query.status = statusToApi(params.status);

  const { data } = await api.get("/tickets", { params: query });
  return {
    items: (data.items || []).map(mapTicket),
    total: data.total,
    page: data.page,
    limit: data.limit,
    totalPages: data.totalPages,
  };
}

// GET /api/tickets/:id
export async function getTicketById(id) {
  const { data } = await api.get(`/tickets/${id}`);
  return mapTicket(data);
}

// POST /api/tickets
export async function createTicket(payload) {
  const body = {
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    subject: payload.subject,
    description: payload.description,
    priority: priorityToApi(payload.priority),
  };
  const { data } = await api.post("/tickets", body);
  return mapTicket(data);
}

// PATCH /api/tickets/:id
export async function updateTicket(id, updates) {
  const body = { ...updates };
  if (body.priority) body.priority = priorityToApi(body.priority);
  if (body.status) body.status = statusToApi(body.status);
  const { data } = await api.patch(`/tickets/${id}`, body);
  return mapTicket(data);
}

// PATCH /api/tickets/:id/status
export async function updateStatus(id, status) {
  const { data } = await api.patch(`/tickets/${id}/status`, {
    status: statusToApi(status),
  });
  return mapTicket(data);
}

// GET /api/dashboard
export async function getDashboardStats() {
  const { data } = await api.get("/dashboard");
  return {
    total: data.total,
    open: data.open,
    inProgress: data.inProgress,
    resolved: data.resolved,
    urgent: data.urgent,
    recentTickets: (data.recentTickets || []).map(mapTicket),
  };
}
