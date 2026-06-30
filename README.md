# SupportDesk – Mini Customer Support Ticket System

A modern, full-stack customer support ticket management system built with React, FastAPI, and PostgreSQL. Designed for simplicity, scalability, and ease of deployment via Docker.

---

## Project Overview

**SupportDesk** is a web application that enables support teams to manage customer tickets efficiently. The system centralizes ticket creation, tracking, and resolution in a single interface.

### Problem Solved

Support teams often struggle with scattered customer requests across multiple channels. SupportDesk provides a unified platform where:
- Customers (or support agents) can submit tickets
- Teams can track ticket status and priority
- Dashboards provide visibility into open, in-progress, and resolved issues
- Urgent tickets are automatically flagged based on priority or content

### Core Features

- **Dashboard** – Real-time statistics (total, open, in-progress, resolved, urgent tickets) and recent activity
- **Ticket Management** – Create, view, update, and track support tickets
- **Search & Discovery** – Full-text search across customer names, emails, and subjects
- **Filtering** – Filter tickets by priority (Low/Medium/High) and status (Open/In Progress/Resolved)
- **Sorting** – Sort by creation date (newest/oldest)
- **Pagination** – Server-side pagination with configurable page sizes
- **Urgent Detection** – Automatic flagging of high-priority or urgent-keyword tickets
- **Backend Validation** – Strong server-side validation of all inputs
- **API Documentation** – Interactive Swagger UI at `/docs` and ReDoc at `/redoc`
- **Automated Testing** – 36 pytest tests covering urgency, validation, CRUD, search, filtering, pagination, and dashboard logic
- **Docker Support** – One-command deployment with `docker compose up --build`

---

## Technology Stack

### Frontend
- **React** 19.2.7 – UI framework
- **JavaScript** – Language (no TypeScript)
- **Axios** 1.18.1 – HTTP client
- **React Router** 7.18.1 – Client-side routing
- **CSS Modules** – Component-scoped styling

### Backend
- **Python** 3.12 – Language
- **FastAPI** 0.115.6 – Web framework
- **SQLAlchemy** 2.0.36 – ORM
- **Alembic** 1.14.0 – Database migrations
- **Pydantic** v2 2.10.4 – Data validation
- **Uvicorn** 0.34.0 – ASGI server

### Database
- **PostgreSQL** 16 – Primary database (production)
- **SQLite** – Optional for local development

### Containerization
- **Docker** – Container runtime
- **Docker Compose** – Multi-container orchestration

### Testing
- **Pytest** 8.3.4 – Test framework
- **HTTPx** 0.28.1 – Async HTTP client for testing

---

## Project Structure

```
SupportDesk/
├── docker-compose.yml          # Container orchestration
├── .env                        # Environment variables (local)
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── .gitattributes              # Git line ending rules
├── README.md                   # This file
│
├── SupportDesk-Frontend/       # React frontend
│   ├── Dockerfile              # Frontend container image
│   ├── .dockerignore           # Docker build exclusions
│   ├── .env                    # Frontend env (local dev)
│   ├── vite.config.js          # Vite bundler config with /api proxy
│   ├── index.html              # HTML entry point
│   ├── package.json            # Node dependencies
│   ├── src/
│   │   ├── main.jsx            # React DOM render
│   │   ├── App.jsx             # Root component with routing
│   │   ├── pages/              # Page components
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TicketsPage.jsx       # Server-side search/filter/sort/pagination
│   │   │   ├── CreateTicketPage.jsx
│   │   │   ├── TicketDetailPage.jsx
│   │   │   └── NotFoundPage.jsx      # 404 page
│   │   ├── components/
│   │   │   ├── common/         # Reusable UI components
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Textarea.jsx
│   │   │   │   ├── Dropdown.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   ├── FilterPanel.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   └── PageHeader.jsx
│   │   │   ├── layout/         # Layout shells
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── dashboard/      # Dashboard-specific components
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── RecentTicketsTable.jsx
│   │   │   └── tickets/        # Ticket list components
│   │   │       └── TicketsTable.jsx
│   │   ├── context/            # React Context
│   │   │   └── TicketContext.jsx      # Mutation context (add, edit, delete)
│   │   ├── services/           # API integration layer
│   │   │   ├── api.js          # Axios client instance
│   │   │   └── ticketService.js       # API calls + enum mapping
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useFormValidation.js
│   │   ├── styles/             # Global styles
│   │   │   └── global.css
│   │   ├── utils/              # Utilities
│   │   │   └── helpers.js      # Date, color, formatting helpers
│   │   └── assets/             # Static assets (if any)
│   └── dist/                   # Production build output
│
├── SupportDesk-Backend/        # FastAPI backend
│   ├── Dockerfile              # Backend container image
│   ├── .dockerignore           # Docker build exclusions
│   ├── entrypoint.sh           # Docker startup script (migrations + server)
│   ├── .env                    # Backend env (local dev)
│   ├── requirements.txt        # Python dependencies
│   ├── pytest.ini              # Pytest config
│   ├── alembic.ini             # Alembic migration config
│   ├── alembic/
│   │   ├── env.py              # Migration environment
│   │   ├── script.py.mako      # Migration template
│   │   └── versions/
│   │       └── 0001_create_tickets.py  # Initial migration
│   ├── app/
│   │   ├── main.py             # FastAPI app entrypoint
│   │   ├── core/               # Configuration & infrastructure
│   │   │   ├── config.py       # Settings (pydantic-settings)
│   │   │   ├── logging.py      # Structured logging
│   │   │   └── exceptions.py   # Exception handlers
│   │   ├── database/           # Database setup
│   │   │   ├── session.py      # Engine + SessionLocal
│   │   │   ├── base.py         # Declarative base
│   │   │   └── types.py        # Portable GUID type
│   │   ├── models/             # SQLAlchemy ORM models
│   │   │   ├── ticket.py       # Ticket model
│   │   │   └── enums.py        # Priority & Status enums
│   │   ├── schemas/            # Pydantic v2 schemas (camelCase JSON)
│   │   │   └── ticket.py       # Create, Update, Read, Paginated, Dashboard schemas
│   │   ├── api/                # API routes
│   │   │   ├── deps.py         # Dependency injection
│   │   │   └── routes/
│   │   │       ├── tickets.py  # /api/tickets endpoints
│   │   │       └── dashboard.py        # /api/dashboard endpoint
│   │   ├── services/           # Business logic layer
│   │   │   └── ticket_service.py       # Service methods
│   │   ├── repositories/       # Data access layer
│   │   │   └── ticket_repository.py    # Query builder
│   │   └── utils/              # Utilities
│   │       ├── urgency.py      # Urgent detection logic
│   │       └── seed.py         # Seed initial data
│   └── tests/
│       ├── conftest.py         # Pytest fixtures (in-memory SQLite)
│       ├── test_urgency.py     # Urgent detection tests
│       ├── test_validation.py  # Backend validation tests
│       ├── test_tickets_api.py # API integration tests
│       ├── test_dashboard.py   # Dashboard endpoint tests
│       ├── test_repository.py  # Data layer tests
│       └── test_service.py     # Service layer tests
```

