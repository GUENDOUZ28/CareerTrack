export type JobStatus = 'Saved' | 'To Apply' | 'Applied' | 'Interview' | 'Accepted' | 'Rejected';

export type CVVersion = 'ATS CV' | 'Visual CV' | 'Website Portfolio' | string;

export interface InterviewRound {
  id: string;
  round: string; // e.g. "HR Screening", "Technical Assessment", "System Design", "Manager / Final Round"
  date: string;  // YYYY-MM-DD
  time?: string;  // e.g. "14:30"
  interviewer?: string; // name or role
  notes?: string;
  completed: boolean;
}

export interface RecruiterContact {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
}

export interface JobOffer {
  id: string;
  company: string;
  title: string;
  description: string;
  location: string;
  link: string;
  deadline: string; // YYYY-MM-DD or ""
  status: JobStatus;
  cvVersion: CVVersion;
  applicationDate: string; // YYYY-MM-DD or ""
  followUpDate: string;    // YYYY-MM-DD or ""
  recruiter: RecruiterContact;
  notes: string;
  recruiterResponse: string;
  interviews: InterviewRound[];
  salary?: string;
  jobType?: string;
  createdAt: string;
  updatedAt: string;
}

export type TabType = 'dashboard' | 'offers' | 'tracker' | 'reminders';

export interface FilterOptions {
  search: string;
  status: string; // 'All' or JobStatus
  cvVersion: string; // 'All' or CVVersion
  location: string;
  sortBy: 'updatedAt' | 'deadline' | 'applicationDate' | 'company' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface ReminderItem {
  id: string;
  jobId: string;
  company: string;
  title: string;
  type: 'deadline' | 'followup' | 'interview';
  date: string;
  details?: string;
  isOverdue: boolean;
  isToday: boolean;
  isUpcoming: boolean;
  daysRemaining: number;
}
