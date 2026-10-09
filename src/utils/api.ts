import { JobOffer, JobStatus } from '../types/job';
import { loadJobs, saveJobs, resetToDemoData, clearAllData } from './storage';

const API_BASE = '/api';

/**
 * Check backend and SQLite health status
 */
export const checkHealthApi = async (): Promise<{ isConnected: boolean; count: number; database: string }> => {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Health check failed');
    const data = await res.json();
    return { isConnected: true, count: data.jobsCount, database: data.database || 'sqlite' };
  } catch (e) {
    return { isConnected: false, count: loadJobs().length, database: 'localStorage (fallback)' };
  }
};

/**
 * Fetch all job offers from SQLite database (with fallback)
 */
export const fetchJobsApi = async (): Promise<{ jobs: JobOffer[]; isFromSqlite: boolean }> => {
  try {
    const res = await fetch(`${API_BASE}/jobs`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      // Also cache in localStorage for instant offline access
      saveJobs(data);
      return { jobs: data, isFromSqlite: true };
    }
    throw new Error('Response is not an array');
  } catch (err) {
    console.warn('Backend unavailable, falling back to local storage cache:', err);
    return { jobs: loadJobs(), isFromSqlite: false };
  }
};

/**
 * Save (create or update) job offer to SQLite
 */
export const saveJobApi = async (job: JobOffer): Promise<JobOffer> => {
  try {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    if (!res.ok) throw new Error(`Save failed with status ${res.status}`);
    const saved = await res.json();
    return saved;
  } catch (err) {
    console.warn('Backend save failed, updating local storage cache:', err);
    const local = loadJobs();
    const exists = local.some(j => j.id === job.id);
    const updated = exists ? local.map(j => j.id === job.id ? job : j) : [job, ...local];
    saveJobs(updated);
    return job;
  }
};

/**
 * Fast status update in SQLite
 */
export const updateJobStatusApi = async (jobId: string, status: JobStatus): Promise<void> => {
  try {
    await fetch(`${API_BASE}/jobs/${encodeURIComponent(jobId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch (err) {
    console.warn('Backend status update failed, saving locally:', err);
  }
};

/**
 * Delete job from SQLite
 */
export const deleteJobApi = async (jobId: string): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(jobId)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Delete failed with status ${res.status}`);
  } catch (err) {
    console.warn('Backend delete failed, removing locally:', err);
    const local = loadJobs().filter(j => j.id !== jobId);
    saveJobs(local);
  }
};

/**
 * Reset SQLite to demo dataset
 */
export const resetDemoApi = async (): Promise<JobOffer[]> => {
  try {
    const res = await fetch(`${API_BASE}/jobs/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Reset failed');
    const data = await res.json();
    saveJobs(data.jobs);
    return data.jobs;
  } catch (err) {
    console.warn('Backend reset failed, resetting locally:', err);
    return resetToDemoData();
  }
};

/**
 * Clear all jobs from SQLite
 */
export const clearAllJobsApi = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE}/jobs/clear`, { method: 'POST' });
  } catch (err) {
    console.warn('Backend clear failed, clearing locally:', err);
    clearAllData();
  }
};

/**
 * Bulk import jobs into SQLite
 */
export const importJobsApi = async (jobs: JobOffer[]): Promise<JobOffer[]> => {
  try {
    const res = await fetch(`${API_BASE}/jobs/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobs })
    });
    if (!res.ok) throw new Error('Import failed');
    const data = await res.json();
    saveJobs(data.jobs);
    return data.jobs;
  } catch (err) {
    console.warn('Backend import failed, importing locally:', err);
    saveJobs(jobs);
    return jobs;
  }
};
