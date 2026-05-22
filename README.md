# 📝 FeedbackHub — Feedback Management System

<div align="center">

![FeedbackHub Banner](https://img.shields.io/badge/FeedbackHub-v2.0.0-3b63f7?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTIxIDJINWEyIDIgMCAwIDAtMiAydjE0YTIgMiAwIDAgMCAyIDJoMTRsNCA0VjRhMiAyIDAgMCAwLTItMnoiLz48L3N2Zz4=)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Pandas](https://img.shields.io/badge/Pandas-2.2+-150458?style=flat-square&logo=pandas&logoColor=white)](https://pandas.pydata.org/)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

A full-stack centralized feedback management platform for organizations, training institutes, educational platforms, and enterprises — with a complete ETL pipeline for bulk data import.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [ETL Workflow](#-etl-pipeline--workflow) · [API Docs](#-api-endpoints) · [Project Structure](#-project-structure) · [Screenshots](#-screenshots)

</div>

---

## 📌 Overview

FeedbackHub replaces scattered feedback tools (Google Forms, Excel sheets, emails) with a single centralized platform. Participants can submit feedback while administrators can view, search, filter, update, and delete records — all from a modern, responsive web interface.

Additionally, administrators can bulk-import historical or offline feedback data through a built-in **ETL Pipeline** that automatically extracts, cleans, and loads records from CSV or Excel files.

> **Phase 1** — Core CRUD + Search + Analytics Dashboard
> **Phase 2** — ETL Pipeline for bulk CSV/Excel import with data cleaning and run history

---

## ✨ Features

### Phase 1 — Core Platform
- 📥 **Submit Feedback** — Participant name, program, star rating (1–5), and comments with confetti celebration on submit
- 📋 **View All Feedback** — Paginated table with real-time filtering by rating and program
- 🔍 **Search & Filter** — Keyword search across name, program, and comments with debounced input
- ✏️ **Edit Feedback** — Inline edit form with validation on the detail page
- 🗑️ **Delete Feedback** — Confirmation dialog before deletion
- 📊 **Analytics Dashboard** — 6 interactive charts:
  - Area chart (submissions trend over 30 days)
  - Donut chart (rating distribution)
  - Gauge / Speedometer (average rating)
  - Circular progress ring (avg score with stars)
  - Radial bar chart (rating breakdown)
  - Horizontal leaderboard (top programs by count)

### Phase 2 — ETL Pipeline
- 📂 **Drag & Drop File Upload** — Upload CSV or Excel (.csv, .xlsx, .xls) via drag-and-drop or file browser
- 🔄 **4-Stage Visual Pipeline** — Animated step indicator showing Upload → Extract → Transform → Load progress
- 🧹 **Automatic Data Cleaning** — Deduplication, rating validation, text title-casing, date parsing, null handling
- 📈 **Aggregate Statistics** — Cards for total runs, records processed, loaded, duplicates skipped, invalid rows, avg valid rate
- 🕓 **Run History Table** — Every pipeline execution logged with expandable detail rows
- 📥 **Export All Feedback** — Download the entire feedback database as a CSV with one click

### UI / UX (Both Phases)
- 🌙 **Dark / Light Theme** — Toggle with persistence via localStorage
- 📱 **Fully Responsive** — Mobile-first design with floating action button
- ⚡ **Animated UI** — Page transitions, skeleton loaders, confetti on submit, micro-interactions
- 🔔 **Toast Notifications** — Success/error feedback for every action

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | 0.115+ | REST API framework |
| [SQLAlchemy](https://www.sqlalchemy.org/) | 2.0+ | ORM & database abstraction |
| [PyMySQL](https://pymysql.readthedocs.io/) | 1.1+ | MySQL driver |
| [Pydantic v2](https://docs.pydantic.dev/) | 2.10+ | Data validation & schemas |
| [Pandas](https://pandas.pydata.org/) | 2.2+ | ETL data processing |
| [OpenPyXL](https://openpyxl.readthedocs.io/) | 3.1+ | Excel file reading |
| [python-multipart](https://pypi.org/project/python-multipart/) | 0.0.9+ | File upload handling |
| [Uvicorn](https://www.uvicorn.org/) | 0.30+ | ASGI server |
| [python-dotenv](https://pypi.org/project/python-dotenv/) | 1.0+ | Environment config |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React 18](https://reactjs.org/) | 18+ | UI framework |
| [Vite](https://vitejs.dev/) | 6+ | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com/) | 4+ | Styling |
| [Framer Motion](https://www.framer.com/motion/) | — | Animations & transitions |
| [TanStack Query v5](https://tanstack.com/query) | 5+ | Server state management |
| [React Router v6](https://reactrouter.com/) | 6+ | Client-side routing |
| [React Hook Form + Zod](https://react-hook-form.com/) | — | Form validation |
| [Recharts](https://recharts.org/) | — | Charts & visualizations |
| [Axios](https://axios-http.com/) | — | HTTP client |
| [Sonner](https://sonner.emilkowal.ski/) | — | Toast notifications |
| [Lucide React](https://lucide.dev/) | — | Icons |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | — | Confetti animation |

### Database
| Technology | Purpose |
|---|---|
| [MySQL 8.0+](https://www.mysql.com/) | Primary relational database |

---

## 📁 Project Structure

```
Feedback Management System/
├── backend/
│   ├── main.py                  # FastAPI app, CORS, lifespan (table auto-create)
│   ├── database.py              # SQLAlchemy engine, session, DB auto-creation
│   ├── models.py                # ORM models: Feedback, EtlRun
│   ├── schemas.py               # Pydantic request/response schemas
│   ├── crud.py                  # Feedback CRUD + stats + analytics queries
│   ├── routers/
│   │   ├── feedback.py          # Feedback API route handlers
│   │   └── etl.py               # ETL API route handlers
│   ├── etl/
│   │   ├── extractor.py         # Read CSV / Excel → DataFrame
│   │   ├── transformer.py       # Clean, validate, standardise data
│   │   ├── loader.py            # Insert cleaned rows into MySQL
│   │   └── pipeline.py          # Orchestrate Extract → Transform → Load
│   ├── uploads/                 # Temporary storage for uploaded files
│   ├── .env                     # Environment variables (not committed)
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx            # Navbar, FAB, page transitions
│   │   │   ├── charts/               # 6 chart components
│   │   │   │   ├── AreaFeedbackChart.jsx
│   │   │   │   ├── CircularProgress.jsx
│   │   │   │   ├── DonutChart.jsx
│   │   │   │   ├── GaugeChart.jsx
│   │   │   │   ├── RadialRatingChart.jsx
│   │   │   │   └── TopProgramsChart.jsx
│   │   │   └── ui/                   # Reusable UI primitives
│   │   ├── context/
│   │   │   └── ThemeContext.jsx      # Dark/light theme
│   │   ├── hooks/
│   │   │   ├── useAnimatedCounter.js
│   │   │   └── useDebounce.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Analytics dashboard
│   │   │   ├── SubmitFeedback.jsx    # Submit form + confetti
│   │   │   ├── FeedbackList.jsx      # Table with search/filter
│   │   │   ├── FeedbackDetails.jsx   # Detail view + inline edit
│   │   │   ├── Search.jsx            # Search page
│   │   │   └── EtlPipeline.jsx       # ETL upload & run page
│   │   ├── services/
│   │   │   └── api.js                # feedbackApi + etlApi
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                 # Tailwind v4 + theme config
│   ├── vite.config.js
│   └── package.json
│
├── datasets/
│   └── sample_feedback.csv           # 120-record test dataset (ETL demo)
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [MySQL 8.0+](https://dev.mysql.com/downloads/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Hamid-944/AFDE_May26_Shaik-Mohammed-Hamid_FMS.git
cd "Feedback Management System"
```

### 2. Backend Setup

```bash
# Create and activate virtual environment (from project root)
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install all dependencies
pip install -r backend/requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=feedback_db
```

> The application **auto-creates** the `feedback_db` database, `feedback` table, and `etl_runs` table on first startup — no manual SQL needed.

### 4. Start the Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

- API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- App: `http://localhost:5173`

> Vite proxies all `/api` requests to the FastAPI backend — no CORS configuration needed during development.

---

## 🔄 ETL Pipeline — Workflow

The ETL (Extract → Transform → Load) pipeline allows administrators to bulk-import feedback data from CSV or Excel files. It is accessible from the **ETL Pipeline** page in the navigation bar.

### How It Works

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   UPLOAD    │────▶│   EXTRACT   │────▶│    TRANSFORM     │────▶│    LOAD     │
│             │     │             │     │                  │     │             │
│ Drag & drop │     │ Read CSV or │     │ Clean & validate │     │ Insert into │
│ CSV / Excel │     │ Excel file  │     │ the raw data     │     │ MySQL DB    │
└─────────────┘     └─────────────┘     └──────────────────┘     └─────────────┘
```

### Stage 1 — Extract

The extractor reads the uploaded file using **pandas**:
- `.csv` files → `pd.read_csv()` with UTF-8 encoding, bad lines skipped
- `.xlsx` / `.xls` files → `pd.read_excel()` with openpyxl engine
- Validates that required columns exist: `participant_name`, `program_name`, `rating`

### Stage 2 — Transform

The transformer applies a sequence of cleaning steps:

| Step | Operation | Records Affected |
|---|---|---|
| 1 | **Deduplicate** — remove exact duplicate rows | `duplicate_records` counter |
| 2 | **Standardise text** — strip whitespace, title-case names and programs, replace "nan"/"none"/empty → NULL | `cleaned_records` counter |
| 3 | **Drop missing required fields** — rows with no `participant_name` or `program_name` are removed | `invalid_records` counter |
| 4 | **Validate ratings** — non-numeric or out-of-range (outside 1–5) rows are removed | `invalid_records` counter |
| 5 | **Parse dates** — `submitted_at` column parsed as datetime; unparseable values default to `NOW()` | `invalid_date` counter |
| 6 | **Fill nulls** — missing `comments` set to NULL safely | — |

### Stage 3 — Load

The loader inserts each cleaned row into the `feedback` table via SQLAlchemy ORM. All pandas `NaN`/`NA`/`NaT` sentinels are converted to Python `None` before insert.

### ETL Run Tracking

Every pipeline execution is logged in the `etl_runs` table with full statistics:

| Column | Description |
|---|---|
| `run_id` | Auto-increment primary key |
| `filename` | Name of the uploaded file |
| `status` | `running` → `success` or `failed` |
| `total_records` | Raw rows read from file |
| `valid_records` | Rows that passed all validation |
| `loaded_records` | Rows successfully inserted into DB |
| `duplicate_records` | Exact duplicate rows removed |
| `invalid_records` | Rows removed due to bad rating / missing fields |
| `cleaned_records` | Rows where text was standardised |
| `error_message` | Error detail if status is `failed` |
| `started_at` | Pipeline start timestamp |
| `completed_at` | Pipeline end timestamp |

### Running the ETL Pipeline (Step-by-Step)

1. Navigate to **ETL Pipeline** in the top navigation bar
2. Drag and drop your CSV/Excel file onto the drop zone (or click to browse)
3. Confirm the filename shown in the ready state, then click **Run Pipeline**
4. Watch the 4-step indicator animate through Upload → Extract → Transform → Load
5. On success, a toast notification shows the loaded/duplicate counts
6. Scroll down to the **Run History** table to see the detailed breakdown
7. Click any row to expand it and view per-run statistics
8. Use the **Export All Feedback** button to download the full database as CSV

### Sample Dataset

A test dataset is included at `datasets/sample_feedback.csv` (120 records):

| Record Type | Count | Description |
|---|---|---|
| Clean records | 100 | Valid feedback across 10 programs |
| Duplicate rows | 10 | Exact copies — removed by deduplication |
| Dirty rows | 10 | Invalid ratings (0, -1, 6, 7), missing names, bad dates, extra whitespace |

**Expected result after running on sample_feedback.csv:**
- Total records: 120
- Loaded: 103
- Duplicates removed: 10
- Invalid / dropped: 7

---

## 🔌 API Endpoints

### Feedback Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/feedback` | Get all feedback (pagination, search, filter) |
| `GET` | `/feedback/{id}` | Get feedback by ID |
| `POST` | `/feedback` | Submit new feedback |
| `PUT` | `/feedback/{id}` | Update feedback |
| `DELETE` | `/feedback/{id}` | Delete feedback |
| `GET` | `/feedback/search/query` | Search by keyword, rating, program |
| `GET` | `/feedback/stats` | Aggregate stats (total, avg rating, distribution) |
| `GET` | `/feedback/analytics` | Analytics data (by date, top programs) |

### ETL Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/etl/upload` | Upload a CSV or Excel file |
| `POST` | `/etl/run?file_path=...` | Run the ETL pipeline on an uploaded file |
| `GET` | `/etl/runs` | List all ETL run records |
| `GET` | `/etl/report` | Aggregate ETL statistics across all runs |
| `GET` | `/etl/report/download` | Download all feedback as CSV (StreamingResponse) |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root — API status |
| `GET` | `/health` | Health check |

### Query Parameters for `GET /feedback`

| Parameter | Type | Description |
|---|---|---|
| `skip` | int | Records to skip (default: 0) |
| `limit` | int | Max records (default: 50) |
| `keyword` | string | Search across name, program, comments |
| `rating` | int | Filter by exact rating (1–5) |
| `program_name` | string | Filter by program name (partial match) |

### Example Requests

```bash
# Submit feedback
curl -X POST http://localhost:8000/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "participant_name": "John Smith",
    "program_name": "React Fundamentals Bootcamp",
    "rating": 5,
    "comments": "Excellent training, very well structured!"
  }'

# Upload a CSV for ETL
curl -X POST http://localhost:8000/etl/upload \
  -F "file=@datasets/sample_feedback.csv"

# Trigger ETL run (use file_path returned by upload)
curl -X POST "http://localhost:8000/etl/run?file_path=/path/to/uploads/sample_feedback.csv"

# Download all feedback as CSV
curl http://localhost:8000/etl/report/download -o feedback_export.csv
```

---

## 🗃️ Database Schema

### `feedback` table

```sql
CREATE TABLE feedback (
    feedback_id      INT AUTO_INCREMENT PRIMARY KEY,
    participant_name VARCHAR(255)  NOT NULL,
    program_name     VARCHAR(255)  NOT NULL,
    rating           INT           NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments         TEXT,
    submitted_at     DATETIME      DEFAULT CURRENT_TIMESTAMP
);
```

### `etl_runs` table

```sql
CREATE TABLE etl_runs (
    run_id           INT AUTO_INCREMENT PRIMARY KEY,
    filename         VARCHAR(255)  NOT NULL,
    status           VARCHAR(50)   NOT NULL DEFAULT 'running',
    total_records    INT           DEFAULT 0,
    valid_records    INT           DEFAULT 0,
    loaded_records   INT           DEFAULT 0,
    duplicate_records INT          DEFAULT 0,
    invalid_records  INT           DEFAULT 0,
    cleaned_records  INT           DEFAULT 0,
    error_message    TEXT,
    started_at       DATETIME,
    completed_at     DATETIME
);
```

> Both tables are auto-created by SQLAlchemy on first backend startup. No manual SQL is required.

**Rating Scale:**

| Value | Label |
|---|---|
| 1 | Poor |
| 2 | Fair |
| 3 | Good |
| 4 | Very Good |
| 5 | Excellent |

---

## 📸 Screenshots

### Dashboard — Analytics Overview
<img width="1889" height="884" alt="image" src="https://github.com/user-attachments/assets/a7e1117b-10c5-4036-a61e-419fd590bfae" />
<img width="1904" height="765" alt="image" src="https://github.com/user-attachments/assets/c1d6b765-f16d-4886-af26-7b1dfce4877c" />
<img width="1909" height="664" alt="image" src="https://github.com/user-attachments/assets/65fb739e-e2de-4d5c-93b8-41c438711772" />

### Submit Feedback
<img width="1104" height="876" alt="image" src="https://github.com/user-attachments/assets/8a5f05cb-a498-451f-9c25-592448a2649c" />

### All Feedback
<img width="1861" height="843" alt="image" src="https://github.com/user-attachments/assets/a0097f20-66d5-4a91-9d36-1d94910538bc" />

### Search
<img width="1373" height="748" alt="image" src="https://github.com/user-attachments/assets/3311dfac-951d-413b-88f0-8a8a60e46ba0" />

### ETL Pipeline — File Upload & Run
<!-- Add screenshot of the ETL Pipeline page showing the drag & drop zone -->
<!-- Add screenshot showing the 4-step indicator in the "running" state -->

### ETL Pipeline — Run History
<!-- Add screenshot of the run history table with a successful run expanded -->

### ETL Pipeline — Aggregate Stats Cards
<!-- Add screenshot showing the 6 stat cards (Total Runs, Records Processed, Loaded, Duplicates, Invalid, Avg Valid Rate) -->

### Swagger UI — API Testing
<img width="1817" height="882" alt="image" src="https://github.com/user-attachments/assets/5863dd56-d4a1-41a7-9795-cce2847ed126" />

### Backend Health Check
<img width="1842" height="831" alt="image" src="https://github.com/user-attachments/assets/736a71b9-7225-4556-bff6-bd66720183b6" />
<img width="1823" height="859" alt="image" src="https://github.com/user-attachments/assets/77828426-6d3f-40b0-9a87-2b9f41cfdee3" />
<img width="1801" height="881" alt="image" src="https://github.com/user-attachments/assets/83044494-0ac3-4985-a64a-955c48f16214" />
<img width="1819" height="871" alt="image" src="https://github.com/user-attachments/assets/18fb13f3-eba1-449d-abfc-fdbbd39248a3" />

---

## 📋 ETL Execution — Submission Checklist

Participants must include the following screenshots when submitting Phase 2:

- [ ] **ETL Pipeline page** — showing the drag-and-drop upload zone with a file ready to run
- [ ] **Pipeline running state** — the 4-step indicator mid-execution (Upload ✓ → Extract ✓ → Transform → Load)
- [ ] **Success toast** — notification showing `X records loaded, Y duplicates skipped`
- [ ] **Run history table** — at least one successful run row expanded to show per-run detail stats
- [ ] **Aggregate stat cards** — all 6 cards populated (Total Runs, Processed, Loaded, Duplicates, Invalid, Avg Valid %)
- [ ] **Dashboard post-import** — charts and stat counters updated after the ETL load
- [ ] **Swagger UI** — `/etl/upload`, `/etl/run`, and `/etl/report` endpoints tested and showing 200 responses
- [ ] **MySQL Workbench** — `etl_runs` table showing the run record, and `feedback` table showing imported rows

---

Built with ❤️ using **FastAPI** + **React** + **MySQL** + **Pandas**

</div>
