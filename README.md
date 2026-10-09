# 💼 CareerTrack — Modern Job & Application Tracker

A modern, responsive, and intuitive full-stack web application designed to track job offers, resume versions, recruiter interactions, and interview pipelines — powered by an **SQLite relational database (`jobs.db`)**.

---

## 📋 Table of Contents
1. [Quick Start (1-Click on Windows)](#-quick-start)
2. [Running Locally in Development Mode](#-running-in-development-mode)
3. [Deploying Locally in Production Mode](#-deploying-locally-in-production-mode)
4. [Running Automatically in Background (PM2 / Windows Service)](#-running-in-background-with-pm2)
5. [Accessing from Mobile / Other Devices on LAN](#-accessing-from-mobile--other-devices)
6. [SQLite Database Architecture](#-sqlite-database-architecture)
7. [REST API Reference](#-rest-api-reference)
8. [Project Structure](#-project-structure)
9. [Backup & Data Portability](#-backup--data-portability)

---

## ⚡ Quick Start

### Prerequisites
- **Node.js**: v20+ or v22+ (verified on Node.js v22.11.0)
- **npm**: v10+

### Option A: 1-Click Launch (Windows)
Double-click [`start-careertrack.bat`](file:///d:/dossier%20personnel%20Guendouz/develoement/Jobs/start-careertrack.bat) in the project folder.  
It will automatically launch both the SQLite backend server and the frontend, and open **http://localhost:5173** in your default web browser.

---

## 🛠️ Running in Development Mode

Development mode runs both the **SQLite Express API server** (port `3001`) and the **Vite React UI with Hot-Module Replacement** (port `5173`):

```bash
# 1. Open your terminal in the project directory
cd "d:\dossier personnel Guendouz\develoement\Jobs"

# 2. Install dependencies (if not already done)
npm install

# 3. Start development environment
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **SQLite API Server**: [http://localhost:3001/api/health](http://localhost:3001/api/health)
- Any edits made in the code will hot-reload instantly.

---

## 🚀 Deploying Locally in Production Mode

In production mode, the application compiles into an optimized, static bundle and runs on a **single unified server** on port `3001` that serves both the API and the user interface.

### Step 1: Build the production bundle
```bash
npm run build
```
This produces optimized production assets inside the `dist/` directory.

### Step 2: Start the production server
```bash
npm start
```
The application is now running at **[http://localhost:3001](http://localhost:3001)**.

---

## 🔄 Running in Background with PM2

PM2 is pre-configured with [`ecosystem.config.cjs`](file:///d:/dossier%20personnel%20Guendouz/develoement/Jobs/ecosystem.config.cjs). You can run it either via npm scripts (no global install needed) or globally.

### Method 1: Using Included npm Scripts (Quickest)

You can manage the background service directly via npm:

```bash
# 1. Build and start CareerTrack in the background
npm run pm2:start

# 2. Check process status & memory usage
npm run pm2:status

# 3. View real-time output & error logs
npm run pm2:logs

# 4. Restart the service
npm run pm2:restart

# 5. Stop the service
npm run pm2:stop

# 6. Remove from PM2 process list
npm run pm2:delete
```

---

### Method 2: Using Global PM2

```bash
# 1. Install PM2 globally (run PowerShell as Administrator)
npm install -g pm2

# 2. Start using the ecosystem config
pm2 start ecosystem.config.cjs

# 3. Useful PM2 commands
pm2 status
pm2 logs careertrack
pm2 restart careertrack
pm2 stop careertrack
```

### Making PM2 Auto-Start on Windows Boot:
```bash
npm install -g pm2-windows-startup
pm2-startup install
pm2 save
```

---

### 🔕 Method 3: 100% Silent Background Mode (No Terminal Windows)

If you want the application to run invisibly in the background without any terminal or console window open:

- **To Start Silently**: Double-click [`run-background.vbs`](file:///d:/dossier%20personnel%20Guendouz/develoement/Jobs/run-background.vbs)
  *(Runs Node.js + SQLite in the background and opens http://localhost:3001 in your browser).*
- **To Stop**: Double-click [`stop-background.bat`](file:///d:/dossier%20personnel%20Guendouz/develoement/Jobs/stop-background.bat)
  *(Terminates the background process cleanly).*

---

## 📱 Accessing from Mobile / Other Devices

You can use CareerTrack from your phone, tablet, or another computer connected to the same Wi-Fi network:

1. Find your computer's local IP address in PowerShell or Command Prompt:
   ```powershell
   ipconfig
   ```
   Look for `IPv4 Address` (e.g. `192.168.1.45` or `10.145.33.24`).

2. Start the app:
   ```bash
   npm run dev
   ```

3. On your phone's browser, navigate to:
   ```
   http://YOUR_LOCAL_IP:5173
   ```
   *(e.g., `http://192.168.1.45:5173`)*

---

## 🗄️ SQLite Database Architecture

All data is stored locally in the [`jobs.db`](file:///d:/dossier%20personnel%20Guendouz/develoement/Jobs/jobs.db) file located in the root of the project.

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

-- 2. Interview Rounds Table (1-to-many relationship)
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

-- Indexes for lightning fast queries
CREATE INDEX idx_jobs_status ON job_offers(status);
CREATE INDEX idx_jobs_company ON job_offers(company);
CREATE INDEX idx_jobs_deadline ON job_offers(deadline);
CREATE INDEX idx_interviews_job ON interviews(job_id);
```

### Inspecting Database Directly
You can open `jobs.db` anytime using free SQLite tools:
- [DB Browser for SQLite](https://sqlitebrowser.org/) (GUI)
- [DBeaver Community](https://dbeaver.io/)
- VS Code Extension: `SQLite Viewer`

---

## 📡 REST API Reference

The backend exposes a full JSON REST API:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status and total job count |
| `GET` | `/api/jobs` | Retrieve all job offers and nested interviews |
| `GET` | `/api/jobs/:id` | Retrieve single job offer by ID |
| `POST` | `/api/jobs` | Create a new job offer with interview rounds |
| `PUT` | `/api/jobs/:id` | Update an existing job offer |
| `PATCH` | `/api/jobs/:id/status` | Update application stage status |
| `DELETE` | `/api/jobs/:id` | Delete job offer (cascades to interviews) |
| `POST` | `/api/jobs/reset` | Reset database to sample dataset |
| `POST` | `/api/jobs/clear` | Clear all records |
| `POST` | `/api/jobs/import` | Bulk import an array of job offers |

---

## 📂 Project Structure

```
Jobs/
├── jobs.db                     # Local SQLite database file
├── start-careertrack.bat       # 1-click Windows launcher
├── package.json                # Project dependencies and npm scripts
├── vite.config.ts              # Vite config with /api reverse proxy
├── tailwind.config.js          # Tailwind CSS styling design tokens
├── server/
│   ├── index.js                # Express REST API server
│   ├── db.js                   # SQLite database connection & relational queries
│   └── sampleData.js           # Realistic seed dataset
└── src/
    ├── types/job.ts            # TypeScript interfaces & types
    ├── utils/
    │   ├── api.ts              # Frontend SQLite API client
    │   ├── date.ts             # Date calculations & reminder urgencies
    │   └── storage.ts          # JSON/CSV export and import helpers
    ├── components/
    │   ├── Navbar.tsx          # Navigation header with SQLite live status badge
    │   ├── Dashboard.tsx       # Analytics, conversion rates, and deadline radars
    │   ├── JobOfferList.tsx    # Filterable grid & table job management
    │   ├── KanbanBoard.tsx     # Visual pipeline stage board
    │   ├── RemindersView.tsx   # Overdue, today, and upcoming follow-ups
    │   ├── JobModal.tsx        # Add & Edit modal dialog
    │   ├── JobDetailDrawer.tsx # Rich side drawer with recruiter card & rounds
    │   ├── DataManagementModal.tsx # Export JSON/CSV, import & database reset
    │   └── Toast.tsx           # Action notifications
    ├── App.tsx                 # Main layout & state coordinator
    └── main.tsx                # React entry point
```

---

## 💾 Backup & Data Portability

- **Database Copy**: Simply copy the [`jobs.db`](file:///d:/dossier%20personnel%20Guendouz/develoement/Jobs/jobs.db) file to any USB drive or cloud backup folder.
- **Export from UI**: Click the database icon in the top-right navbar to export:
  - **JSON Backup**: Complete relational structure with interview rounds and notes.
  - **CSV Sheet**: Formatted spreadsheet for Microsoft Excel and Google Sheets.
