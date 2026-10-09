import { JobOffer } from '../types/job';
import { getTodayString, addDays } from './date';

const STORAGE_KEY = 'careertrack_job_offers_v1';

export const INITIAL_SAMPLE_JOBS: JobOffer[] = [
  {
    id: 'job-1',
    company: 'Stripe',
    title: 'Senior Frontend Engineer',
    description: 'Building developer-first payment infrastructure and dashboard components using React, TypeScript, and design systems.',
    location: 'Remote (Europe / US)',
    link: 'https://stripe.com/jobs',
    deadline: addDays(getTodayString(), 4),
    status: 'Interview',
    cvVersion: 'ATS CV',
    applicationDate: addDays(getTodayString(), -10),
    followUpDate: addDays(getTodayString(), 1),
    recruiter: {
      name: 'Sarah Jenkins',
      email: 'sjenkins@stripe.com',
      phone: '+1 (415) 890-1234',
      linkedin: 'https://linkedin.com/in/sarahjenkins-recruiter'
    },
    notes: 'Emphasize experience with complex financial dashboards and component library architecture.',
    recruiterResponse: 'Recruiter reached out following ATS screening. Feedback: "Portfolio and tech stack alignment is exceptional. Moving to technical round."',
    interviews: [
      {
        id: 'round-1',
        round: 'HR Recruiter Screen',
        date: addDays(getTodayString(), -5),
        time: '14:00',
        interviewer: 'Sarah Jenkins',
        notes: 'Discussed salary expectations ($145k), remote setup, and past project highlights.',
        completed: true
      },
      {
        id: 'round-2',
        round: 'System Architecture & React Deep Dive',
        date: addDays(getTodayString(), 2),
        time: '16:00',
        interviewer: 'Alex Rivera (Staff Engineer)',
        notes: 'Prepare state management edge cases, virtualization for high volume tables, and accessibility.',
        completed: false
      }
    ],
    salary: '$140,000 - $165,000',
    jobType: 'Full-time / Remote',
    createdAt: addDays(getTodayString(), -12),
    updatedAt: addDays(getTodayString(), -1)
  },
  {
    id: 'job-2',
    company: 'Linear',
    title: 'Product Design Engineer',
    description: 'Crafting high-velocity project management workflows with attention to micro-interactions and keyboard navigation.',
    location: 'San Francisco, CA (Hybrid)',
    link: 'https://linear.app/careers',
    deadline: addDays(getTodayString(), 6),
    status: 'To Apply',
    cvVersion: 'Visual CV',
    applicationDate: '',
    followUpDate: '',
    recruiter: {
      name: 'Marcus Vance',
      email: 'recruiting@linear.app',
      phone: '',
      linkedin: 'https://linkedin.com/in/marcusvance'
    },
    notes: 'Need to tailor Visual CV showcasing keyboard shortcuts and smooth Framer-motion interactions.',
    recruiterResponse: '',
    interviews: [],
    salary: '$150,000 - $180,000',
    jobType: 'Full-time',
    createdAt: addDays(getTodayString(), -2),
    updatedAt: addDays(getTodayString(), -2)
  },
  {
    id: 'job-3',
    company: 'Vercel',
    title: 'Full Stack Solutions Architect',
    description: 'Partner with enterprise clients to scale Next.js and edge infrastructure deployments worldwide.',
    location: 'Remote',
    link: 'https://vercel.com/careers',
    deadline: addDays(getTodayString(), -3),
    status: 'Accepted',
    cvVersion: 'Website Portfolio',
    applicationDate: addDays(getTodayString(), -25),
    followUpDate: '',
    recruiter: {
      name: 'Elena Rostova',
      email: 'elena.r@vercel.com',
      phone: '+1 (555) 234-9081',
      linkedin: 'https://linkedin.com/in/elenarostova'
    },
    notes: 'Offered $155,000 base + equity package! Contract received and signed.',
    recruiterResponse: 'Official offer letter received! Great feedback on portfolio live demo.',
    interviews: [
      {
        id: 'v-1',
        round: 'Initial Chat',
        date: addDays(getTodayString(), -20),
        time: '15:00',
        interviewer: 'Elena Rostova',
        notes: 'Culture fit & compensation discussion.',
        completed: true
      },
      {
        id: 'v-2',
        round: 'Technical Architecture Defense',
        date: addDays(getTodayString(), -14),
        time: '11:00',
        interviewer: 'VP of Engineering',
        notes: 'Walked through live Next.js app architecture.',
        completed: true
      }
    ],
    salary: '$155,000 + Stock Options',
    jobType: 'Full-time / Remote',
    createdAt: addDays(getTodayString(), -28),
    updatedAt: getTodayString()
  },
  {
    id: 'job-4',
    company: 'Datadog',
    title: 'Frontend Platform Engineer',
    description: 'Developing high-throughput monitoring visualizations, real-time metrics dashboards, and distributed telemetry UI.',
    location: 'Paris, France',
    link: 'https://careers.datadoghq.com',
    deadline: addDays(getTodayString(), 1),
    status: 'Applied',
    cvVersion: 'ATS CV',
    applicationDate: addDays(getTodayString(), -7),
    followUpDate: getTodayString(), // Due TODAY!
    recruiter: {
      name: 'Thomas Bernard',
      email: 'tbernard@datadoghq.com',
      phone: '+33 1 42 68 55 00',
      linkedin: 'https://linkedin.com/in/thomasbernard-tech'
    },
    notes: 'Follow-up due today! Sent email to Thomas regarding the application status.',
    recruiterResponse: 'Application confirmed received by automated ATS. Awaiting hiring manager review.',
    interviews: [],
    salary: '€75,000 - €90,000',
    jobType: 'Full-time / Hybrid',
    createdAt: addDays(getTodayString(), -8),
    updatedAt: getTodayString()
  },
  {
    id: 'job-5',
    company: 'Spotify',
    title: 'Web Experience Developer',
    description: 'Work on Spotify for Artists web applications and creator analytics tools used by millions of musicians worldwide.',
    location: 'Stockholm, Sweden / Hybrid',
    link: 'https://www.lifeatspotify.com/jobs',
    deadline: addDays(getTodayString(), 9),
    status: 'Saved',
    cvVersion: 'Website Portfolio',
    applicationDate: '',
    followUpDate: '',
    recruiter: {
      name: '',
      email: '',
      phone: '',
      linkedin: ''
    },
    notes: 'Must highlight experience with Web Audio API, internationalization, and high-load consumer apps.',
    recruiterResponse: '',
    interviews: [],
    salary: 'SEK 70,000 / month',
    jobType: 'Full-time',
    createdAt: addDays(getTodayString(), -1),
    updatedAt: addDays(getTodayString(), -1)
  },
  {
    id: 'job-6',
    company: 'Airbnb',
    title: 'Staff UI Engineer',
    description: 'Lead initiatives across Airbnb’s guest checkout experience and design tokens infrastructure.',
    location: 'Remote (US/Canada)',
    link: 'https://careers.airbnb.com',
    deadline: addDays(getTodayString(), -15),
    status: 'Rejected',
    cvVersion: 'ATS CV',
    applicationDate: addDays(getTodayString(), -30),
    followUpDate: '',
    recruiter: {
      name: 'Claire Morgan',
      email: 'claire.m@airbnb.com',
      phone: '',
      linkedin: 'https://linkedin.com/in/clairemorgan'
    },
    notes: 'Strong competition for staff level. Feedback suggested reapplying in 6 months for Senior / Staff Lead roles.',
    recruiterResponse: 'Received warm rejection letter noting strong skills but selected a candidate with direct hospitality domain experience.',
    interviews: [
      {
        id: 'ab-1',
        round: 'Screening',
        date: addDays(getTodayString(), -24),
        interviewer: 'Claire Morgan',
        notes: 'Very friendly call, liked the open source contributions.',
        completed: true
      }
    ],
    salary: '$180,000 - $210,000',
    jobType: 'Full-time',
    createdAt: addDays(getTodayString(), -35),
    updatedAt: addDays(getTodayString(), -18)
  }
];

