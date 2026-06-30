import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TicketsPage.module.css";
import * as ticketService from "../services/ticketService";
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import FilterPanel from "../components/common/FilterPanel";
import TicketsTable from "../components/tickets/TicketsTable";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";

const ITEMS_PER_PAGE = 8;

const DEFAULT_FILTERS = {
  search: "",
  priority: "",
  status: "",
  sort: "newest",
};

export default function TicketsPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch a page of tickets from the backend whenever the query changes.
  const fetchPage = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ticketService.getTickets(params);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce so typing in the search box doesn't fire a request per keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      fetchPage({
        page,
        limit: ITEMS_PER_PAGE,
        search: filters.search,
        priority: filters.priority,
        status: filters.status,
        sort: filters.sort,
      });
    }, 300);
    return () => clearTimeout(handle);
  }, [filters, page, fetchPage]);

  function handleSearchChange(val) {
    setFilters((prev) => ({ ...prev, search: val }));
    setPage(1);
  }

  function handleFilterChange(key, val) {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setPage(1);
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  // The backend sorts by creation date (newest/oldest). Clicking the "Created"
  // column header toggles between the two.
  function handleSort(field) {
    if (field !== "createdAt") return;
    setFilters((prev) => ({
      ...prev,
      sort: prev.sort === "newest" ? "oldest" : "newest",
    }));
    setPage(1);
  }

  const sortDir = filters.sort === "oldest" ? "asc" : "desc";

  return (
    <div>
      <PageHeader
        title="All Tickets"
        subtitle={`${data.total} total ticket${data.total !== 1 ? "s" : ""}`}
        action={
          <Button onClick={() => navigate("/create-ticket")}>
            + New Ticket
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <SearchBar
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by name, email or subject..."
          />
        </div>
      </div>

      <div className={styles.filterWrap}>
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {error ? (
        <p style={{ color: "var(--danger)", padding: 20 }}>Error: {error}</p>
      ) : loading ? (
        <Loader text="Loading tickets..." />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No tickets found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={
            <Button variant="outline" onClick={handleReset}>
              Clear Filters
            </Button>
          }
        />
      ) : (
        <>
          <div className={styles.results}>
            <span className={styles.resultCount}>
              {data.total} result{data.total !== 1 ? "s" : ""}
            </span>
          </div>
          <TicketsTable
            tickets={data.items}
            sortField="createdAt"
            sortDir={sortDir}
            onSort={handleSort}
          />
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
            totalItems={data.total}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}
    </div>
  );
}
