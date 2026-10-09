import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { 
  getAllJobs, 
  getJobById, 
  saveJob, 
  deleteJob, 
  updateJobStatus, 
  resetToDemoData, 
  clearAllData, 
  importJobs, 
  seedIfEmpty 
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Seed initial data if database is empty
seedIfEmpty();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check & DB stats
app.get('/api/health', (req, res) => {
  try {
    const jobs = getAllJobs();
    res.json({
      status: 'ok',
      database: 'sqlite',
      version: 'SQLite 3 via node:sqlite',
      jobsCount: jobs.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all jobs
app.get('/api/jobs', (req, res) => {
  try {
    const jobs = getAllJobs();
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Failed to fetch job offers from database' });
  }
});

// GET job by ID
app.get('/api/jobs/:id', (req, res) => {
  try {
    const job = getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job offer not found' });
    }
    res.json(job);
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ error: 'Failed to fetch job offer' });
  }
});

// POST create job
app.post('/api/jobs', (req, res) => {
  try {
    const jobData = req.body;
    if (!jobData.company || !jobData.title) {
      return res.status(400).json({ error: 'Company and title are required' });
    }
    const saved = saveJob(jobData);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: 'Failed to save job offer' });
  }
});

// PUT update job
app.put('/api/jobs/:id', (req, res) => {
  try {
    const jobData = { ...req.body, id: req.params.id };
    if (!jobData.company || !jobData.title) {
      return res.status(400).json({ error: 'Company and title are required' });
    }
    const saved = saveJob(jobData);
    res.json(saved);
  } catch (err) {
    console.error('Error updating job:', err);
    res.status(500).json({ error: 'Failed to update job offer' });
  }
});

// PATCH update status
app.patch('/api/jobs/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = updateJobStatus(req.params.id, status);
    res.json(updated);
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE job
app.delete('/api/jobs/:id', (req, res) => {
  try {
    deleteJob(req.params.id);
    res.json({ success: true, message: 'Job offer deleted' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ error: 'Failed to delete job offer' });
  }
});

// POST reset to demo data
app.post('/api/jobs/reset', (req, res) => {
  try {
    const jobs = resetToDemoData();
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    console.error('Error resetting demo data:', err);
    res.status(500).json({ error: 'Failed to reset demo data' });
  }
});

// POST clear all data
app.post('/api/jobs/clear', (req, res) => {
  try {
    clearAllData();
    res.json({ success: true, message: 'All job offers deleted' });
  } catch (err) {
    console.error('Error clearing data:', err);
    res.status(500).json({ error: 'Failed to clear database' });
  }
});

// POST bulk import
app.post('/api/jobs/import', (req, res) => {
  try {
    const { jobs } = req.body;
    if (!Array.isArray(jobs)) {
      return res.status(400).json({ error: 'Expected an array of jobs' });
    }
    const updatedJobs = importJobs(jobs);
    res.json({ success: true, count: updatedJobs.length, jobs: updatedJobs });
  } catch (err) {
    console.error('Error importing jobs:', err);
    res.status(500).json({ error: 'Failed to import jobs' });
  }
});

const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.resolve(distPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`🚀 SQLite API Server running on http://localhost:${PORT}`);
  console.log(`📂 SQLite database file: ${path.resolve(__dirname, '../jobs.db')}`);
});