---

## Database Design

### Tickets Table

```sql
CREATE TABLE tickets (
    id UUID PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'OPEN',
    is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX ix_tickets_customer_email ON tickets(customer_email);
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique ticket identifier (auto-generated) |
| `customer_name` | VARCHAR(255) | Name of the person submitting the ticket (required) |
| `customer_email` | VARCHAR(255) | Email address (required, indexed for lookup; duplicates allowed) |
| `subject` | VARCHAR(255) | Ticket title (required, minimum 1 char) |
| `description` | TEXT | Detailed problem description (required, minimum 10 chars) |
| `priority` | ENUM | LOW, MEDIUM, or HIGH (required, defaults to MEDIUM) |
| `status` | ENUM | OPEN, IN_PROGRESS, or RESOLVED (required, defaults to OPEN) |
| `is_urgent` | BOOLEAN | Auto-computed flag (HIGH priority OR "urgent" keyword in description) |
| `created_at` | TIMESTAMP | UTC creation time (auto-set, immutable) |
| `updated_at` | TIMESTAMP | UTC modification time (auto-updated on every change) |

### Enumerations

**Priority Levels:**
- `LOW` – Can be addressed when capacity allows
- `MEDIUM` – Standard priority
- `HIGH` – Requires prompt attention (auto-sets `is_urgent=true`)

**Ticket Status:**
- `OPEN` – Newly created, awaiting triage
- `IN_PROGRESS` – Support team is actively working
- `RESOLVED` – Ticket closed and issue addressed

### Timestamps

- Both `created_at` and `updated_at` are stored in **UTC with timezone info** for accurate multi-region support
- `created_at` is immutable; `updated_at` updates on every save
- Timestamps include millisecond precision

### Urgent Detection

The `is_urgent` field is **computed server-side**, never trusted from the client:
- Set to `true` if `priority == HIGH`
- Set to `true` if description contains the word "urgent" (case-insensitive, word boundary)
- Otherwise `false`
- Re-computed whenever priority or description changes

---

## API Endpoint Summary

| Method | Route | Description | Request Body | Response |
|--------|-------|-------------|--------------|----------|
| POST | `/api/tickets` | Create a new ticket | `TicketCreate` | `TicketRead` (201) |
| GET | `/api/tickets` | List tickets (paginated, searchable) | Query params: `search`, `priority`, `status`, `sort`, `page`, `limit` | `PaginatedTickets` (200) |
| GET | `/api/tickets/{id}` | Fetch a single ticket | None | `TicketRead` (200) |
| PATCH | `/api/tickets/{id}` | Partial update of a ticket | `TicketUpdate` (any fields) | `TicketRead` (200) |
| PATCH | `/api/tickets/{id}/status` | Update ticket status only | `StatusUpdate` | `TicketRead` (200) |
| GET | `/api/dashboard` | Dashboard statistics | None | `DashboardStats` (200) |
| GET | `/health` | Health check | None | `{"status": "ok", ...}` (200) |
| GET | `/docs` | Swagger UI (FastAPI auto-generated) | None | HTML (200) |
| GET | `/redoc` | ReDoc (FastAPI auto-generated) | None | HTML (200) |

### Query Parameters (GET /api/tickets)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | string | `null` | Free-text search across customer name, email, and subject |
| `priority` | enum | `null` | Filter by `LOW`, `MEDIUM`, or `HIGH` |
| `status` | enum | `null` | Filter by `OPEN`, `IN_PROGRESS`, or `RESOLVED` |
| `sort` | enum | `newest` | Sort by creation date: `newest` (descending) or `oldest` (ascending) |
| `page` | integer | `1` | Page number (1-indexed) |
| `limit` | integer | `8` | Items per page (max 100) |

### Response Schema (TicketRead - JSON in camelCase)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customerName": "Alice Johnson",
  "customerEmail": "alice@example.com",
  "subject": "Cannot login",
  "description": "Getting 'Invalid credentials' error...",
  "priority": "HIGH",
  "status": "OPEN",
  "isUrgent": true,
  "createdAt": "2026-06-30T09:15:00+00:00",
  "updatedAt": "2026-06-30T09:15:00+00:00"
}
```

---

## Backend Architecture

### Layered Design

The backend follows a clean, layered architecture for testability and maintainability:

