import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSampleJobs, getTodayString } from './sampleData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../jobs.db');

export const db = new DatabaseSync(DB_PATH);

// Initialize schema and enable pragmas
db.exec(`
  PRAGMA foreign_keys = ON;
  
  CREATE TABLE IF NOT EXISTS job_offers (
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

  CREATE TABLE IF NOT EXISTS interviews (
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

  CREATE INDEX IF NOT EXISTS idx_jobs_status ON job_offers(status);
  CREATE INDEX IF NOT EXISTS idx_jobs_company ON job_offers(company);
  CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON job_offers(deadline);
  CREATE INDEX IF NOT EXISTS idx_interviews_job ON interviews(job_id);
`);

// Row mapper helper
const mapRowToJob = (row, interviews = []) => {
  return {
    id: row.id,
    company: row.company,
    title: row.title,
    description: row.description || '',
    location: row.location || '',
    link: row.link || '',
    deadline: row.deadline || '',
    status: row.status,
    cvVersion: row.cv_version,
    applicationDate: row.application_date || '',
    followUpDate: row.follow_up_date || '',
    recruiter: {
      name: row.recruiter_name || '',
      email: row.recruiter_email || '',
      phone: row.recruiter_phone || '',
      linkedin: row.recruiter_linkedin || ''
    },
    notes: row.notes || '',
    recruiterResponse: row.recruiter_response || '',
    interviews: interviews.map(i => ({
      id: i.id,
      round: i.round,
      date: i.date,
      time: i.time || '',
      interviewer: i.interviewer || '',
      notes: i.notes || '',
      completed: Boolean(i.completed)
    })),
    salary: row.salary || '',
    jobType: row.job_type || 'Full-time',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

/**
 * Get all job offers with nested interview rounds
 */
export const getAllJobs = () => {
  const jobs = db.prepare('SELECT * FROM job_offers ORDER BY updated_at DESC, created_at DESC').all();
  const allInterviews = db.prepare('SELECT * FROM interviews ORDER BY date ASC').all();

  // Group interviews by job_id
  const interviewMap = new Map();
  for (const item of allInterviews) {
    if (!interviewMap.has(item.job_id)) {
      interviewMap.set(item.job_id, []);
    }
    interviewMap.get(item.job_id).push(item);
  }

  return jobs.map(row => mapRowToJob(row, interviewMap.get(row.id) || []));
};

/**
 * Get single job offer by ID
 */
export const getJobById = (id) => {
  const job = db.prepare('SELECT * FROM job_offers WHERE id = ?').get(id);
  if (!job) return null;
  const interviews = db.prepare('SELECT * FROM interviews WHERE job_id = ? ORDER BY date ASC').all(id);
  return mapRowToJob(job, interviews);
};

/**
 * Save (Insert or Replace) job offer and its interview rounds
 */
export const saveJob = (job) => {
  const today = getTodayString();
  const id = job.id || `job-${Date.now()}`;
  const createdAt = job.createdAt || today;
  const updatedAt = today;

  db.exec('BEGIN TRANSACTION');
  try {
    const upsertJob = db.prepare(`
      INSERT INTO job_offers (
        id, company, title, description, location, link, deadline, status,
        cv_version, application_date, follow_up_date, recruiter_name, recruiter_email,
        recruiter_phone, recruiter_linkedin, notes, recruiter_response, salary, job_type,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?
      )
      ON CONFLICT(id) DO UPDATE SET
        company = excluded.company,
        title = excluded.title,
        description = excluded.description,
        location = excluded.location,
        link = excluded.link,
        deadline = excluded.deadline,
        status = excluded.status,
        cv_version = excluded.cv_version,
        application_date = excluded.application_date,
        follow_up_date = excluded.follow_up_date,
        recruiter_name = excluded.recruiter_name,
        recruiter_email = excluded.recruiter_email,
        recruiter_phone = excluded.recruiter_phone,
        recruiter_linkedin = excluded.recruiter_linkedin,
        notes = excluded.notes,
        recruiter_response = excluded.recruiter_response,
        salary = excluded.salary,
        job_type = excluded.job_type,
        updated_at = excluded.updated_at;
    `);

    upsertJob.run(
      id,
      job.company,
      job.title,
      job.description || '',
      job.location || '',
      job.link || '',
      job.deadline || '',
      job.status || 'Saved',
      job.cvVersion || 'ATS CV',
      job.applicationDate || '',
      job.followUpDate || '',
      job.recruiter?.name || '',
      job.recruiter?.email || '',
      job.recruiter?.phone || '',
      job.recruiter?.linkedin || '',
      job.notes || '',
      job.recruiterResponse || '',
      job.salary || '',
      job.jobType || 'Full-time',
      createdAt,
      updatedAt
    );

    // Replace interview rounds
    db.prepare('DELETE FROM interviews WHERE job_id = ?').run(id);

    if (Array.isArray(job.interviews) && job.interviews.length > 0) {
      const insertInterview = db.prepare(`
        INSERT INTO interviews (id, job_id, round, date, time, interviewer, notes, completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const round of job.interviews) {
        insertInterview.run(
          round.id || `round-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          id,
          round.round || 'Interview Round',
          round.date || today,
          round.time || '',
          round.interviewer || '',
          round.notes || '',
          round.completed ? 1 : 0
        );
      }
    }

    db.exec('COMMIT');
    return getJobById(id);
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
};

/**
 * Delete a job offer
 */
export const deleteJob = (id) => {
  db.exec('BEGIN TRANSACTION');
  try {
    db.prepare('DELETE FROM interviews WHERE job_id = ?').run(id);
    const result = db.prepare('DELETE FROM job_offers WHERE id = ?').run(id);
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
};

/**
 * Quick status update
 */
export const updateJobStatus = (id, status) => {
  const today = getTodayString();
  db.prepare('UPDATE job_offers SET status = ?, updated_at = ? WHERE id = ?').run(status, today, id);
  return getJobById(id);
};

/**
 * Reset database to sample dataset
 */
export const resetToDemoData = () => {
  const sampleJobs = getSampleJobs();
  db.exec('BEGIN TRANSACTION');
  try {
    db.prepare('DELETE FROM interviews').run();
    db.prepare('DELETE FROM job_offers').run();
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  for (const job of sampleJobs) {
    saveJob(job);
  }

  return getAllJobs();
};

/**
 * Clear all data
 */
export const clearAllData = () => {
  db.exec('BEGIN TRANSACTION');
  try {
    db.prepare('DELETE FROM interviews').run();
    db.prepare('DELETE FROM job_offers').run();
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return [];
};

/**
 * Bulk import jobs list
 */
export const importJobs = (jobsList) => {
  for (const job of jobsList) {
    if (job && job.company && job.title) {
      saveJob(job);
    }
  }
  return getAllJobs();
};

/**
 * Seed initial sample data if SQLite database is completely empty
 */
export const seedIfEmpty = () => {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM job_offers').get();
  if (countRow.count === 0) {
    console.log('📦 Seeding SQLite database with initial sample job offers...');
    const sampleJobs = getSampleJobs();
    for (const job of sampleJobs) {
      saveJob(job);
    }
    console.log(`✅ Seeded ${sampleJobs.length} job offers into SQLite database (${DB_PATH})`);
  } else {
    console.log(`📊 SQLite database connected: ${countRow.count} job offers found.`);
  }
};
