export const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const addDays = (dateStr, days) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getSampleJobs = () => {
  const today = getTodayString();

  return [
    {
      id: 'job-1',
      company: 'Stripe',
      title: 'Senior Frontend Engineer',
      description: 'Building developer-first payment infrastructure and dashboard components using React, TypeScript, and design systems.',
      location: 'Remote (Europe / US)',
      link: 'https://stripe.com/jobs',
      deadline: addDays(today, 4),
      status: 'Interview',
      cvVersion: 'ATS CV',
      applicationDate: addDays(today, -10),
      followUpDate: addDays(today, 1),
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
          date: addDays(today, -5),
          time: '14:00',
          interviewer: 'Sarah Jenkins',
          notes: 'Discussed salary expectations ($145k), remote setup, and past project highlights.',
          completed: true
        },
        {
          id: 'round-2',
          round: 'System Architecture & React Deep Dive',
          date: addDays(today, 2),
          time: '16:00',
          interviewer: 'Alex Rivera (Staff Engineer)',
          notes: 'Prepare state management edge cases, virtualization for high volume tables, and accessibility.',
          completed: false
        }
      ],
      salary: '$140,000 - $165,000',
      jobType: 'Full-time / Remote',
      createdAt: addDays(today, -12),
      updatedAt: addDays(today, -1)
    },
    {
      id: 'job-2',
      company: 'Linear',
      title: 'Product Design Engineer',
      description: 'Crafting high-velocity project management workflows with attention to micro-interactions and keyboard navigation.',
      location: 'San Francisco, CA (Hybrid)',
      link: 'https://linear.app/careers',
      deadline: addDays(today, 6),
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
      createdAt: addDays(today, -2),
      updatedAt: addDays(today, -2)
    },
    {
      id: 'job-3',
      company: 'Vercel',
      title: 'Full Stack Solutions Architect',
      description: 'Partner with enterprise clients to scale Next.js and edge infrastructure deployments worldwide.',
      location: 'Remote',
      link: 'https://vercel.com/careers',
      deadline: addDays(today, -3),
      status: 'Accepted',
      cvVersion: 'Website Portfolio',
      applicationDate: addDays(today, -25),
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
          date: addDays(today, -20),
          time: '15:00',
          interviewer: 'Elena Rostova',
          notes: 'Culture fit & compensation discussion.',
          completed: true
        },
        {
          id: 'v-2',
          round: 'Technical Architecture Defense',
          date: addDays(today, -14),
          time: '11:00',
          interviewer: 'VP of Engineering',
          notes: 'Walked through live Next.js app architecture.',
          completed: true
        }
      ],
      salary: '$155,000 + Stock Options',
      jobType: 'Full-time / Remote',
      createdAt: addDays(today, -28),
      updatedAt: today
    },
    {
      id: 'job-4',
      company: 'Datadog',
      title: 'Frontend Platform Engineer',
      description: 'Developing high-throughput monitoring visualizations, real-time metrics dashboards, and distributed telemetry UI.',
      location: 'Paris, France',
      link: 'https://careers.datadoghq.com',
      deadline: addDays(today, 1),
      status: 'Applied',
      cvVersion: 'ATS CV',
      applicationDate: addDays(today, -7),
      followUpDate: today,
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
      createdAt: addDays(today, -8),
      updatedAt: today
    },
    {
      id: 'job-5',
      company: 'Spotify',
      title: 'Web Experience Developer',
      description: 'Work on Spotify for Artists web applications and creator analytics tools used by millions of musicians worldwide.',
      location: 'Stockholm, Sweden / Hybrid',
      link: 'https://www.lifeatspotify.com/jobs',
      deadline: addDays(today, 9),
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
      createdAt: addDays(today, -1),
      updatedAt: addDays(today, -1)
    },
    {
      id: 'job-6',
      company: 'Airbnb',
      title: 'Staff UI Engineer',
      description: 'Lead initiatives across Airbnb’s guest checkout experience and design tokens infrastructure.',
      location: 'Remote (US/Canada)',
      link: 'https://careers.airbnb.com',
      deadline: addDays(today, -15),
      status: 'Rejected',
      cvVersion: 'ATS CV',
      applicationDate: addDays(today, -30),
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
          date: addDays(today, -24),
          interviewer: 'Claire Morgan',
          notes: 'Very friendly call, liked the open source contributions.',
          completed: true
        }
      ],
      salary: '$180,000 - $210,000',
      jobType: 'Full-time',
      createdAt: addDays(today, -35),
      updatedAt: addDays(today, -18)
    }
  ];
};
