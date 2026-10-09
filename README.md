# CareerTrack — Modern Job & Application Tracker (SQLite Powered)

A modern, responsive, and intuitive web application to track job offers, resume versions, recruiter interactions, and interview pipelines — backed by an **SQLite relational database (`jobs.db`)**.

---

## 🗄️ SQLite Database Architecture

The application now stores all data in a local SQLite file (`jobs.db`) using Node.js's built-in SQLite engine with write-ahead logging (WAL) and foreign key cascades.

### Relational Schema

```sql
-- 1. Main Job Offers Table
CREATE TABLE job_offers (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  link TEXT,
  deadline TEXT,
  status TEXT NOT NULL DEFAULT 'Saved',
  cv_version TEXT NOT NULL DEFAULT 'ATS CV',
  application_date TEXT,
  follow_up_date TEXT,
  recruiter_name TEXT,
  recruiter_email TEXT,
  recruiter_phone TEXT,
  recruiter_linkedin TEXT,
  notes TEXT,
  recruiter_response TEXT,
  salary TEXT,
  job_type TEXT DEFAULT 'Full-time',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. Multi-Round Interview Schedule Table
CREATE TABLE interviews (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  round TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  interviewer TEXT,
  notes TEXT,
  completed INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (job_id) REFERENCES job_offers(id) ON DELETE CASCADE
);

-- Optimized Indexes
CREATE INDEX idx_jobs_status ON job_offers(status);
CREATE INDEX idx_jobs_company ON job_offers(company);
CREATE INDEX idx_jobs_deadline ON job_offers(deadline);
CREATE INDEX idx_interviews_job ON interviews(job_id);
```

---

## 🌟 Key Application Features

### 1. Job Offer Management
- **Add, Edit, and Delete** job offers directly in SQLite.
- Store company names, job titles, descriptions, locations, salary/compensation, job types, application links, and application deadlines.
- Switch between modern **Grid Cards** view and a compact **Data Table** view.

### 2. Application Pipeline Tracking (Kanban Board)
- Visual stage progression across 6 status categories:
  - 💡 **Saved**: Identified and bookmarked roles.
  - 📝 **To Apply**: Roles currently tailoring CVs and cover letters for.
  - 🚀 **Applied**: Submitted applications awaiting recruiter response.
  - 🎙️ **Interview**: Active interview stages and technical assessments.
  - 🎉 **Accepted**: Offers received with celebratory confetti feedback!
  - ❌ **Rejected**: Closed roles archived with feedback and learning notes.
- Quick stage advancement buttons directly on each card.

### 3. CV Version Association & Effectiveness Analytics
- Associate each job offer with the specific CV version used:
  - **ATS CV**: Formatted for applicant tracking systems and portals.
  - **Visual CV**: Styled layout for direct recruiter/founder outreach.
  - **Website Portfolio**: Live portfolio link and web demos.
- **Conversion Tracking**: The dashboard calculates conversion rates per CV version so you know which format delivers the most interviews.

### 4. Recruiter Contacts & Interview Schedules
- Record recruiter names, email addresses (`mailto:`), phone numbers (`tel:`), and LinkedIn profiles.
- Keep track of recruiter feedback and responses.
- Dynamic interview manager: add multiple interview rounds (HR screen, technical test, system design, final round), dates, times, interviewers, and completion status.

### 5. Smart Reminders & Follow-Ups
- Set application deadlines and follow-up dates.
- Automated urgency detection:
  - 🚨 **Overdue**: Missed deadlines or follow-ups.
  - ⚡ **Due Today**: Items requiring action today.
  - 📅 **Upcoming**: Deadlines and interviews in the next 7 days.
- Desktop browser notification support via the Web Notifications API.
- 1-click snooze (`+7 Days`) or completion.

### 6. Executive Dashboard
- Key metrics: Total Offers, Applications Sent, Active Interviews, Pending Follow-ups, and Interview Conversion Rate.
- Pipeline distribution funnel bars.
- 7-day upcoming deadline radar and recent activity feed.

### 7. SQLite Persistence & Backup
- Automatically saves all entries directly to `jobs.db`.
- **JSON Backup**: Export and restore full datasets anytime.
- **CSV Export**: Export data compatible with Excel and Google Sheets.
- Pre-seeded with realistic sample jobs that can be edited, cleared, or restored with one click.

---

## 🚀 How to Run

### Quick Start
```bash
# Starts both the SQLite API server (port 3001) and Vite app (port 5173)
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

### Available Scripts
- `npm run dev`: Concurrently runs the SQLite REST API server and the Vite React frontend.
- `npm run server`: Runs only the backend SQLite API server (`node --experimental-sqlite server/index.js`).
- `npm run client`: Runs only the frontend Vite dev server.
- `npm run build`: Builds the production bundle in `dist/`.
- `npm run start`: Runs the SQLite backend in production mode (serves `dist/` directly).

---

## 📡 SQLite REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | SQLite connection status, version, and record count |
| `GET` | `/api/jobs` | Retrieve all job offers and nested interviews |
| `GET` | `/api/jobs/:id` | Retrieve a single job offer by ID |
| `POST` | `/api/jobs` | Create or update a job offer and its interview rounds |
| `PUT` | `/api/jobs/:id` | Update an existing job offer |
| `PATCH` | `/api/jobs/:id/status` | Update stage status (`Saved`, `To Apply`, `Applied`, etc.) |
| `DELETE` | `/api/jobs/:id` | Delete job offer (cascades to interviews) |
| `POST` | `/api/jobs/reset` | Reset SQLite database to demo dataset |
| `POST` | `/api/jobs/clear` | Clear all records from SQLite |
| `POST` | `/api/jobs/import` | Bulk import array of jobs into SQLite |