```
Request → Route → Service → Repository → Database
         (API)   (Logic)   (Queries)    (ORM)
```

### Routes (`app/api/routes/`)

**Purpose:** HTTP request handlers, parameter validation, response serialization.

- Define REST endpoints with FastAPI decorators
- Accept request bodies (Pydantic schemas), query parameters
- Delegate business logic to services
- Return response models (auto-serialized as JSON)

**Key Files:**
- `tickets.py` – CRUD endpoints for tickets
- `dashboard.py` – Statistics aggregation

**Example:**
```python
@router.post("/tickets", response_model=TicketRead, status_code=201)
def create_ticket(payload: TicketCreate, service: TicketService = Depends(get_ticket_service)):
    return service.create_ticket(payload)
```

### Services (`app/services/`)

**Purpose:** Business logic, data transformation, orchestration.

- Coordinate between repositories, models, and schemas
- Implement domain rules (e.g., urgency detection, status transitions)
- Perform calculations (e.g., dashboard aggregates)
- Raise domain exceptions (NotFoundError, ValidationError)

**Key Files:**
- `ticket_service.py` – Ticket operations (create, get, list, update, dashboard)

**Example:**
```python
def create_ticket(self, payload: TicketCreate) -> TicketRead:
    ticket = Ticket(...)
    ticket.is_urgent = detect_urgency(ticket.priority, ticket.description)
    created = self.repo.create(ticket)
    return TicketRead.model_validate(created)
```

### Repositories (`app/repositories/`)

**Purpose:** Data access, database queries, object persistence.

- Encapsulate all SQLAlchemy ORM calls
- Build queries with filters, sorting, pagination
- Handle transaction control (commit, rollback)
- Never leak ORM objects; return domain models

**Key Files:**
- `ticket_repository.py` – Query builder for tickets

**Key Methods:**
- `get_by_id(uuid)` – Fetch a ticket
- `list_tickets(search, priority, status, sort, page, limit)` – Paginated list with filters
- `create(ticket)` – Insert and commit
- `save(ticket)` – Update and commit
- `count_*` – Aggregation helpers for dashboard

### Models (`app/models/`)

**Purpose:** SQLAlchemy ORM models, database schema definition.

**Files:**
- `ticket.py` – Ticket table mapping
- `enums.py` – Priority and Status enums

**Key Features:**
- UUID primary key (portable GUID type works on PostgreSQL and SQLite)
- Timezone-aware timestamps with UTC default
- Enum columns mapped to database enums (PostgreSQL) or strings (SQLite)
- Automatic `updated_at` on every save

### Schemas (`app/schemas/`)

**Purpose:** Pydantic v2 data validation and serialization.

**Files:**
- `ticket.py` – Request/response models

**Schemas:**
- `TicketCreate` – Validate new ticket input
- `TicketUpdate` – Partial updates (all fields optional)
- `StatusUpdate` – Status-only update
- `TicketRead` – Serialize ticket to JSON (camelCase aliases)
- `PaginatedTickets` – List response with metadata
- `DashboardStats` – Dashboard aggregates

**Example:**
```python
class TicketCreate(CamelModel):
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_email: EmailStr  # Validates email format
    description: str = Field(..., min_length=10)
    priority: Priority
```

**JSON Mapping:**
- Python field: `customer_name` ↔ JSON field: `customerName`
- Python field: `is_urgent` ↔ JSON field: `isUrgent`
- Configured via `alias_generator=to_camel` in Pydantic v2

### Database (`app/database/`)

**Purpose:** SQLAlchemy engine, session management, connection pooling.

**Files:**
- `session.py` – Engine creation, SessionLocal, `get_db()` dependency
- `base.py` – Declarative base for all models
- `types.py` – Portable GUID column type (UUID on PostgreSQL, CHAR on SQLite)

**Configuration:**
- Database URL from `settings.DATABASE_URL` (env-driven)
- Connection pool with `pool_pre_ping=True` (detects dead connections)
- Future mode for SQLAlchemy 2.0 compliance

### Dependency Injection (`app/api/deps.py`)

**Purpose:** FastAPI dependency factories for request scope.

**Example:**
```python
def get_ticket_service(db: Session = Depends(get_db)) -> TicketService:
    return TicketService(db)
```

Benefits:
- Services receive fresh database session per request
- Easy to mock for testing
- Separation of concerns

### Validation

**Layers:**
1. **Pydantic Schema** – Type validation, email regex, string length
2. **FastAPI Route** – Path parameter type coercion, query param parsing
3. **Service Logic** – Domain rule validation (e.g., status transitions)
4. **Database Constraints** – NOT NULL, UNIQUE, FK checks

**Never Trusted:**
- `is_urgent` is computed server-side; client value is ignored
- All enums are validated against allowed values
- Email must be valid format (pydantic EmailStr)

---

## Frontend Architecture

### Pages (`src/pages/`)

**Purpose:** Full-page components that handle data fetching and layout.

**DashboardPage.jsx**
- Fetches dashboard stats on mount via `getDashboardStats()`
- Displays 5 stat cards (Total, Open, In Progress, Resolved, Urgent)
- Shows table of 5 most recent tickets

**TicketsPage.jsx**
- **Server-side** pagination, search, filter, sort
- Search box debounced (300ms) for performance
- Filter panel (Priority, Status, Sort)
- Calls backend with `?search=...&priority=...&status=...&sort=...&page=...&limit=...`
- Pagination UI with page navigation
- Resets to page 1 on filter/search changes

**CreateTicketPage.jsx**
- Form validation via `useFormValidation()` hook
- Real-time red/green border feedback
- Submit calls `POST /api/tickets`
- Shows backend validation errors if returned
- Redirects to `/tickets` on success

