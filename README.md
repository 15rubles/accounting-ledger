# Accounting Ledger

A full-stack web application for tracking financial transactions for a business or personal use. Record deposits and payments, browse the ledger, run date-based and vendor reports, and search transactions with any combination of filters.

Built as containerized **Spring Boot + PostgreSQL + React** application.

## What I added beyond the requirements

| Original requirement | What this project does instead / in addition |
|---|---|
| Java **CLI** application | **REST API** (Spring Boot) + **React web UI** |
| Transactions stored in **`transactions.csv`** | Transactions stored in **PostgreSQL** |
| Run from the IDE | Whole stack runs with **one command** via **Docker Compose** |
| Schema implied by the CSV format | Versioned schema with **Flyway migrations**, including seed data |
| Reports list matching entries | Every report also returns **total deposits, total payments and net** |
| Custom search with a single amount | Custom search supports an **amount range** (min / max), **case-insensitive partial matching** on description and vendor, and an **inclusive end date** |
| Search by vendor | Vendor search uses **partial, case-insensitive matching** ("amaz" finds "Amazon") |
| - | **Fixed business time zone** (`America/Los_Angeles`) via an injected `Clock`, so "month to date" is correct even though containers run in UTC |
| - | **Seed data relative to the current date**, so every report has data on a fresh install, no matter when the project is cloned |
| - | **Request/response DTOs** so the API never exposes database entities directly |
| - | **Dynamic queries with JPA Specifications** for the custom search |

---

## Tech stack

**Backend**
- Java 25, Spring Boot 4
- Spring Web, Spring Data JPA, Bean Validation
- PostgreSQL, Flyway
- Lombok
- Maven (wrapper included)

**Frontend**
- React + TypeScript, built with Vite
- React Router (pages)
- TanStack Query (data fetching, caching, refetching)

**Infrastructure**
- Docker, Docker Compose
- nginx (serves the React build and proxies `/api` to the backend)

---

## Running with Docker

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/). Nothing else, not even Java or Node.

```bash
git clone https://github.com/15rubles/accounting-ledger.git
cd accounting-ledger
docker compose up --build
```

Then open **http://localhost:3000**.

The first build takes a few minutes while Maven and npm download dependencies. Later builds are much faster.

### Useful commands

| Command | What it does |
|---|---|
| `docker compose up --build` | Build and start everything |
| `docker compose up --build -d` | Same, in the background |
| `docker compose logs -f backend` | Follow the backend logs |
| `docker compose down` | Stop everything, **keep** the data |
| `docker compose down -v` | Stop everything and **reset the database** |

### How the containers fit together

```
browser ──► localhost:3000
              │
        ┌─────▼──────┐
        │  frontend  │  nginx: serves React, forwards /api/* ─┐
        └────────────┘                                        │
                                                       ┌──────▼─────┐
                                                       │  backend   │  Spring Boot :8080
                                                       └──────┬─────┘
                                                       ┌──────▼─────┐
                                                       │     db     │  PostgreSQL, data in a volume
                                                       └────────────┘
```

Only the frontend is exposed to the host (plus Postgres on 5432 for local development). The backend is reachable only through nginx.

---

## Running locally for development

Use this setup while coding: it gives hot reload on the frontend and debugging in the IDE for the backend.

**Requirements:** Java 25, Node.js (LTS), Docker Desktop.

1. **Start only the database**
   ```bash
   docker compose up -d db
   ```

2. **Start the backend** (port 8080)
   - Open the repository root in IntelliJ and import `backend/pom.xml` as a Maven project
   - Run `AccountingLedgerApplication`
   - Or from the terminal:
     ```bash
     cd backend
     ./mvnw spring-boot:run        # Windows: .\mvnw.cmd spring-boot:run
     ```
   Flyway creates the schema and seed data on first start.

3. **Start the frontend** (port 5173)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open **http://localhost:5173**. The Vite dev server proxies `/api` to the backend, so no CORS configuration is needed.

---

## Project structure

**Backend organization:** code is grouped **by feature** (`transaction/`, `report/`) instead of by layer, so everything about one feature lives in one place. Within a feature:
- **Controller** handles HTTP only (routes, status codes, validation trigger)
- **Service** holds business logic and transaction boundaries
- **Repository** handles data access
- **`dto/`** defines exactly what goes in and out of the API
- **`entity/`** maps to database tables

**Frontend organization:** `api/` plays the role of the backend's repository layer, `pages/` map one-to-one to the spec's screens, and `components/` are shared building blocks.

---

## API reference

All endpoints are under `/api`.

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | All transactions, newest first |
| `GET` | `/api/transactions?type=DEPOSIT` | Deposits only |
| `GET` | `/api/transactions?type=PAYMENT` | Payments only |
| `POST` | `/api/transactions` | Create a transaction (positive amount = deposit, negative = payment) |
| `GET` | `/api/transactions/search` | Custom search, all parameters optional |

**Create a transaction**
```http
POST /api/transactions
Content-Type: application/json

{
  "description": "ergonomic keyboard",
  "vendor": "Amazon",
  "amount": -89.50,
  "date": "2026-11-01",
  "time": "10:13:25"
}
```
`date` and `time` are optional and default to now.

**Custom search parameters**

| Parameter | Example | Behavior |
|---|---|---|
| `startDate` | `2026-10-01` | On or after this date |
| `endDate` | `2026-10-31` | On or before this date (whole day included) |
| `description` | `keyboard` | Contains, case-insensitive |
| `vendor` | `amaz` | Contains, case-insensitive |
| `minAmount` | `-100` | Amount greater than or equal |
| `maxAmount` | `2000` | Amount less than or equal |

Example: `GET /api/transactions/search?vendor=amazon&startDate=2026-01-01`

### Reports

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reports/month-to-date` | From the 1st of this month to today |
| `GET` | `/api/reports/previous-month` | The whole previous calendar month |
| `GET` | `/api/reports/year-to-date` | From January 1st to today |
| `GET` | `/api/reports/previous-year` | The whole previous calendar year |
| `GET` | `/api/reports/vendor?vendor=amazon` | All transactions for a vendor |

Every report returns the matching transactions plus totals:
```json
{
  "title": "MONTH_TO_DATE",
  "from": "2026-11-01",
  "to": "2026-11-05",
  "totalDeposits": 1500.00,
  "totalPayments": -108.25,
  "net": 1391.75,
  "transactions": [ ... ]
}
```

### Errors

Validation failures return `400` with one message per invalid field:
```json
{
  "title": "Bad Request",
  "status": 400,
  "detail": "Validation failed",
  "errors": {
    "vendor": "Vendor is required",
    "amount": "Amount must have at most 2 decimal places"
  }
}
```