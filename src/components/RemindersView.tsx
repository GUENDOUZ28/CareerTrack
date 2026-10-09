import React, { useState } from 'react';
import { JobOffer, ReminderItem } from '../types/job';
import { formatDate, getRelativeDateStatus, addDays, getTodayString } from '../utils/date';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';

interface RemindersViewProps {
  jobs: JobOffer[];
  onSelectJob: (job: JobOffer) => void;
  onUpdateJob: (updatedJob: JobOffer) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  jobs,
  onSelectJob,
  onUpdateJob
}) => {
  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);
    if (permission === 'granted') {
      new Notification('CareerTrack Reminders Active', {
        body: 'You will receive notifications for application deadlines and follow-ups!',
        icon: '💼'
      });
    }
  };

  // Compile all reminder items from jobs
  const reminders: ReminderItem[] = [];

  jobs.forEach(job => {
    // 1. Follow-up Reminders (for Applied or Interview)
    if (job.followUpDate && ['Applied', 'Interview'].includes(job.status)) {
      const rel = getRelativeDateStatus(job.followUpDate);
      reminders.push({
        id: `${job.id}-followup`,
        jobId: job.id,
        company: job.company,
        title: job.title,
        type: 'followup',
        date: job.followUpDate,
        details: `Follow-up on application status${job.recruiter?.name ? ` with ${job.recruiter.name}` : ''}`,
        isOverdue: rel.isOverdue,
        isToday: rel.isToday,
        isUpcoming: rel.isUpcoming,
        daysRemaining: rel.days
      });
    }

    // 2. Application Deadlines (for Saved, To Apply)
    if (job.deadline && ['Saved', 'To Apply'].includes(job.status)) {
      const rel = getRelativeDateStatus(job.deadline);
      reminders.push({
        id: `${job.id}-deadline`,
        jobId: job.id,
        company: job.company,
        title: job.title,
        type: 'deadline',
        date: job.deadline,
        details: 'Submission deadline closes',
        isOverdue: rel.isOverdue,
        isToday: rel.isToday,
        isUpcoming: rel.isUpcoming,
        daysRemaining: rel.days
      });
    }

    // 3. Upcoming Interview Rounds
    job.interviews?.filter(i => !i.completed).forEach(interview => {
      const rel = getRelativeDateStatus(interview.date);
      reminders.push({
        id: `${job.id}-interview-${interview.id}`,
        jobId: job.id,
        company: job.company,
        title: job.title,
        type: 'interview',
        date: interview.date,
        details: `${interview.round}${interview.time ? ` at ${interview.time}` : ''}${interview.interviewer ? ` with ${interview.interviewer}` : ''}`,
        isOverdue: rel.isOverdue,
        isToday: rel.isToday,
        isUpcoming: rel.isUpcoming,
        daysRemaining: rel.days
      });
    });
  });

  // Sort reminders chronologically
  reminders.sort((a, b) => a.daysRemaining - b.daysRemaining);

  const overdueList = reminders.filter(r => r.isOverdue);
  const todayList = reminders.filter(r => r.isToday);
  const upcomingList = reminders.filter(r => !r.isOverdue && !r.isToday && r.daysRemaining <= 7);
  const futureList = reminders.filter(r => !r.isOverdue && !r.isToday && r.daysRemaining > 7);

  // Mark follow-up as done (advance 7 days or clear)
  const handleMarkFollowupDone = (jobId: string, pushDays: number = 7) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    const updated: JobOffer = {
      ...job,
      followUpDate: addDays(getTodayString(), pushDays),
      updatedAt: getTodayString()
    };
    onUpdateJob(updated);
  };

  const handleClearFollowup = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    const updated: JobOffer = {
      ...job,
      followUpDate: '',
      updatedAt: getTodayString()
    };
    onUpdateJob(updated);
  };

  const renderReminderCard = (r: ReminderItem) => {
    const job = jobs.find(j => j.id === r.jobId);
    if (!job) return null;

    const getTypeIcon = () => {
      switch (r.type) {
        case 'followup': return Clock;
        case 'deadline': return Calendar;
        case 'interview': return MessageSquare;
        default: return Bell;
      }
    };

    const Icon = getTypeIcon();

    return (
      <div
        key={r.id}
        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl shrink-0 ${
            r.isOverdue 
              ? 'bg-rose-100 text-rose-700' 
              : r.isToday 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-indigo-50 text-indigo-700'
          }`}>
            <Icon className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-base text-slate-900">{r.company}</span>
              <span className="text-xs text-slate-600 font-medium">— {r.title}</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{r.details}</p>

            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                r.isOverdue 
                  ? 'bg-rose-100 text-rose-700' 
                  : r.isToday 
                  ? 'bg-amber-100 text-amber-800 animate-pulse' 
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {r.isOverdue 
                  ? `${Math.abs(r.daysRemaining)} days overdue` 
                  : r.isToday 
                  ? 'Due Today' 
                  : `In ${r.daysRemaining} days (${formatDate(r.date)})`}
              </span>

              <span className="text-[11px] text-slate-600 capitalize">
                Type: <strong>{r.type}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {r.type === 'followup' && (
            <>
              <button
                onClick={() => handleMarkFollowupDone(r.jobId, 7)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Snooze follow-up by 7 days"
              >
                +7 Days
              </button>
              <button
                onClick={() => handleClearFollowup(r.jobId)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors flex items-center gap-1"
                title="Mark follow-up done"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            </>
          )}

          <button
            onClick={() => onSelectJob(job)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors flex items-center gap-1"
          >
            <span>View Job</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Notifications Opt-in */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Reminders & Follow-Up Center
          </h1>
          <p className="text-sm text-slate-600">
            Never miss an application deadline or leave a recruiter waiting.
          </p>
        </div>

        <div>
          {notificationStatus === 'granted' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Browser Notifications Enabled</span>
            </div>
          ) : (
            <button
              onClick={requestNotificationPermission}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Browser Notifications</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Counts Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-800">
          <span className="text-xs font-medium block">Overdue Items</span>
          <span className="text-2xl font-extrabold mt-1 block">{overdueList.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-800">
          <span className="text-xs font-medium block">Due Today</span>
          <span className="text-2xl font-extrabold mt-1 block">{todayList.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-indigo-800">
          <span className="text-xs font-medium block">Upcoming (Next 7 Days)</span>
          <span className="text-2xl font-extrabold mt-1 block">{upcomingList.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700">
          <span className="text-xs font-medium block">Total Scheduled</span>
          <span className="text-2xl font-extrabold mt-1 block">{reminders.length}</span>
        </div>
      </div>

      {reminders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900">All clear! No pending reminders</h2>
          <p className="text-xs text-slate-600 mt-1">
            You don't have any pending follow-ups or upcoming deadlines right now. When you set a deadline or follow-up date on an offer, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overdue Section */}
          {overdueList.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Overdue ({overdueList.length})</span>
              </h2>
              <div className="space-y-2.5">
                {overdueList.map(renderReminderCard)}
              </div>
            </div>
          )}

          {/* Due Today Section */}
          {todayList.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Due Today ({todayList.length})</span>
              </h2>
              <div className="space-y-2.5">
                {todayList.map(renderReminderCard)}
              </div>
            </div>
          )}

          {/* Upcoming in 7 Days */}
          {upcomingList.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Next 7 Days ({upcomingList.length})</span>
              </h2>
              <div className="space-y-2.5">
                {upcomingList.map(renderReminderCard)}
              </div>
            </div>
          )}

          {/* Future Section */}
          {futureList.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Later ({futureList.length})</span>
              </h2>
              <div className="space-y-2.5">
                {futureList.map(renderReminderCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
