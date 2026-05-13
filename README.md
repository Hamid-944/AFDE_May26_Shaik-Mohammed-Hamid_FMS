# 📝 FeedbackHub — Feedback Management System

<div align="center">

![FeedbackHub Banner](https://img.shields.io/badge/FeedbackHub-v1.0.0-3b63f7?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTIxIDJINWEyIDIgMCAwIDAtMiAydjE0YTIgMiAwIDAgMCAyIDJoMTRsNCA0VjRhMiAyIDAgMCAwLTItMnoiLz48L3N2Zz4=)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

A full-stack centralized feedback management platform for organizations, training institutes, educational platforms, and enterprises.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Docs](#-api-endpoints) · [Project Structure](#-project-structure)

</div>

---

## 📌 Overview

FeedbackHub replaces scattered feedback tools (Google Forms, Excel sheets, emails) with a single centralized platform. Participants can submit feedback while administrators can view, search, filter, update, and delete records — all from a modern, responsive web interface.

> **Phase 1** — Core CRUD + Search functionality  
> **Phase 2 (Planned)** — Authentication, AI sentiment analysis, analytics dashboards, semantic search, cloud deployment

---

## ✨ Features

- 📥 **Submit Feedback** — Participant name, program, star rating (1–5), and comments
- 📋 **View All Feedback** — Paginated table with sorting and real-time filtering
- 🔍 **Search & Filter** — Keyword search, rating filter, program name filter with debounced input
- ✏️ **Edit Feedback** — Inline edit form with validation
- 🗑️ **Delete Feedback** — Confirmation dialog before deletion
- 📊 **Analytics Dashboard** — 6 interactive charts:
  - Area chart (submissions over 30 days)
  - Donut chart (rating distribution)
  - Gauge / Speedometer (average rating)
  - Circular progress ring (avg score)
  - Radial bar chart (rating breakdown)
  - Horizontal leaderboard (top programs)
- 🌙 **Dark / Light Theme** — Toggle with system preference respect
- 📱 **Fully Responsive** — Mobile-first design with floating action button
- ⚡ **Animated UI** — Page transitions, skeleton loaders, confetti on submit, micro-interactions

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | REST API framework |
| [SQLAlchemy](https://www.sqlalchemy.org/) | ORM & database abstraction |
| [PyMySQL](https://pymysql.readthedocs.io/) | MySQL driver |
| [Pydantic v2](https://docs.pydantic.dev/) | Data validation & schemas |
| [Uvicorn](https://www.uvicorn.org/) | ASGI server |
| [python-dotenv](https://pypi.org/project/python-dotenv/) | Environment config |

### Frontend
| Technology | Purpose |
|---|---|
| [React 18](https://reactjs.org/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [TanStack Query v5](https://tanstack.com/query) | Server state management |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [React Hook Form + Zod](https://react-hook-form.com/) | Form validation |
| [Recharts](https://recharts.org/) | Charts & visualizations |
| [Axios](https://axios-http.com/) | HTTP client |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| [Lucide React](https://lucide.dev/) | Icons |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | Confetti animation |

### Database
| Technology | Purpose |
|---|---|
| [MySQL 8.0+](https://www.mysql.com/) | Primary database |

---

## 📁 Project Structure

```
Feedback Management System/
├── backend/
│   ├── main.py               # FastAPI app entry point, CORS config
│   ├── database.py           # SQLAlchemy engine, session, DB auto-creation
│   ├── models.py             # ORM model (Feedback table)
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── crud.py               # All database operations
│   ├── routers/
│   │   └── feedback.py       # API route handlers
│   ├── .env                  # Environment variables (not committed)
│   └── requirements.txt      # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx           # Navbar, FAB, page transitions
│   │   │   ├── charts/              # 6 chart components
│   │   │   │   ├── AreaFeedbackChart.jsx
│   │   │   │   ├── CircularProgress.jsx
│   │   │   │   ├── DonutChart.jsx
│   │   │   │   ├── GaugeChart.jsx
│   │   │   │   ├── RadialRatingChart.jsx
│   │   │   │   └── TopProgramsChart.jsx
│   │   │   └── ui/                  # Reusable UI components
│   │   │       ├── Badge.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Skeleton.jsx
│   │   │       ├── Spinner.jsx
│   │   │       └── StarRating.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx     # Dark/light theme
│   │   ├── hooks/
│   │   │   ├── useAnimatedCounter.js
│   │   │   └── useDebounce.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Analytics dashboard
│   │   │   ├── SubmitFeedback.jsx   # Submit form + confetti
│   │   │   ├── FeedbackList.jsx     # Table with search/filter
│   │   │   ├── FeedbackDetails.jsx  # Detail view + inline edit
│   │   │   └── Search.jsx           # Search page
│   │   ├── services/
│   │   │   └── api.js               # Axios API service layer
│   │   ├── lib/
│   │   │   └── utils.js             # Helpers, constants
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind + theme config
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [MySQL 8.0+](https://dev.mysql.com/downloads/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/feedback-management-system.git
cd feedback-management-system
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt
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

> The application **auto-creates** the `feedback_db` database and `feedback` table on first startup — no manual SQL needed.

### 4. Start the Backend

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

API will be available at: `http://localhost:8000`  
Interactive docs at: `http://localhost:8000/docs`

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

> The Vite dev server proxies all `/api` requests to the FastAPI backend automatically — no CORS issues during development.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/feedback` | Get all feedback (supports pagination, search, filter) |
| `GET` | `/feedback/{id}` | Get feedback by ID |
| `POST` | `/feedback` | Submit new feedback |
| `PUT` | `/feedback/{id}` | Update feedback |
| `DELETE` | `/feedback/{id}` | Delete feedback |
| `GET` | `/feedback/search/query` | Search feedback by keyword, rating, program |
| `GET` | `/feedback/stats` | Get aggregate stats (total, avg rating, distribution) |
| `GET` | `/feedback/analytics` | Get analytics data (by date, top programs) |
| `GET` | `/health` | Health check |

### Query Parameters for `GET /feedback`

| Parameter | Type | Description |
|---|---|---|
| `skip` | int | Records to skip (default: 0) |
| `limit` | int | Max records (default: 50, max: 200) |
| `keyword` | string | Search across name, program, comments |
| `rating` | int | Filter by exact rating (1–5) |
| `program_name` | string | Filter by program name (partial match) |

### Example Request

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
```

---

## 🗃️ Database Schema

```sql
CREATE TABLE feedback (
    feedback_id    INT AUTO_INCREMENT PRIMARY KEY,
    participant_name VARCHAR(255) NOT NULL,
    program_name   VARCHAR(255) NOT NULL,
    rating         INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments       TEXT,
    submitted_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Rating Scale:**

| Value | Label |
|---|---|
| 1 | Poor |
| 2 | Fair |
| 3 | Good |
| 4 | Very Good |
| 5 | Excellent |

---

## 📸 Pages
Dashboard
<img width="1889" height="884" alt="image" src="https://github.com/user-attachments/assets/a7e1117b-10c5-4036-a61e-419fd590bfae" />
<img width="1904" height="765" alt="image" src="https://github.com/user-attachments/assets/c1d6b765-f16d-4886-af26-7b1dfce4877c" />
<img width="1909" height="664" alt="image" src="https://github.com/user-attachments/assets/65fb739e-e2de-4d5c-93b8-41c438711772" />
Submit Feedback
<img width="1104" height="876" alt="image" src="https://github.com/user-attachments/assets/8a5f05cb-a498-451f-9c25-592448a2649c" />
All Feedbacks
<img width="1861" height="843" alt="image" src="https://github.com/user-attachments/assets/a0097f20-66d5-4a91-9d36-1d94910538bc" />
Searching the Feedback
<img width="1373" height="748" alt="image" src="https://github.com/user-attachments/assets/3311dfac-951d-413b-88f0-8a8a60e46ba0" />
Swagger UI API Testing
<img width="1817" height="882" alt="image" src="https://github.com/user-attachments/assets/5863dd56-d4a1-41a7-9795-cce2847ed126" />
Health check of Backend
<img width="1842" height="831" alt="image" src="https://github.com/user-attachments/assets/736a71b9-7225-4556-bff6-bd66720183b6" />
<img width="1823" height="859" alt="image" src="https://github.com/user-attachments/assets/77828426-6d3f-40b0-9a87-2b9f41cfdee3" />
<img width="1801" height="881" alt="image" src="https://github.com/user-attachments/assets/83044494-0ac3-4985-a64a-955c48f16214" />
<img width="1819" height="871" alt="image" src="https://github.com/user-attachments/assets/18fb13f3-eba1-449d-abfc-fdbbd39248a3" />







---


---

Built with ❤️ using **FastAPI** + **React** + **MySQL**

</div>