**TicketDetailPage.jsx**
- Loads ticket via `GET /api/tickets/{id}`
- Displays all fields (read-only)
- Status dropdown + Update button
- Auto-refreshes via `GET` after status update
- Links back to ticket list

**NotFoundPage.jsx**
- 404 page for unknown routes

### Components (`src/components/`)

**Common Components** (`common/`)
Reusable UI building blocks with consistent styling:
- `Badge.jsx` – Priority, Status, Urgent badges with color coding
- `Button.jsx` – Variants (primary, secondary, danger, ghost), sizes (sm, md, lg)
- `Input.jsx` – Text fields with validation states (error, success)
- `Textarea.jsx` – Multi-line input with validation
- `Dropdown.jsx` – Select with enum options
- `Modal.jsx` – Dialog overlay with header, body, footer
- `Loader.jsx` – Spinner with optional text
- `EmptyState.jsx` – Placeholder when no results
- `SearchBar.jsx` – Search input with clear button
- `FilterPanel.jsx` – Priority/Status/Sort filter UI
- `Pagination.jsx` – Page navigation with metadata
- `PageHeader.jsx` – Title, subtitle, action button layout

**Layout Components** (`layout/`)
- `AppLayout.jsx` – Main shell with Navbar + Sidebar + Outlet
- `Navbar.jsx` – Top bar with logo, menu toggle, user info
- `Sidebar.jsx` – Navigation menu, collapsible on mobile

**Dashboard Components** (`dashboard/`)
- `StatCard.jsx` – Single statistic card (icon, number, label)
- `RecentTicketsTable.jsx` – Recent 5 tickets table

**Ticket Components** (`tickets/`)
- `TicketsTable.jsx` – Paginated ticket list with columns, sort icons, action buttons

### Service Layer (`src/services/`)

**Purpose:** Single point of API integration; maps backend enums to UI format.

**api.js**
- Axios instance configured with base URL from `VITE_API_BASE_URL` env (defaults to `/api`)
- Response interceptor normalizes errors
- Timeout: 15 seconds

**ticketService.js**
- Calls real API endpoints (no mocks)
- Maps between backend enums and UI format:
  - Backend: `HIGH`/`MEDIUM`/`LOW` ↔ UI: `high`/`medium`/`low`
  - Backend: `OPEN`/`IN_PROGRESS`/`RESOLVED` ↔ UI: `open`/`in-progress`/`resolved`
- Exported functions:
  - `getTickets(params)` – List with search/filter/sort/pagination
  - `getTicketById(id)` – Fetch single
  - `createTicket(payload)` – Create new
  - `updateTicket(id, updates)` – Partial update
  - `updateStatus(id, status)` – Status-only update
  - `getDashboardStats()` – Dashboard aggregates

### Routing (`src/App.jsx`)

**React Router v7** setup:
- `/` – DashboardPage
- `/tickets` – TicketsPage (server-side paginated list)
- `/create-ticket` – CreateTicketPage
- `/tickets/:id` – TicketDetailPage
- `*` – NotFoundPage (404)

All routes wrapped in `AppLayout` (navbar + sidebar persist across pages).

### State Management (`src/context/`)

**Lightweight approach:**
- **TicketContext** – Exposes mutation methods via `useTickets()` hook
- Methods: `addTicket()`, `editTicket()`, `changeStatus()`
- No global list cache (fetched server-side where needed)
- Suitable for small app; scales to Redux if needed later

**Form State** – Managed locally per component via `useFormValidation()` hook

### API Integration

**Proxy Setup** (Vite dev server):
- Frontend runs on port 5173
- Vite dev server configured to proxy `/api` to backend (port 8000 locally, or `http://backend:8000` in Docker)
- Browser always talks to its own origin; no hardcoded backend URL

**Error Handling:**
- Axios response interceptor catches errors and normalizes them
- Components display error messages from backend (e.g., validation failures)
- Friendly fallback message if network error

---

## Validation Rules

### Backend Validation (Never Trusted)

All validation happens server-side after frontend validation passes.

#### Customer Name
- **Required:** Cannot be empty
- **Minimum:** 1 character
- **Maximum:** 255 characters
- **Rule:** Trimmed on save

#### Customer Email
- **Required:** Cannot be empty
- **Format:** Valid email (RFC 5321 via Pydantic EmailStr)
- **Maximum:** 255 characters
- **Uniqueness:** NOT enforced; multiple tickets per email allowed
- **Indexed:** For fast customer history lookup

#### Subject
- **Required:** Cannot be empty
- **Minimum:** 1 character (frontend suggests 5 for UX, backend allows 1)
- **Maximum:** 255 characters
- **Rule:** Trimmed on save

#### Description
- **Required:** Cannot be empty
- **Minimum:** 10 characters (hard requirement)
- **No Maximum:** TEXT field allows long descriptions
- **Rule:** Trimmed; checked for "urgent" keyword

#### Priority
- **Required:** Must be specified
- **Allowed Values:** `LOW`, `MEDIUM`, `HIGH`
- **Default:** `MEDIUM` (if omitted)
- **Impact:** HIGH → automatic `is_urgent=true`

#### Status
- **Allowed Values:** `OPEN`, `IN_PROGRESS`, `RESOLVED`
- **Default:** `OPEN` (new tickets always start here)
- **Valid Transitions:** Any status can transition to any other (no state machine constraints)

#### is_urgent (Computed, Not Validated)
- Never accepted from client
- Auto-computed as: `priority == HIGH OR description.contains("urgent")`
- Re-computed on every update

### Frontend Validation (Real-time UX)

- Red/green borders on fields
- Error messages below inputs
- Submit button disabled until all fields valid
- Debounced server-side check on blur (future improvement)

### Why Each Rule Exists

