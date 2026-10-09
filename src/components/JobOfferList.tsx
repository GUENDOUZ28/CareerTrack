import React, { useState, useMemo } from 'react';
import { JobOffer, JobStatus, CVVersion } from '../types/job';
import { StatusBadge, CVBadge } from './StatusBadge';
import { formatDate, getRelativeDateStatus } from '../utils/date';
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  LayoutGrid, 
  List, 
  Clock, 
  User, 
  DollarSign, 
  AlertTriangle,
  X,
  SlidersHorizontal
} from 'lucide-react';

interface JobOfferListProps {
  jobs: JobOffer[];
  onSelectJob: (job: JobOffer) => void;
  onEditJob: (job: JobOffer) => void;
  onDeleteJob: (jobId: string) => void;
  onUpdateStatus: (jobId: string, newStatus: JobStatus) => void;
  onNewJob: () => void;
}

export const JobOfferList: React.FC<JobOfferListProps> = ({
  jobs,
  onSelectJob,
  onEditJob,
  onDeleteJob,
  onUpdateStatus,
  onNewJob
}) => {
  // Search & Filters State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [cvFilter, setCvFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'deadline' | 'applicationDate' | 'company' | 'title'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeMenuJobId, setActiveMenuJobId] = useState<string | null>(null);

  // Statuses for filtering
  const statuses: ('All' | JobStatus)[] = ['All', 'Saved', 'To Apply', 'Applied', 'Interview', 'Accepted', 'Rejected'];
  const cvVersions: ('All' | 'ATS CV' | 'Visual CV' | 'Website Portfolio')[] = ['All', 'ATS CV', 'Visual CV', 'Website Portfolio'];

  // Filtered and Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search text (company, title, description, notes, recruiter name)
      if (search.trim()) {
        const query = search.toLowerCase();
        const matches = 
          job.company.toLowerCase().includes(query) ||
          job.title.toLowerCase().includes(query) ||
          (job.description && job.description.toLowerCase().includes(query)) ||
          (job.location && job.location.toLowerCase().includes(query)) ||
          (job.notes && job.notes.toLowerCase().includes(query)) ||
          (job.recruiter?.name && job.recruiter.name.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Status filter
      if (statusFilter !== 'All' && job.status !== statusFilter) {
        return false;
      }

      // CV filter
      if (cvFilter !== 'All' && job.cvVersion !== cvFilter) {
        return false;
      }

      // Location filter
      if (locationFilter.trim() && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (sortBy) {
        case 'company':
          valA = a.company.toLowerCase();
          valB = b.company.toLowerCase();
          break;
        case 'title':
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
          break;
        case 'deadline':
          valA = a.deadline || '9999-99-99';
          valB = b.deadline || '9999-99-99';
          break;
        case 'applicationDate':
          valA = a.applicationDate || '0000-00-00';
          valB = b.applicationDate || '0000-00-00';
          break;
        case 'updatedAt':
        default:
          valA = new Date(a.updatedAt || a.createdAt).getTime();
          valB = new Date(b.updatedAt || b.createdAt).getTime();
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [jobs, search, statusFilter, cvFilter, locationFilter, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setCvFilter('All');
    setLocationFilter('');
  };

  const hasActiveFilters = Boolean(search || statusFilter !== 'All' || cvFilter !== 'All' || locationFilter);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Job Offers Management
          </h1>
          <p className="text-sm text-slate-600">
            Search, filter, and maintain all opportunities and job listings in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle (Grid / Table) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-indigo-600 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' 
                  ? 'bg-white text-indigo-600 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onNewJob}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs shadow-indigo-200 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job Offer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, job title, notes, recruiter..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Quick Filter */}
          <div className="relative md:w-56">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter location (e.g. Remote)"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-700"
            >
              <option value="updatedAt">Recently Updated</option>
              <option value="deadline">Application Deadline</option>
              <option value="applicationDate">Application Date</option>
              <option value="company">Company (A-Z)</option>
              <option value="title">Job Title (A-Z)</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-2.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600"
              title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>
        </div>

        {/* Secondary Filter Badges: Status and CV Version */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Status:
            </span>
            {statuses.map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600 mr-1">CV Used:</span>
            {cvVersions.map(cv => (
              <button
                key={cv}
                onClick={() => setCvFilter(cv)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  cvFilter === cv
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cv}
              </button>
            ))}

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline ml-2"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <span>
          Showing <strong className="text-slate-800 font-semibold">{filteredJobs.length}</strong> of{' '}
          {jobs.length} offers
        </span>
        {hasActiveFilters && (
          <span className="text-indigo-600 font-medium">Filtered results active</span>
        )}
      </div>

      {/* No Results View */}
      {filteredJobs.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-80" />
          <h2 className="text-base font-bold text-slate-900">No matching job offers found</h2>
          <p className="text-xs text-slate-600 mt-1">
            Try adjusting your search criteria, clearing the filters, or adding a new job offer.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium hover:bg-slate-50"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={onNewJob}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
            >
              + Add Job Offer
            </button>
          </div>
        </div>
      )}

      {/* Grid Mode View */}
      {viewMode === 'grid' && filteredJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredJobs.map(job => {
            const deadlineStatus = job.deadline ? getRelativeDateStatus(job.deadline) : null;
            const followUpStatus = job.followUpDate ? getRelativeDateStatus(job.followUpDate) : null;

            return (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
              >
                <div>
                  {/* Top Header: Company, Location, and Status */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <h2 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {job.company}
                      </h2>
                      <p className="text-xs font-medium text-slate-700 truncate mt-0.5">
                        {job.title}
                      </p>
                    </div>

                    <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={job.status}
                        onChange={(e) => onUpdateStatus(job.id, e.target.value as JobStatus)}
                        className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white focus:outline-none cursor-pointer"
                      >
                        {statuses.filter(s => s !== 'All').map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Metadata tags: Location, Salary, CV Version */}
                  <div className="flex flex-wrap items-center gap-1.5 my-3 text-xs">
                    {job.location && (
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        <MapPin className="w-3 h-3 text-slate-600" />
                        <span className="truncate max-w-[120px]">{job.location}</span>
                      </span>
                    )}

                    {job.salary && (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                        <DollarSign className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[120px]">{job.salary}</span>
                      </span>
                    )}

                    <CVBadge version={job.cvVersion} size="sm" />
                  </div>

                  {/* Description snippet if any */}
                  {job.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {job.description}
                    </p>
                  )}

                  {/* Recruiter & Next Action alerts */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                    {/* Follow-up reminder if active */}
                    {job.followUpDate && ['Applied', 'Interview'].includes(job.status) && (
                      <div className={`flex items-center justify-between text-[11px] p-1.5 rounded-lg ${
                        followUpStatus?.isOverdue 
                          ? 'bg-rose-50 text-rose-700 font-semibold' 
                          : followUpStatus?.isToday 
                          ? 'bg-amber-50 text-amber-800 font-semibold' 
                          : 'bg-slate-50 text-slate-600'
                      }`}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Follow-up:
                        </span>
                        <span>{formatDate(job.followUpDate)} ({followUpStatus?.label})</span>
                      </div>
                    )}

                    {/* Deadline reminder if active */}
                    {job.deadline && !['Accepted', 'Rejected'].includes(job.status) && (
                      <div className={`flex items-center justify-between text-[11px] p-1.5 rounded-lg ${
                        deadlineStatus?.isOverdue 
                          ? 'bg-rose-50 text-rose-700' 
                          : deadlineStatus?.isToday 
                          ? 'bg-amber-50 text-amber-800' 
                          : 'bg-slate-50 text-slate-600'
                      }`}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Deadline:
                        </span>
                        <span>{formatDate(job.deadline)} ({deadlineStatus?.label})</span>
                      </div>
                    )}

                    {/* Recruiter Contact info if present */}
                    {job.recruiter?.name && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate">
                        <User className="w-3 h-3 text-slate-600" />
                        <span>Recruiter: <strong className="font-medium text-slate-700">{job.recruiter.name}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Footer: Action links */}
                <div 
                  className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1">
                    {job.link && (
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Open Job Posting Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => onSelectJob(job)}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="View Full Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditJob(job)}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Offer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete the offer for ${job.company}?`)) {
                        onDeleteJob(job.id);
                      }
                    }}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Offer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table Mode View */}
      {viewMode === 'table' && filteredJobs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Company & Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">CV Version</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Location</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Application Date</th>
                  <th className="py-3.5 px-4">Deadline / Next Action</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map(job => {
                  const deadlineStatus = job.deadline ? getRelativeDateStatus(job.deadline) : null;

                  return (
                    <tr
                      key={job.id}
                      onClick={() => onSelectJob(job)}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{job.company}</div>
                        <div className="text-slate-600">{job.title}</div>
                      </td>

                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={job.status}
                          onChange={(e) => onUpdateStatus(job.id, e.target.value as JobStatus)}
                          className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
                        >
                          {statuses.filter(s => s !== 'All').map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <CVBadge version={job.cvVersion} size="sm" />
                      </td>

                      <td className="py-3 px-4 hidden md:table-cell text-slate-600 truncate max-w-[150px]">
                        {job.location || '—'}
                      </td>

                      <td className="py-3 px-4 hidden lg:table-cell text-slate-600">
                        {formatDate(job.applicationDate)}
                      </td>

                      <td className="py-3 px-4">
                        {job.deadline ? (
                          <div>
                            <span className="text-slate-700 font-medium">{formatDate(job.deadline)}</span>
                            <span className={`block text-[10px] ${
                              deadlineStatus?.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-600'
                            }`}>
                              {deadlineStatus?.label}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {job.link && (
                            <a
                              href={job.link}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                              title="External Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => onSelectJob(job)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditJob(job)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete offer for ${job.company}?`)) {
                                onDeleteJob(job.id);
                              }
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
