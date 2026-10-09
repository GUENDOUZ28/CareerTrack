import React from 'react';
import { JobOffer, TabType } from '../types/job';
import { StatusBadge, CVBadge } from './StatusBadge';
import { formatDate, getRelativeDateStatus } from '../utils/date';
import { 
  Briefcase, 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Calendar, 
  TrendingUp,
  FileCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  jobs: JobOffer[];
  onNavigate: (tab: TabType) => void;
  onSelectJob: (job: JobOffer) => void;
  onNewJob: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  jobs,
  onNavigate,
  onSelectJob,
  onNewJob
}) => {
  // Statistics calculations
  const totalOffers = jobs.length;
  
  // Applications sent: anything moved past "Saved" or "To Apply", or where applicationDate is filled
  const sentJobs = jobs.filter(
    j => ['Applied', 'Interview', 'Accepted', 'Rejected'].includes(j.status) || Boolean(j.applicationDate)
  );
  const totalSent = sentJobs.length;

  const interviewJobs = jobs.filter(j => j.status === 'Interview');
  const acceptedJobs = jobs.filter(j => j.status === 'Accepted');

  // Follow-up calculations
  const pendingFollowups = jobs.filter(j => {
    if (!j.followUpDate) return false;
    // Follow ups are pending if status is Applied or Interview
    return ['Applied', 'Interview'].includes(j.status);
  });

  const overdueFollowups = pendingFollowups.filter(j => {
    const status = getRelativeDateStatus(j.followUpDate);
    return status.isOverdue;
  });

  const todayFollowups = pendingFollowups.filter(j => {
    const status = getRelativeDateStatus(j.followUpDate);
    return status.isToday;
  });

  // Upcoming application deadlines (status: Saved or To Apply)
  const upcomingDeadlines = jobs.filter(j => {
    if (!j.deadline) return false;
    if (['Accepted', 'Rejected'].includes(j.status)) return false;
    const diff = getRelativeDateStatus(j.deadline);
    return diff.days >= 0 && diff.days <= 7;
  });

  // Status breakdown
  const statusCounts: Record<string, number> = {
    'Saved': jobs.filter(j => j.status === 'Saved').length,
    'To Apply': jobs.filter(j => j.status === 'To Apply').length,
    'Applied': jobs.filter(j => j.status === 'Applied').length,
    'Interview': jobs.filter(j => j.status === 'Interview').length,
    'Accepted': jobs.filter(j => j.status === 'Accepted').length,
    'Rejected': jobs.filter(j => j.status === 'Rejected').length,
  };

  // CV Version performance analytics
  const cvVersions = ['ATS CV', 'Visual CV', 'Website Portfolio'];
  const cvStats = cvVersions.map(cv => {
    const totalWithCV = jobs.filter(j => j.cvVersion === cv).length;
    const sentWithCV = jobs.filter(j => j.cvVersion === cv && ['Applied', 'Interview', 'Accepted', 'Rejected'].includes(j.status)).length;
    const interviewsWithCV = jobs.filter(j => j.cvVersion === cv && ['Interview', 'Accepted'].includes(j.status)).length;
    const conversionRate = sentWithCV > 0 ? Math.round((interviewsWithCV / sentWithCV) * 100) : 0;
    return {
      name: cv,
      total: totalWithCV,
      sent: sentWithCV,
      interviews: interviewsWithCV,
      conversionRate
    };
  });

  // Interview rate (% of sent that led to interview or offer)
  const interviewConversionRate = totalSent > 0 
    ? Math.round(((interviewJobs.length + acceptedJobs.length) / totalSent) * 100) 
    : 0;

  // Recent jobs (sorted by updatedAt)
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome & Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-indigo-100 mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            Job Hunting Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Your Career Pipeline Dashboard
          </h1>
          <p className="mt-1 text-sm sm:text-base text-indigo-100/90 max-w-xl">
            Track applications, monitor recruiter follow-ups, and measure which CV version yields the most interviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('tracker')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all backdrop-blur-sm"
          >
            Open Kanban Board
          </button>
          <button
            onClick={onNewJob}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            + Add New Job
          </button>
        </div>
      </div>

      {/* Urgent Reminders Alert Banner if any */}
      {(overdueFollowups.length > 0 || todayFollowups.length > 0) && (
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-amber-900 text-sm sm:text-base">
                Action Required: Follow-up Reminders
              </h2>
              <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
                {overdueFollowups.length > 0 && (
                  <span className="font-medium text-rose-700 mr-2">
                    {overdueFollowups.length} overdue follow-up{overdueFollowups.length > 1 ? 's' : ''}!
                  </span>
                )}
                {todayFollowups.length > 0 && (
                  <span>
                    {todayFollowups.length} follow-up{todayFollowups.length > 1 ? 's' : ''} scheduled for today.
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('reminders')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <span>Review Reminders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Offers */}
        <div 
          onClick={() => onNavigate('offers')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Offers</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalOffers}</span>
            <span className="text-xs text-slate-600">tracked</span>
          </div>
          <div className="mt-2 text-xs text-indigo-600 font-medium flex items-center gap-1 group-hover:underline">
            <span>View all offers</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Applications Sent */}
        <div 
          onClick={() => onNavigate('tracker')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Applications Sent</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalSent}</span>
            <span className="text-xs text-slate-600">
              {totalOffers > 0 ? `${Math.round((totalSent / totalOffers) * 100)}% of total` : ''}
            </span>
          </div>
          <div className="mt-2 text-xs text-blue-600 font-medium flex items-center gap-1 group-hover:underline">
            <span>Track pipeline</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Interviews Active */}
        <div 
          onClick={() => onNavigate('tracker')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Interviews</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-700">{interviewJobs.length}</span>
            <span className="text-xs font-medium text-purple-600">active rounds</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>{interviewConversionRate}% interview rate</span>
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div 
          onClick={() => onNavigate('reminders')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Pending Follow-ups</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{pendingFollowups.length}</span>
            {overdueFollowups.length > 0 && (
              <span className="text-xs font-semibold text-rose-600">
                ({overdueFollowups.length} overdue)
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-amber-600 font-medium flex items-center gap-1 group-hover:underline">
            <span>Manage reminders</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Middle Row: Pipeline Stages & CV Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Stage Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Application Pipeline Funnel</h2>
              <p className="text-xs text-slate-600">Distribution of your offers across progression stages</p>
            </div>
            <button
              onClick={() => onNavigate('tracker')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View Kanban</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Saved', count: statusCounts['Saved'], color: 'bg-slate-400', textColor: 'text-slate-600' },
              { label: 'To Apply', count: statusCounts['To Apply'], color: 'bg-amber-500', textColor: 'text-amber-700' },
              { label: 'Applied', count: statusCounts['Applied'], color: 'bg-blue-500', textColor: 'text-blue-700' },
              { label: 'Interview', count: statusCounts['Interview'], color: 'bg-purple-500', textColor: 'text-purple-700' },
              { label: 'Accepted', count: statusCounts['Accepted'], color: 'bg-emerald-500', textColor: 'text-emerald-700' },
              { label: 'Rejected', count: statusCounts['Rejected'], color: 'bg-rose-400', textColor: 'text-rose-700' },
            ].map(stage => {
              const percentage = totalOffers > 0 ? Math.round((stage.count / totalOffers) * 100) : 0;
              return (
                <div key={stage.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{stage.label}</span>
                    <span className="text-slate-600">
                      <strong className={stage.textColor}>{stage.count}</strong> ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, stage.count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Insights Row */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50">
              <span className="block text-[11px] text-slate-600 font-medium">Offers Received</span>
              <span className="text-lg font-bold text-emerald-600">{acceptedJobs.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50">
              <span className="block text-[11px] text-slate-600 font-medium">Active Interview Rate</span>
              <span className="text-lg font-bold text-purple-600">{interviewConversionRate}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 col-span-2 sm:col-span-1">
              <span className="block text-[11px] text-slate-600 font-medium">Upcoming Deadlines</span>
              <span className="text-lg font-bold text-amber-600">{upcomingDeadlines.length}</span>
            </div>
          </div>
        </div>

        {/* CV Version Performance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">CV Performance</h2>
                <p className="text-xs text-slate-600">Which resume format generates interviews</p>
              </div>
              <FileCheck className="w-5 h-5 text-indigo-500" />
            </div>

            <div className="space-y-4">
              {cvStats.map(stat => (
                <div key={stat.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <CVBadge version={stat.name} size="sm" />
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {stat.conversionRate}% interviews
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-slate-600 block">Total</span>
                      <span className="font-semibold text-slate-800">{stat.total}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-600 block">Sent</span>
                      <span className="font-semibold text-slate-800">{stat.sent}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-600 block">Interviews</span>
                      <span className="font-semibold text-purple-700">{stat.interviews}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            Tip: Tailor between ATS CV for portals and Visual CV for direct founder outreach.
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Deadlines & Recent Job Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines & Interviews Widget */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Upcoming Deadlines (7 Days)</h2>
            </div>
            <button
              onClick={() => onNavigate('reminders')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              All
            </button>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div className="py-8 text-center text-slate-600">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2 opacity-60" />
              <p className="text-xs font-medium">No application deadlines in the next 7 days.</p>
              <p className="text-[11px] text-slate-600 mt-0.5">You're completely on schedule!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.slice(0, 4).map(job => {
                const dateStatus = getRelativeDateStatus(job.deadline);
                return (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <h3 className="font-semibold text-xs text-slate-900 truncate">{job.company}</h3>
                      <p className="text-[11px] text-slate-600 truncate">{job.title}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        dateStatus.isToday 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {dateStatus.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Applications / Jobs */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
              <p className="text-xs text-slate-600">Latest updated job applications</p>
            </div>
            <button
              onClick={() => onNavigate('offers')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View all ({totalOffers})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentJobs.length === 0 ? (
            <div className="py-8 text-center text-slate-600">
              <p className="text-xs">No job applications recorded yet.</p>
              <button
                onClick={onNewJob}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
              >
                + Add your first job offer
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-600">
                    <th className="pb-2 font-medium">Company & Role</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium hidden sm:table-cell">CV Used</th>
                    <th className="pb-2 font-medium hidden md:table-cell">Application Date</th>
                    <th className="pb-2 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentJobs.map(job => (
                    <tr 
                      key={job.id}
                      onClick={() => onSelectJob(job)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 pr-3">
                        <div className="font-semibold text-slate-900">{job.company}</div>
                        <div className="text-slate-600 truncate max-w-[160px] sm:max-w-xs">{job.title}</div>
                      </td>
                      <td className="py-3 pr-3">
                        <StatusBadge status={job.status} size="sm" />
                      </td>
                      <td className="py-3 pr-3 hidden sm:table-cell">
                        <CVBadge version={job.cvVersion} size="sm" />
                      </td>
                      <td className="py-3 pr-3 hidden md:table-cell text-slate-600">
                        {formatDate(job.applicationDate)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectJob(job);
                          }}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
