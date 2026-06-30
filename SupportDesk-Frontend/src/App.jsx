import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TicketProvider } from "./context/TicketContext";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <TicketProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/create-ticket" element={<CreateTicketPage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </TicketProvider>
    </BrowserRouter>
  );
}
