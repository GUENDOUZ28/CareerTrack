import React, { useState, useEffect } from 'react';
import { JobOffer, JobStatus, CVVersion, InterviewRound } from '../types/job';
import { getTodayString, addDays } from '../utils/date';
import { 
  X, 
  Briefcase, 
  Building, 
  MapPin, 
  Globe, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  FileText, 
  Plus, 
  Trash2, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: JobOffer) => void;
  initialJob?: JobOffer | null;
  defaultStatus?: JobStatus;
}

export const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialJob,
  defaultStatus
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'application' | 'recruiter' | 'interviews' | 'notes'>('info');

  // Form State
  const [formData, setFormData] = useState<JobOffer>({
    id: '',
    company: '',
    title: '',
    description: '',
    location: '',
    link: '',
    deadline: '',
    status: defaultStatus || 'Saved',
    cvVersion: 'ATS CV',
    applicationDate: '',
    followUpDate: '',
    recruiter: {
      name: '',
      email: '',
      phone: '',
      linkedin: ''
    },
    notes: '',
    recruiterResponse: '',
    interviews: [],
    salary: '',
    jobType: 'Full-time',
    createdAt: '',
    updatedAt: ''
  });

  const [errors, setErrors] = useState<{ company?: string; title?: string }>({});

  useEffect(() => {
    if (initialJob) {
      setFormData(initialJob);
    } else {
      setFormData({
        id: `job-${Date.now()}`,
        company: '',
        title: '',
        description: '',
        location: '',
        link: '',
        deadline: '',
        status: defaultStatus || 'Saved',
        cvVersion: 'ATS CV',
        applicationDate: defaultStatus === 'Applied' ? getTodayString() : '',
        followUpDate: defaultStatus === 'Applied' ? addDays(getTodayString(), 7) : '',
        recruiter: {
          name: '',
          email: '',
          phone: '',
          linkedin: ''
        },
        notes: '',
        recruiterResponse: '',
        interviews: [],
        salary: '',
        jobType: 'Full-time',
        createdAt: getTodayString(),
        updatedAt: getTodayString()
      });
    }
    setErrors({});
    setActiveTab('info');
  }, [initialJob, defaultStatus, isOpen]);

  if (!isOpen) return null;

  // Handle status change intelligent auto-fill
  const handleStatusChange = (newStatus: JobStatus) => {
    setFormData(prev => {
      const updated = { ...prev, status: newStatus };
      if (newStatus === 'Applied' && !prev.applicationDate) {
        updated.applicationDate = getTodayString();
        if (!prev.followUpDate) {
          updated.followUpDate = addDays(getTodayString(), 7);
        }
      }
      return updated;
    });
  };

  // Interview rounds management
  const handleAddInterview = () => {
    const newRound: InterviewRound = {
      id: `round-${Date.now()}`,
      round: 'Technical Interview',
      date: addDays(getTodayString(), 3),
      time: '14:00',
      interviewer: '',
      notes: '',
      completed: false
    };
    setFormData(prev => ({
      ...prev,
      interviews: [...(prev.interviews || []), newRound]
    }));
  };

  const handleUpdateInterview = (id: string, updates: Partial<InterviewRound>) => {
    setFormData(prev => ({
      ...prev,
      interviews: prev.interviews.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const handleRemoveInterview = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interviews: prev.interviews.filter(r => r.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { company?: string; title?: string } = {};
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setActiveTab('info');
      return;
    }

    const finalJob: JobOffer = {
      ...formData,
      id: formData.id || `job-${Date.now()}`,
      updatedAt: getTodayString(),
      createdAt: formData.createdAt || getTodayString()
    };

    onSave(finalJob);
  };

  const statuses: JobStatus[] = ['Saved', 'To Apply', 'Applied', 'Interview', 'Accepted', 'Rejected'];
  const cvOptions: CVVersion[] = ['ATS CV', 'Visual CV', 'Website Portfolio'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {initialJob ? 'Edit Job Offer' : 'Add New Job Offer'}
              </h2>
              <p className="text-xs text-slate-600">
                {formData.company ? `${formData.company} • ${formData.title || 'Untitled'}` : 'Fill in the position and application details'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 gap-2 bg-white overflow-x-auto text-xs">
          {[
            { id: 'info', label: '1. Role & Details', icon: Building },
            { id: 'application', label: '2. Status & CV', icon: FileText },
            { id: 'recruiter', label: '3. Recruiter Contact', icon: User },
            { id: 'interviews', label: `4. Interviews (${formData.interviews?.length || 0})`, icon: MessageSquare },
            { id: 'notes', label: '5. Notes & Response', icon: Sparkles },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: Role & Details */}
          {activeTab === 'info' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Google, Stripe, Linear"
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                        errors.company ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-600'
                      }`}
                    />
                  </div>
                  {errors.company && <p className="text-[11px] text-rose-600 mt-1">{errors.company}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Job Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Senior Frontend Engineer"
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                        errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-600'
                      }`}
                    />
                  </div>
                  {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Remote / Paris / London"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Salary / Compensation</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.salary || ''}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      placeholder="e.g. $130k - $150k"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Job Type</label>
                  <select
                    value={formData.jobType || 'Full-time'}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Application URL / Link</label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://company.com/jobs/role-id"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Description & Key Requirements</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Paste job details, tech stack, responsibilities, or bullet points..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600 resize-y"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Status & CV Version */}
          {activeTab === 'application' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Application Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Application Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {statuses.map(st => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        formData.status === st
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* CV Version Used */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CV Version Used
                </label>
                <p className="text-[11px] text-slate-600 mb-2">
                  Associate each offer with the resume format used to measure what works best.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {cvOptions.map(cv => (
                    <button
                      type="button"
                      key={cv}
                      onClick={() => setFormData({ ...formData, cvVersion: cv })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.cvVersion === cv
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-bold text-xs block">{cv}</span>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        {cv === 'ATS CV' && 'Optimized for online job portals'}
                        {cv === 'Visual CV' && 'Designed PDF for direct outreach'}
                        {cv === 'Website Portfolio' && 'Personal link / live projects'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Deadline
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <span className="text-[10px] text-slate-600 block mt-1">Offers alert when deadline nears</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={formData.applicationDate}
                      onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <span className="text-[10px] text-slate-600 block mt-1">When you submitted the CV</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Follow-Up Date
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <span className="text-[10px] text-slate-600 block mt-1">Scheduled reminder date</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Recruiter Contact Details */}
          {activeTab === 'recruiter' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="text-xs text-slate-600">
                Keep the direct contact info of the headhunter, recruiter, or hiring manager handy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.recruiter?.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        recruiter: { ...formData.recruiter, name: e.target.value }
                      })}
                      placeholder="e.g. Jane Doe"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={formData.recruiter?.email || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        recruiter: { ...formData.recruiter, email: e.target.value }
                      })}
                      placeholder="jane.doe@company.com"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.recruiter?.phone || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        recruiter: { ...formData.recruiter, phone: e.target.value }
                      })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile</label>
                  <div className="relative">
                    <Linkedin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={formData.recruiter?.linkedin || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        recruiter: { ...formData.recruiter, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Responses & Feedback</label>
                <textarea
                  rows={3}
                  value={formData.recruiterResponse || ''}
                  onChange={(e) => setFormData({ ...formData, recruiterResponse: e.target.value })}
                  placeholder="Record what the recruiter said: feedback on salary, tech test feedback, reasons for response..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Interviews & Rounds */}
          {activeTab === 'interviews' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Interview Rounds & Schedule</h3>
                  <p className="text-xs text-slate-600">Track screening calls, tech assessments, and panel interviews.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddInterview}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Interview Round</span>
                </button>
              </div>

              {(!formData.interviews || formData.interviews.length === 0) ? (
                <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-600">No interview rounds scheduled yet.</p>
                  <button
                    type="button"
                    onClick={handleAddInterview}
                    className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    + Schedule first round
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.interviews.map((round, idx) => (
                    <div
                      key={round.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          Round {idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                            <input
                              type="checkbox"
                              checked={round.completed}
                              onChange={(e) => handleUpdateInterview(round.id, { completed: e.target.checked })}
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Completed</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveInterview(round.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Round Name</label>
                          <input
                            type="text"
                            value={round.round}
                            onChange={(e) => handleUpdateInterview(round.id, { round: e.target.value })}
                            placeholder="e.g. HR Phone Screen"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date</label>
                          <input
                            type="date"
                            value={round.date}
                            onChange={(e) => handleUpdateInterview(round.id, { date: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Time</label>
                          <input
                            type="time"
                            value={round.time || ''}
                            onChange={(e) => handleUpdateInterview(round.id, { time: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Interviewer Name / Role</label>
                          <input
                            type="text"
                            value={round.interviewer || ''}
                            onChange={(e) => handleUpdateInterview(round.id, { interviewer: e.target.value })}
                            placeholder="e.g. David (Lead Architect)"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Round Notes / Preparation</label>
                          <input
                            type="text"
                            value={round.notes || ''}
                            onChange={(e) => handleUpdateInterview(round.id, { notes: e.target.value })}
                            placeholder="e.g. Review system design & concurrency"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Notes & Strategy */}
          {activeTab === 'notes' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Personal Notes & Strategy</label>
                <textarea
                  rows={6}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Record your thoughts, company insights, questions to ask the team, key achievements to mention..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Interview Preparation Tip:</span>
                  <p className="mt-0.5 text-indigo-800">
                    Always prepare 2-3 thoughtful questions about company engineering culture, deployment cycles, and team challenges to ask at the end of every interview.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs shadow-indigo-200 hover:shadow-md transition-all active:scale-[0.98]"
              >
                {initialJob ? 'Save Changes' : 'Create Job Offer'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