export const loadJobs = (): JobOffer[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveJobs(INITIAL_SAMPLE_JOBS);
      return INITIAL_SAMPLE_JOBS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SAMPLE_JOBS;
  } catch (e) {
    console.error('Failed to load job offers from localStorage:', e);
    return INITIAL_SAMPLE_JOBS;
  }
};

export const saveJobs = (jobs: JobOffer[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.error('Failed to save job offers to localStorage:', e);
  }
};

export const resetToDemoData = (): JobOffer[] => {
  saveJobs(INITIAL_SAMPLE_JOBS);
  return INITIAL_SAMPLE_JOBS;
};

export const clearAllData = (): JobOffer[] => {
  saveJobs([]);
  return [];
};

export const exportToJSON = (jobs: JobOffer[]): void => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jobs, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `careertrack_backup_${getTodayString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const exportToCSV = (jobs: JobOffer[]): void => {
  const headers = [
    'Company',
    'Job Title',
    'Status',
    'CV Version',
    'Location',
    'Application Date',
    'Deadline',
    'Follow-up Date',
    'Salary',
    'Link',
    'Recruiter Name',
    'Recruiter Email',
    'Recruiter Phone',
    'Notes'
  ];

  const escapeCSV = (str?: string) => {
    if (!str) return '""';
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const rows = jobs.map(j => [
    escapeCSV(j.company),
    escapeCSV(j.title),
    escapeCSV(j.status),
    escapeCSV(j.cvVersion),
    escapeCSV(j.location),
    escapeCSV(j.applicationDate),
    escapeCSV(j.deadline),
    escapeCSV(j.followUpDate),
    escapeCSV(j.salary),
    escapeCSV(j.link),
    escapeCSV(j.recruiter?.name),
    escapeCSV(j.recruiter?.email),
    escapeCSV(j.recruiter?.phone),
    escapeCSV(j.notes)
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', encodeURI(csvContent));
  downloadAnchor.setAttribute('download', `careertrack_jobs_${getTodayString()}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importFromJSON = (jsonString: string): JobOffer[] => {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid format: file must contain a JSON array of job offers');
  }
  // Basic validation
  const validated = parsed.filter(item => item && item.company && item.title);
  if (validated.length === 0) {
    throw new Error('No valid job offers found in the file.');
  }
  saveJobs(validated);
  return validated;
};
