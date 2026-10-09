import React from 'react';
import { JobOffer, JobStatus } from '../types/job';
import { StatusBadge, CVBadge } from './StatusBadge';
import { formatDate, getRelativeDateStatus } from '../utils/date';
import { 
  X, 
  ExternalLink, 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  MessageSquare, 
  Briefcase, 
  FileText,
  Sparkles
} from 'lucide-react';

interface JobDetailDrawerProps {
  job: JobOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (job: JobOffer) => void;
  onDelete: (jobId: string) => void;
  onUpdateStatus: (jobId: string, status: JobStatus) => void;
}

export const JobDetailDrawer: React.FC<JobDetailDrawerProps> = ({
  job,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onUpdateStatus
}) => {
  if (!isOpen || !job) return null;

  const deadlineStatus = job.deadline ? getRelativeDateStatus(job.deadline) : null;
  const followUpStatus = job.followUpDate ? getRelativeDateStatus(job.followUpDate) : null;

  const statuses: JobStatus[] = ['Saved', 'To Apply', 'Applied', 'Interview', 'Accepted', 'Rejected'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <StatusBadge status={job.status} size="md" />
              <CVBadge version={job.cvVersion} size="sm" />
              {job.jobType && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 font-medium">
                  {job.jobType}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
              {job.company}
            </h2>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">
              {job.title}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onEdit(job)}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl border border-slate-200 shadow-xs transition-colors"
              title="Edit Offer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete job offer for ${job.company}?`)) {
                  onDelete(job.id);
                  onClose();
                }
              }}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-white rounded-xl border border-slate-200 shadow-xs transition-colors"
              title="Delete Offer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Status Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Current Stage</span>
              <span className="text-xs text-slate-600">Quickly advance status:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {statuses.map(st => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(job.id, st)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                    job.status === st
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Info Grid (Location, Salary, Link, Dates) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-600" /> Location
              </span>
              <span className="text-xs font-semibold text-slate-800 mt-1 block truncate">
                {job.location || 'Not specified'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-600" /> Salary
              </span>
              <span className="text-xs font-semibold text-emerald-700 mt-1 block truncate">
                {job.salary || 'Not specified'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-600" /> Application Date
              </span>
              <span className="text-xs font-semibold text-slate-800 mt-1 block">
                {formatDate(job.applicationDate)}
              </span>
            </div>
          </div>

          {/* Timeline / Deadlines & Follow-ups */}
          {(job.deadline || job.followUpDate) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {job.deadline && (
                <div className={`p-3.5 rounded-xl border ${
                  deadlineStatus?.isOverdue
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : deadlineStatus?.isToday
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-indigo-50/60 border-indigo-100 text-indigo-900'
                }`}>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Application Deadline</span>
                  </div>
                  <div className="mt-1 text-xs">
                    <span className="font-semibold">{formatDate(job.deadline)}</span>
                    <span className="ml-2 opacity-80">({deadlineStatus?.label})</span>
                  </div>
                </div>
              )}

              {job.followUpDate && (
                <div className={`p-3.5 rounded-xl border ${
                  followUpStatus?.isOverdue
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : followUpStatus?.isToday
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-slate-100/70 border-slate-200 text-slate-800'
                }`}>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Scheduled Follow-up</span>
                  </div>
                  <div className="mt-1 text-xs">
                    <span className="font-semibold">{formatDate(job.followUpDate)}</span>
                    <span className="ml-2 opacity-80">({followUpStatus?.label})</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Direct Link Banner */}
          {job.link && (
            <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <span className="text-[11px] font-bold text-indigo-900 block">Job Listing URL</span>
                <span className="text-xs text-indigo-600 truncate block mt-0.5">{job.link}</span>
              </div>
              <a
                href={job.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shrink-0 shadow-xs transition-colors"
              >
                <span>Open Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Recruiter Contact Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Recruiter Contact Details
              </h3>
            </div>

            {(!job.recruiter?.name && !job.recruiter?.email && !job.recruiter?.phone && !job.recruiter?.linkedin) ? (
              <p className="text-xs text-slate-600 italic">No recruiter contact details recorded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {job.recruiter?.name && (
                  <div>
                    <span className="text-[11px] text-slate-600 block">Name</span>
                    <span className="font-semibold text-slate-900">{job.recruiter.name}</span>
                  </div>
                )}

                {job.recruiter?.email && (
                  <div>
                    <span className="text-[11px] text-slate-600 block">Email</span>
                    <a
                      href={`mailto:${job.recruiter.email}`}
                      className="font-semibold text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{job.recruiter.email}</span>
                    </a>
                  </div>
                )}

                {job.recruiter?.phone && (
                  <div>
                    <span className="text-[11px] text-slate-600 block">Phone</span>
                    <a
                      href={`tel:${job.recruiter.phone}`}
                      className="font-semibold text-slate-800 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{job.recruiter.phone}</span>
                    </a>
                  </div>
                )}

                {job.recruiter?.linkedin && (
                  <div>
                    <span className="text-[11px] text-slate-600 block">LinkedIn</span>
                    <a
                      href={job.recruiter.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Linkedin className="w-3 h-3" />
                      <span>View LinkedIn Profile</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Recruiter Response */}
            {job.recruiterResponse && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">
                  Recruiter Feedback & Response:
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {job.recruiterResponse}
                </p>
              </div>
            )}
          </div>

          {/* Interview Schedule & Rounds */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Interview Rounds ({job.interviews?.length || 0})
                </h3>
              </div>
              <button
                onClick={() => onEdit(job)}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                + Manage Rounds
              </button>
            </div>

            {(!job.interviews || job.interviews.length === 0) ? (
              <p className="text-xs text-slate-600 italic">No interview rounds scheduled yet.</p>
            ) : (
              <div className="space-y-2.5">
                {job.interviews.map((round, idx) => (
                  <div
                    key={round.id}
                    className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                      round.completed
                        ? 'bg-slate-50/70 border-slate-200 text-slate-600'
                        : 'bg-purple-50/50 border-purple-200 text-purple-950 font-medium'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {idx + 1}. {round.round}
                        </span>
                        {round.completed && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-600">
                        <span>Date: {formatDate(round.date)} {round.time ? `at ${round.time}` : ''}</span>
                        {round.interviewer && <span>Interviewer: {round.interviewer}</span>}
                      </div>

                      {round.notes && (
                        <p className="mt-1 text-[11px] text-slate-700 italic">
                          Notes: {round.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Job Description */}
          {job.description && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Job Description
              </h3>
              <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </div>
            </div>
          )}

          {/* Notes & Strategy */}
          {job.notes && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Strategy & Personal Notes
              </h3>
              <div className="text-xs text-slate-700 bg-amber-50/40 p-4 rounded-2xl border border-amber-100 whitespace-pre-wrap leading-relaxed">
                {job.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-600">
            Last updated: {formatDate(job.updatedAt || job.createdAt)}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(job)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Edit Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
