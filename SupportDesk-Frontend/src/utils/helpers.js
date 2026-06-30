export function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getPriorityColor(priority) {
  switch (priority) {
    case "high":
      return { bg: "#FEE2E2", color: "#DC2626" };
    case "medium":
      return { bg: "#FEF3C7", color: "#D97706" };
    case "low":
      return { bg: "#D1FAE5", color: "#059669" };
    default:
      return { bg: "#F3F4F6", color: "#6B7280" };
  }
}

export function getStatusColor(status) {
  switch (status) {
    case "open":
      return { bg: "#DBEAFE", color: "#1D4ED8" };
    case "in-progress":
      return { bg: "#EDE9FE", color: "#6C4AB6" };
    case "resolved":
      return { bg: "#D1FAE5", color: "#059669" };
    default:
      return { bg: "#F3F4F6", color: "#6B7280" };
  }
}
