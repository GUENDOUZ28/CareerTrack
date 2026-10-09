import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { JobOffer, JobStatus, TabType } from './types/job';
import { 
  fetchJobsApi, 
  saveJobApi, 
  updateJobStatusApi, 
  deleteJobApi, 
  resetDemoApi, 
  clearAllJobsApi, 
  importJobsApi, 
  checkHealthApi 
} from './utils/api';
import { getRelativeDateStatus } from './utils/date';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { JobOfferList } from './components/JobOfferList';
import { KanbanBoard } from './components/KanbanBoard';
import { RemindersView } from './components/RemindersView';
import { JobModal } from './components/JobModal';
import { JobDetailDrawer } from './components/JobDetailDrawer';
import { DataManagementModal } from './components/DataManagementModal';
import { Toast } from './components/Toast';

export function App() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOffer | null>(null);
  const [detailJob, setDetailJob] = useState<JobOffer | null>(null);
  const [defaultNewStatus, setDefaultNewStatus] = useState<JobStatus | undefined>(undefined);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSqliteConnected, setIsSqliteConnected] = useState<boolean>(true);

  // Load jobs from SQLite database on initial render
  useEffect(() => {
    const initData = async () => {
      const health = await checkHealthApi();
      setIsSqliteConnected(health.isConnected);

      const res = await fetchJobsApi();
      setJobs(res.jobs);
      setIsSqliteConnected(res.isFromSqlite);
    };

    initData();
  }, []);

  // Show toast with auto-dismiss
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3500);
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  };

  // Save (Create / Update) Job in SQLite
  const handleSaveJob = async (jobToSave: JobOffer) => {
    try {
      const savedJob = await saveJobApi(jobToSave);
      setJobs(prevJobs => {
        const exists = prevJobs.some(j => j.id === savedJob.id);
        if (exists) {
          showToast(`Updated offer for ${savedJob.company} in SQLite`);
          return prevJobs.map(j => j.id === savedJob.id ? savedJob : j);
        } else {
          showToast(`Saved offer for ${savedJob.company} to SQLite`);
          return [savedJob, ...prevJobs];
        }
      });

      if (savedJob.status === 'Accepted') {
        triggerConfetti();
      }

      setIsModalOpen(false);
      setEditingJob(null);

      // If detail drawer was viewing this job, update it
      if (detailJob && detailJob.id === savedJob.id) {
        setDetailJob(savedJob);
      }
    } catch (err: any) {
      showToast('Error saving job to database');
    }
  };

  // Delete Job from SQLite
  const handleDeleteJob = async (jobId: string) => {
    const jobToDelete = jobs.find(j => j.id === jobId);
    await deleteJobApi(jobId);
    setJobs(prevJobs => prevJobs.filter(j => j.id !== jobId));
    showToast(`Removed offer for ${jobToDelete?.company || 'job'} from SQLite`);

    if (detailJob && detailJob.id === jobId) {
      setDetailJob(null);
    }
  };

  // Update Status directly in SQLite
  const handleUpdateStatus = async (jobId: string, newStatus: JobStatus) => {
    const targetJob = jobs.find(j => j.id === jobId);
    const today = new Date().toISOString().split('T')[0];

    setJobs(prevJobs => prevJobs.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: newStatus,
          updatedAt: today
        };
      }
      return j;
    }));

    await updateJobStatusApi(jobId, newStatus);
    showToast(`Updated ${targetJob?.company || 'Job'} status to "${newStatus}"`);

    if (newStatus === 'Accepted') {
      triggerConfetti();
    }

    // Keep detail view in sync
    if (detailJob && detailJob.id === jobId) {
      setDetailJob(prev => prev ? { ...prev, status: newStatus, updatedAt: today } : null);
    }
  };

  // Open modal to add job
  const handleOpenNewModal = (status?: JobStatus) => {
    setEditingJob(null);
    setDefaultNewStatus(status);
    setIsModalOpen(true);
  };

  // Open modal to edit job
  const handleEditJob = (job: JobOffer) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  // Open detail drawer
  const handleSelectJob = (job: JobOffer) => {
    setDetailJob(job);
  };

  // Data management handlers for SQLite
  const handleResetDemo = async () => {
    const resetList = await resetDemoApi();
    setJobs(resetList);
  };

  const handleClearAll = async () => {
    await clearAllJobsApi();
    setJobs([]);
  };

  const handleImportJobs = async (importedList: JobOffer[]) => {
    const updated = await importJobsApi(importedList);
    setJobs(updated);
  };

  // Calculate urgent reminders for badge
  const urgentRemindersCount = jobs.reduce((count, job) => {
    let jobUrgent = 0;
    // Overdue or today follow-up
    if (job.followUpDate && ['Applied', 'Interview'].includes(job.status)) {
      const status = getRelativeDateStatus(job.followUpDate);
      if (status.isOverdue || status.isToday) jobUrgent++;
    }
    // Overdue or today deadline
    if (job.deadline && ['Saved', 'To Apply'].includes(job.status)) {
      const status = getRelativeDateStatus(job.deadline);
      if (status.isOverdue || status.isToday) jobUrgent++;
    }
    return count + jobUrgent;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenNewModal={() => handleOpenNewModal()}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        totalOffersCount={jobs.length}
        urgentRemindersCount={urgentRemindersCount}
        isSqliteConnected={isSqliteConnected}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <Dashboard
            jobs={jobs}
            onNavigate={setCurrentTab}
            onSelectJob={handleSelectJob}
            onNewJob={() => handleOpenNewModal()}
          />
        )}

        {currentTab === 'offers' && (
          <JobOfferList
            jobs={jobs}
            onSelectJob={handleSelectJob}
            onEditJob={handleEditJob}
            onDeleteJob={handleDeleteJob}
            onUpdateStatus={handleUpdateStatus}
            onNewJob={() => handleOpenNewModal()}
          />
        )}

        {currentTab === 'tracker' && (
          <KanbanBoard
            jobs={jobs}
            onSelectJob={handleSelectJob}
            onUpdateStatus={handleUpdateStatus}
            onNewJobWithStatus={(status) => handleOpenNewModal(status)}
          />
        )}

        {currentTab === 'reminders' && (
          <RemindersView
            jobs={jobs}
            onSelectJob={handleSelectJob}
            onUpdateJob={handleSaveJob}
          />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <p>© 2026 CareerTrack • Backed by local SQLite database (<code>jobs.db</code>)</p>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>SQL Relational Persistence</span>
            <span>•</span>
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="text-indigo-600 hover:underline font-semibold"
            >
              Export / Backup
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSaveJob}
        initialJob={editingJob}
        defaultStatus={defaultNewStatus}
      />

      <JobDetailDrawer
        isOpen={Boolean(detailJob)}
        job={detailJob}
        onClose={() => setDetailJob(null)}
        onEdit={(job) => {
          setDetailJob(null);
          handleEditJob(job);
        }}
        onDelete={handleDeleteJob}
        onUpdateStatus={handleUpdateStatus}
      />

      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        jobs={jobs}
        onDataLoaded={(newJobs) => setJobs(newJobs)}
        showToast={showToast}
        onResetDemo={handleResetDemo}
        onClearAll={handleClearAll}
        onImportJobs={handleImportJobs}
      />

      {/* Toast notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default App;
