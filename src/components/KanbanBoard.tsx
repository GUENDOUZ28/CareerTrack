import React from 'react';
import { JobOffer, JobStatus } from '../types/job';
import { CVBadge } from './StatusBadge';
import { formatDate, getRelativeDateStatus } from '../utils/date';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  User, 
  DollarSign,
  Briefcase
} from 'lucide-react';

interface KanbanBoardProps {
  jobs: JobOffer[];
  onSelectJob: (job: JobOffer) => void;
  onUpdateStatus: (jobId: string, newStatus: JobStatus) => void;
  onNewJobWithStatus: (status: JobStatus) => void;
}

interface ColumnConfig {
  id: JobStatus;
  title: string;
  badgeBg: string;
  badgeText: string;
  headerBorder: string;
  columnBg: string;
  description: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'Saved',
    title: 'Saved',
    badgeBg: 'bg-slate-200',
    badgeText: 'text-slate-700',
    headerBorder: 'border-slate-300',
    columnBg: 'bg-slate-100/60',
    description: 'Bookmarked roles & opportunities'
  },
  {
    id: 'To Apply',
    title: 'To Apply',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    headerBorder: 'border-amber-400',
    columnBg: 'bg-amber-50/40',
    description: 'Tailoring CV and cover letter'
  },
  {
    id: 'Applied',
    title: 'Applied',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    headerBorder: 'border-blue-400',
    columnBg: 'bg-blue-50/40',
    description: 'Application submitted, awaiting reply'
  },
  {
    id: 'Interview',
    title: 'Interview',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    headerBorder: 'border-purple-400',
    columnBg: 'bg-purple-50/40',
    description: 'Screening, technical, or final rounds'
  },
  {
    id: 'Accepted',
    title: 'Accepted',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    headerBorder: 'border-emerald-400',
    columnBg: 'bg-emerald-50/40',
    description: 'Job offers received!'
  },
  {
    id: 'Rejected',
    title: 'Rejected',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    headerBorder: 'border-rose-300',
    columnBg: 'bg-rose-50/30',
    description: 'Archived for future reference'
  }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  jobs,
  onSelectJob,
  onUpdateStatus,
  onNewJobWithStatus
}) => {
  const getPrevStatus = (current: JobStatus): JobStatus | null => {
    const idx = COLUMNS.findIndex(c => c.id === current);
    return idx > 0 ? COLUMNS[idx - 1].id : null;
  };

  const getNextStatus = (current: JobStatus): JobStatus | null => {
    const idx = COLUMNS.findIndex(c => c.id === current);
    return idx < COLUMNS.length - 1 ? COLUMNS[idx + 1].id : null;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Application Pipeline Tracker
          </h1>
          <p className="text-sm text-slate-600">
            Visual stage progression. Track every application from saved bookmark to offer acceptance.
          </p>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x items-start">
        {COLUMNS.map(column => {
          const columnJobs = jobs.filter(j => j.status === column.id);

          return (
            <div
              key={column.id}
              className={`w-72 sm:w-80 shrink-0 rounded-2xl border border-slate-200/90 ${column.columnBg} p-3 flex flex-col max-h-[calc(100vh-190px)] snap-start`}
            >
              {/* Column Header */}
              <div className={`pb-3 mb-3 border-b-2 ${column.headerBorder} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm text-slate-900">{column.title}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${column.badgeBg} ${column.badgeText}`}>
                    {columnJobs.length}
                  </span>
                </div>

                <button
                  onClick={() => onNewJobWithStatus(column.id)}
                  className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-indigo-600 transition-colors"
                  title={`Add offer in ${column.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Column Cards List */}
              <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                {columnJobs.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl bg-white/40">
                    <p className="text-xs text-slate-600">No jobs in this stage</p>
                    <button
                      onClick={() => onNewJobWithStatus(column.id)}
                      className="mt-1.5 text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      + Add offer
                    </button>
                  </div>
                ) : (
                  columnJobs.map(job => {
                    const prevStatus = getPrevStatus(job.status);
                    const nextStatus = getNextStatus(job.status);
                    const deadlineStatus = job.deadline ? getRelativeDateStatus(job.deadline) : null;
                    const followUpStatus = job.followUpDate ? getRelativeDateStatus(job.followUpDate) : null;
                    const nextInterview = job.interviews?.find(i => !i.completed);

                    return (
                      <div
                        key={job.id}
                        onClick={() => onSelectJob(job)}
                        className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
                      >
                        {/* Company & Role */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {job.company}
                            </h3>
                            <p className="text-xs font-medium text-slate-700">
                              {job.title}
                            </p>
                          </div>
                        </div>

                        {/* Badges: CV Version & Salary */}
                        <div className="flex flex-wrap items-center gap-1.5 my-2">
                          <CVBadge version={job.cvVersion} size="sm" />
                          {job.salary && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 flex items-center">
                              <DollarSign className="w-2.5 h-2.5" />
                              {job.salary}
                            </span>
                          )}
                        </div>

                        {/* Location */}
                        {job.location && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-2 truncate">
                            <MapPin className="w-3 h-3 text-slate-600 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                        )}

                        {/* Next key date alerts */}
                        <div className="space-y-1 my-2">
                          {/* Interview round upcoming */}
                          {nextInterview && (
                            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 text-[11px]">
                              <div className="flex items-center gap-1 font-semibold truncate">
                                <MessageSquare className="w-3 h-3" />
                                <span className="truncate">{nextInterview.round}</span>
                              </div>
                              <div className="text-[10px] text-purple-600 mt-0.5">
                                {formatDate(nextInterview.date)} {nextInterview.time ? `at ${nextInterview.time}` : ''}
                              </div>
                            </div>
                          )}

                          {/* Follow-up alert */}
                          {job.followUpDate && ['Applied', 'Interview'].includes(job.status) && (
                            <div className={`text-[10px] p-1 rounded-md flex items-center justify-between ${
                              followUpStatus?.isOverdue 
                                ? 'bg-rose-50 text-rose-700 font-bold' 
                                : followUpStatus?.isToday 
                                ? 'bg-amber-50 text-amber-800 font-bold' 
                                : 'text-slate-600'
                            }`}>
                              <span className="flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> Follow-up:
                              </span>
                              <span>{formatDate(job.followUpDate)}</span>
                            </div>
                          )}

                          {/* Deadline alert */}
                          {job.deadline && ['Saved', 'To Apply'].includes(job.status) && (
                            <div className={`text-[10px] p-1 rounded-md flex items-center justify-between ${
                              deadlineStatus?.isOverdue 
                                ? 'bg-rose-50 text-rose-700 font-bold' 
                                : deadlineStatus?.isToday 
                                ? 'bg-amber-50 text-amber-800 font-bold' 
                                : 'text-slate-600'
                            }`}>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5" /> Deadline:
                              </span>
                              <span>{formatDate(job.deadline)}</span>
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Quick Stage Advancement Buttons */}
                        <div 
                          className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            {prevStatus ? (
                              <button
                                onClick={() => onUpdateStatus(job.id, prevStatus)}
                                className="inline-flex items-center gap-0.5 text-[11px] font-medium text-slate-600 hover:text-slate-800 p-1 rounded hover:bg-slate-100 transition-colors"
                                title={`Move backward to ${prevStatus}`}
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Back</span>
                              </button>
                            ) : <span />}
                          </div>

                          <div>
                            {nextStatus && (
                              <button
                                onClick={() => onUpdateStatus(job.id, nextStatus)}
                                className="inline-flex items-center gap-0.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 transition-colors"
                                title={`Advance stage to ${nextStatus}`}
                              >
                                <span>{nextStatus}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