| Rule | Reason |
|------|--------|
| Email format validation | Prevents invalid contact info; enables future email notifications |
| 10-char description minimum | Discourages vague/spam tickets; ensures sufficient context |
| Priority enum | Limits scope; enables sorting and dashboard aggregation |
| is_urgent computation server-side | Prevents client-side spoofing; ensures consistent data |
| Email uniqueness NOT enforced | Customers often submit multiple tickets; allows ticket history per customer |
| Trimmed strings | Prevents accidental whitespace-only fields |

---

## Business Logic

### Urgent Ticket Detection

**Algorithm:**
```python
def detect_urgency(priority: Priority, description: str) -> bool:
    if priority == Priority.HIGH:
        return True
    if re.search(r"\burgent\b", description, re.IGNORECASE):
        return True
    return False
```

**When Applied:**
- On ticket creation: computed from provided priority and description
- On ticket update: recomputed if priority or description changed
- On status update: unchanged (status doesn't affect urgency)

**Rationale:**
- HIGH priority is objectively urgent
- Description keyword catch catches customers' own urgency signals
- Word boundary (`\b`) prevents false positives (e.g., "insurgent")

### Status Updates

**Allowed Transitions:**
- Any status → Any status (no restrictions)
- Open → In Progress → Resolved (typical flow)
- Open → Resolved (skipped triage)
- Resolved → Open (reopened)

**Side Effects:**
- Updates `updated_at` to current UTC time
- All other fields unchanged

### Dashboard Calculations

**Aggregates Computed Per Request:**
- **Total Tickets:** `COUNT(*) FROM tickets`
- **Open:** `COUNT(*) WHERE status = OPEN`
- **In Progress:** `COUNT(*) WHERE status = IN_PROGRESS`
- **Resolved:** `COUNT(*) WHERE status = RESOLVED`
- **Urgent:** `COUNT(*) WHERE is_urgent = true`
- **Recent Tickets:** `5 MOST RECENT BY created_at DESC`

**Rationale:**
- No denormalized counters; always fresh
- Aggregates calculated in-memory after fetch (simple counts)
- Recent tickets limited to 5 for performance

### Duplicate Email Decision

**Policy:** Multiple tickets from the same customer email are **allowed**.

**Advantages:**
- Customers often have multiple issues
- One person may contact multiple times
- Simplifies data model (no unique constraints)

**Disadvantages:**
- No built-in "customer account"; each ticket is independent
- Manual effort to find ticket history

**Future Improvements:**
- Implement "Customer" entity with one-to-many tickets
- Add "Related Tickets" section on detail page
- Send customer their ticket history via email
- Link all tickets from same email in UI

### Search

**Supported Fields:**
- Customer name (case-insensitive substring)
- Customer email (case-insensitive substring)
- Subject (case-insensitive substring)

**Implementation:**
```sql
WHERE LOWER(customer_name) LIKE '%search%'
   OR LOWER(customer_email) LIKE '%search%'
   OR LOWER(subject) LIKE '%search%'
```

**Behavior:**
- Searches across all three fields (OR logic)
- Case-insensitive
- Partial matches (substring)
- Debounced 300ms on frontend to reduce requests

### Filtering

**Priority Filter:**
```sql
WHERE priority = 'HIGH' | 'MEDIUM' | 'LOW' [optional]
```

**Status Filter:**
```sql
WHERE status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' [optional]
```

**Behavior:**
- Each filter is independent
- Both can be applied simultaneously (AND logic)
- Omitted filters apply no constraint

### Sorting

**Supported Field:** `created_at` (creation timestamp)

**Options:**
- `sort=newest` → `ORDER BY created_at DESC` (most recent first)
- `sort=oldest` → `ORDER BY created_at ASC` (oldest first)

**Note:** Sorting by other fields (priority, status, customer name) could be added in future via additional query parameters.

### Pagination

**Parameters:**
- `page` (1-indexed, default 1)
- `limit` (items per page, default 8, max 100)

**SQL:**
```sql
OFFSET (page - 1) * limit
LIMIT limit
```

**Metadata Returned:**
- `total` – Total matching items (across all pages)
- `page` – Current page number
- `limit` – Items per page
- `totalPages` – Ceiling of total / limit
- `items` – Current page results

**Behavior:**
- Frontend resets to page 1 when filters change
- Out-of-range pages return empty results (no error)

---

## Initiative Feature: Docker & Docker Compose

### Why Docker Was Selected

**Context:** The requirement was to add one significant initiative feature beyond the standard ticket system.

**Options Considered:**
1. **Docker & Docker Compose** (selected) – Deployment automation, reproducibility
2. Authentication & authorization – Complex, requires tokens, session management
3. Ticket comments/attachments – Feature creep; not core MVP
4. Email notifications – Requires SMTP setup; external dependency

**Selection Rationale:**
- **Deliverability:** Critical for production deployment
- **Reproducibility:** Solves "works on my machine" problem
- **Scalability:** Foundation for CI/CD, Kubernetes, load balancing
- **Relevance:** Modern DevOps skill, widely used in industry
- **Scope:** Self-contained; doesn't affect business logic

### What Was Added

**Docker Images:**
- `Dockerfile` for backend (Python 3.12 Alpine)
- `Dockerfile` for frontend (Node 20 Alpine)
- `docker-compose.yml` orchestration file

**Features:**
- PostgreSQL service with named volume for persistence
- Backend service with Alembic migration auto-run
- Frontend service with Vite dev server proxy
- Service-to-service networking by name (no localhost)
- Health checks on database
- Environment variable injection
- One-command startup: `docker compose up --build`

**Entrypoints:**
- Backend: `entrypoint.sh` runs migrations, then `uvicorn`
- Frontend: `npm run dev` (Vite dev server)

### Benefits Achieved

| Benefit | Impact |
|---------|--------|
| Reproducible environment | Same setup works locally, CI, and production |
| No local dependency hell | Python, Node, PostgreSQL versions managed in containers |
| Easy onboarding | New developers run `docker compose up --build` |
| Scalability | Foundation for Kubernetes or Docker Swarm |
| CI/CD ready | Images can be pushed to registry, deployed automatically |
| Environment isolation | Multiple projects on same machine without conflicts |

### Future Improvements

1. **Production Compose File** – Separate `docker-compose.prod.yml` with optimized images (multi-stage builds, nginx reverse proxy)
2. **Health Check Endpoints** – Implement `/health/ready` and `/health/live` for orchestrators
3. **Logging Aggregation** – ELK stack or Datadog for centralized logs
4. **Database Backups** – Automated pg_dump to S3 or external storage
5. **Monitoring & Alerts** – Prometheus metrics + Grafana dashboards
6. **Secrets Management** – HashiCorp Vault or AWS Secrets Manager instead of .env
7. **Rate Limiting** – Add Redis for rate limiting across instances
8. **Blue-Green Deployments** – Zero-downtime updates

---

## Environment Variables

### Frontend

**Local Development** (`.env` in `SupportDesk-Frontend/`)
```env
VITE_API_BASE_URL=/api          # Relative URL; Vite proxy forwards to backend
BACKEND_URL=http://localhost:8000  # Vite dev server uses this to proxy
```

**Docker** (injected from root `.env`)
```env
VITE_API_BASE_URL=/api          # Relative URL; Vite dev server proxies to backend service
BACKEND_URL=http://backend:8000 # Points to backend container by service name
```

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Base URL for axios (relative paths work best) | `/api` |
| `BACKEND_URL` | Vite dev server proxy target | `http://localhost:8000` or `http://backend:8000` |

### Backend

**Local Development** (`.env` in `SupportDesk-Backend/`)
```env
DATABASE_URL=sqlite+pysqlite:///./supportdesk.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
SECRET_KEY=local-dev-secret
SEED_ON_STARTUP=true
```

**Docker** (injected from root `.env`)
```env
DATABASE_URL=postgresql+psycopg2://supportdesk:supportdesk@postgres:5432/supportdesk
POSTGRES_USER=supportdesk
POSTGRES_PASSWORD=supportdesk
POSTGRES_DB=supportdesk
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
SECRET_KEY=super-secret-change-me
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
SEED_ON_STARTUP=true
```

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | SQLAlchemy connection string | `postgresql+psycopg2://user:pass@host:5432/db` |
| `POSTGRES_USER` | PostgreSQL user (Docker only) | `supportdesk` |
| `POSTGRES_PASSWORD` | PostgreSQL password (Docker only) | `supportdesk` |
| `POSTGRES_DB` | PostgreSQL database name (Docker only) | `supportdesk` |
| `POSTGRES_HOST` | PostgreSQL host (Docker only) | `postgres` (service name) |
| `POSTGRES_PORT` | PostgreSQL port (Docker only) | `5432` |
| `SECRET_KEY` | Session/signing secret | (random string, change in production) |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:5173,http://127.0.0.1:5173` |
| `SEED_ON_STARTUP` | Auto-populate 20 mock tickets | `true` or `false` |

### Root Docker Compose

**`.env` file** (root directory)
```env
# PostgreSQL
POSTGRES_USER=supportdesk
POSTGRES_PASSWORD=supportdesk
POSTGRES_DB=supportdesk
POSTGRES_PORT=5432

# Backend
SECRET_KEY=super-secret-change-me
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Frontend
VITE_API_BASE_URL=/api
```

---

## Setup Instructions (Local, No Docker)

### Prerequisites

- Python 3.12 or later
- Node.js 20 or later
- SQLite (usually pre-installed) or PostgreSQL

### Backend Setup

#### 1. Navigate to backend directory
```bash
cd SupportDesk-Backend
```

#### 2. Create virtual environment
```bash
python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows PowerShell
# OR
source .venv/bin/activate   # macOS/Linux
```

#### 3. Install dependencies
```bash
pip install -r requirements.txt
```

#### 4. Set up environment
Create `.env` in `SupportDesk-Backend/`:
```env
DATABASE_URL=sqlite+pysqlite:///./supportdesk.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
SECRET_KEY=local-dev-secret
SEED_ON_STARTUP=true
```

#### 5. Initialize database
```bash
python -c "
from app.database.base import Base
from app.database.session import engine
import app.models
Base.metadata.create_all(bind=engine)
"
```

#### 6. Run backend server
```bash
uvicorn app.main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO | supportdesk.seed | Seeded 20 tickets.
```

Backend now available at `http://localhost:8000`

Swagger docs: `http://localhost:8000/docs`

### Frontend Setup

#### 1. Navigate to frontend directory
```bash
cd SupportDesk-Frontend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Set up environment (optional)
Create `.env`:
```env
VITE_API_BASE_URL=/api
BACKEND_URL=http://localhost:8000
```

(Defaults are already set in vite.config.js)

#### 4. Run development server
```bash
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
```

Frontend now available at `http://localhost:5173`

### Running Tests

#### Backend tests (36 total)
```bash
cd SupportDesk-Backend
.venv\Scripts\Activate.ps1  # Activate venv first
pytest
```

Expected output:
```
36 passed in 0.43s
```

Test categories:
- Urgency detection (6 tests)
- Validation (7 tests)
- API CRUD + search/filter/sort/pagination (15 tests)
- Dashboard (2 tests)
- Repository (4 tests)
- Service layer (2 tests)

#### Frontend tests
Currently no automated tests (can be added with Jest/React Testing Library in future).

---

## Docker Instructions

### Prerequisites

- Docker Desktop installed and running

### Build and Start

```bash
cd SupportDesk  # Root directory
docker compose up --build
```

First run takes ~2 minutes (downloads images, creates containers, runs migrations, seeds data).

Expected output:
```
postgres-1   | LOG:  database system is ready to accept connections
backend-1    | [entrypoint] Migrations applied. Starting API server.
backend-1    | INFO:     Uvicorn running on http://0.0.0.0:8000
frontend-1   | ➜  Local:   http://localhost:5173
```

Services now available:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432` (user: `supportdesk`, pass: `supportdesk`)

### Useful Commands

#### Stop services
```bash
docker compose down
```

Stops all containers but preserves the `pgdata` volume (database persists).

#### Remove everything (including data)
```bash
docker compose down -v
```

Deletes containers, volumes, and database. Next `up` will start fresh.

#### View logs
```bash
docker compose logs -f           # All services
docker compose logs -f backend   # Backend only
docker compose logs -f frontend  # Frontend only
```

#### List running containers
```bash
docker compose ps
```

#### Restart a service
```bash
docker compose restart backend
```

#### Re-run migrations only
```bash
docker compose exec backend alembic upgrade head
```

#### Access PostgreSQL shell
```bash
docker compose exec postgres psql -U supportdesk -d supportdesk
```

Then in psql:
```sql
SELECT COUNT(*) FROM tickets;
SELECT * FROM tickets LIMIT 1;
```

---

## Testing

### Running Tests

#### Backend (36 tests via pytest)

```bash
cd SupportDesk-Backend
.venv\Scripts\Activate.ps1    # Windows
pytest
```

#### Test Breakdown

| Category | Tests | Coverage |
|----------|-------|----------|
| Urgency detection | 6 | HIGH/MEDIUM/LOW priority, urgent keyword, word boundaries |
| Backend validation | 7 | Email format, description length, required fields, invalid enums |
| API CRUD | 8 | Create, read, get, list, update, status patch |
| Search/Filter/Sort | 4 | Search by name/email/subject, filter by priority/status, sort newest/oldest |
| Pagination | 2 | Metadata, page boundaries, limit |
| Dashboard | 2 | Stat aggregation, empty state |
| Repository | 4 | CRUD, query filters, counts |
| Service | 2 | Service layer orchestration, pagination |

#### Expected Output

```
============================== test session starts ==============================
collected 36 items

tests/test_urgency.py ................
tests/test_validation.py .......
tests/test_tickets_api.py ........
tests/test_dashboard.py ..
tests/test_repository.py ....
tests/test_service.py ..

============================== 36 passed in 0.43s ==============================
```

#### Test Environment

- In-memory SQLite database (not PostgreSQL)
- Fresh database per test (auto-created, auto-destroyed)
- SEED_ON_STARTUP disabled
- Fixtures in `tests/conftest.py`

### What Is Tested

1. **Urgency Logic** – HIGH priority, urgent keyword, word boundaries, case-insensitivity
2. **Validation** – Required fields, email format, string length, enum values
3. **CRUD** – Create, read, update, partial updates, status changes
4. **Search** – Substring matching across name, email, subject; case-insensitive
5. **Filtering** – Priority and status independently
6. **Sorting** – Newest (DESC) and oldest (ASC) by created_at
7. **Pagination** – Page math, total counts, metadata
8. **Dashboard** – Stat aggregation (total, open, in-progress, resolved, urgent)
9. **Error Handling** – 404 for unknown ID, 422 for invalid input

### What Is NOT Tested (Future)

- Frontend components (requires Jest/React Testing Library)
- End-to-end flows (requires Cypress/Selenium)
- Performance/load testing (requires Locust)
- Integration with PostgreSQL (tests use SQLite; migration verified separately)

---

## Swagger API Documentation

### Accessing Interactive Docs

#### Swagger UI
```
http://localhost:8000/docs
```
- Interactive, can test endpoints directly
- Auto-generated from OpenAPI schema
- Preferred for quick testing

#### ReDoc
```
http://localhost:8000/redoc
```
- Beautiful, read-only documentation
- Sidebar navigation
- Better for sharing with non-technical users

### Features

- **Try it out:** Click "Try it out" on any endpoint to test it live
- **Schemas:** View request/response JSON structures
- **Parameters:** See all query params, path params, headers
- **Responses:** View status codes and example responses

### OpenAPI Schema

```
http://localhost:8000/openapi.json
```
Raw JSON schema (used by docs above).

---

## Assumptions

### Data & Business Rules

1. **Single Organization** – Not multi-tenant; all tickets belong to one organization
2. **No Authentication** – No login required; anyone can create/view/update tickets
3. **No Authorization** – No role-based access control; all users have full permissions
4. **Email Uniqueness NOT Enforced** – Multiple tickets from same email allowed
5. **No Ticket Comments** – Tickets don't have discussion threads
6. **No Attachments** – No file uploads; description is text only
7. **No Status Machine** – Any status can transition to any other (no validation)
8. **No Ticket Closure Delay** – Can immediately reopen resolved tickets
9. **Dashboard Aggregates are Fresh** – Calculated on every request (not cached)
10. **Recent Tickets = 5** – Hard-coded limit on dashboard

### Technical

1. **SQLite for Local Dev** – PostgreSQL required in production (Docker)
2. **No Session Management** – Stateless API; no CSRF tokens needed
3. **No Rate Limiting** – Open endpoints; no throttling
4. **No API Versioning** – Single `/api` namespace (can add `/api/v2` later)
5. **No Webhooks** – No outbound events to external systems
6. **No Background Jobs** – No async task queue (e.g., Celery)
7. **No Caching** – No Redis; data always fresh from database
8. **No Full-Text Search** – Basic LIKE queries only (no Elasticsearch)
9. **No Audit Logging** – No who/when/what history (can add later)

### Deployment

1. **Docker Compose for Development** – Not intended for production load
2. **Database Data in Docker Volume** – Persists across container restarts, but volume not backed up
3. **Single Backend Instance** – No load balancing or horizontal scaling
4. **SQLite Suitable for Testing** – Not recommended for concurrent production loads

---

## Known Limitations

### Current Constraints

| Limitation | Impact | Workaround |
|-----------|--------|-----------|
| No authentication | Anyone can view/modify any ticket | Deploy behind VPN or reverse proxy with auth |
| No authorization | No role-based permissions | Add authentication first, then implement roles |
| No email validation | Cannot verify customer email addresses | Add email verification workflow in future |
| Single organization | Cannot serve multiple tenants | Would require database schema redesign |
| 255-char name/subject limit | Long titles get truncated | Increase VARCHAR limit or move to text field |
| 10-char description minimum | Discourages short issues | Lower limit if too restrictive |
| No file uploads | Cannot attach files to tickets | Add storage layer (S3, GCS) + file handling |
| No ticket history comments | Cannot have discussion thread | Add Comment table + API endpoints |
| No email notifications | Customers don't get updates | Add SMTP integration + email templating |
| No WebSocket updates | Page must refresh for live data | Add Socket.IO or ws for real-time updates |
| SQLite in Docker | Cannot scale horizontally | Use PostgreSQL + multi-instance setup |
| No rate limiting | API open to abuse | Add Redis + rate limiter middleware |
| No audit logging | Cannot track who changed what | Add audit log table + trigger |
| No full-text search | Search uses basic LIKE | Integrate Elasticsearch or PostgreSQL FTS |
| No pagination controls | Fixed 8 items per page in UI | Make limit configurable in query params |
| No sort options | Only sort by created_at | Add sort by priority, status, name |

### Why These Exist

These are intentional MVP constraints to keep the scope manageable:
- Authentication adds complexity (tokens, sessions, password hashing)
- File uploads require external storage and security considerations
- Real-time updates need WebSocket infrastructure
- Each addition increases deployment complexity and operational burden

---

## Future Improvements

### Phase 1: Core Features (Next 2-3 weeks)

- **Add ticket comments** – Enable support team discussion on tickets
- **Customer notes** – Internal notes visible only to support team
- **Ticket priorities** – Allow bulk priority updates
- **Ticket search by ID** – Quick lookup by ticket number
- **Export to CSV** – Bulk export for reporting

### Phase 2: User Management (1 month)

- **Authentication** – Login with email + password or SSO (Google, GitHub)
- **Role-based access** – Support agent, manager, customer roles
- **Customer portal** – Customers create own tickets, view status
- **Audit logging** – Track all changes (who, when, what)

### Phase 3: Communication (1 month)

- **Email notifications** – Notify on ticket creation, status change, comment
- **Ticket comments** – Discussion thread with timestamps and author
- **Customer notifications** – Customers receive updates via email
- **Mention system** – @mention team members in comments

### Phase 4: Scaling & Resilience (Ongoing)

- **Caching** – Redis for dashboard stats, frequently accessed tickets
- **Rate limiting** – Prevent abuse via API rate limiter middleware
- **Horizontal scaling** – Deploy multiple backend instances behind load balancer
- **Database replication** – PostgreSQL read replicas for reporting
- **Monitoring & alerts** – Prometheus + Grafana + PagerDuty

### Phase 5: Analytics & Intelligence (Ongoing)

- **Dashboard analytics** – Response time, resolution rate, SLA compliance
- **Customer health scores** – Based on ticket history and priority
- **Recommendation engine** – Suggest similar resolved tickets
- **AI-powered categorization** – Auto-categorize tickets by topic
- **Sentiment analysis** – Detect frustrated customers

### Phase 6: Mobile & Client SDKs

- **Mobile app** – React Native or Flutter for iOS/Android
- **JavaScript SDK** – Embed ticket widget in customer websites
- **API client SDKs** – Python, Go, JavaScript SDKs for programmatic access

---

## Time Breakdown

| Phase | Estimated Hours | Notes |
|-------|----------------:|-------|
| **Planning & Design** | 0.5 | Reviewed requirements, designed database schema and API |
| **Frontend (React)** | 2.0 | Built pages, reusable components, routing, validation, and UI |
| **Backend & Database** | 2.0 | FastAPI API, SQLAlchemy models, business logic, PostgreSQL integration |
| **Frontend–Backend Integration** | 0.5 | Connected React with FastAPI, verified CRUD operations |
| **Testing** | 0.5 | Wrote and executed automated backend tests |
| **Docker Setup** | 0.5 | Dockerfiles, Docker Compose, environment configuration |
| **Documentation & Cleanup** | 1.0 | README, code cleanup, deployment verification, final review |
| | | |
| **Total** | **7.0 hours** | Completed within the recommended 8-hour time limit |
```
## Conclusion

**SupportDesk** is a production-ready ticket management system demonstrating modern full-stack development practices:

- **Clean Architecture:** Layered design (routes → services → repositories → database) for testability and maintainability
- **Type Safety:** Pydantic v2 schemas, validated enums, proper error types
- **Real Data Flow:** Proper database transactions, timezone-aware timestamps, migration support
- **Comprehensive Testing:** 36 tests covering business logic, validation, and integration
- **User-Friendly:** Real-time form validation, pagination, search, filtering, sorting
- **DevOps-Ready:** Docker containerization, environment-driven config, health checks
- **Well-Documented:** This README, code comments, API docs, and structured project layout

The system is ready for immediate deployment and serves as a solid foundation for future enhancements.
