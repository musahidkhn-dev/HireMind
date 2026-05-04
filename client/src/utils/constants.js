export const API_URL = import.meta.env.VITE_API_URL;

export const ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter',
  SUPERADMIN: 'superadmin',
};

export const PIPELINE_STAGES = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

export const JOB_TYPES = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
  { label: 'Remote', value: 'remote' },
];

export const STAGE_COLORS = {
  Applied: 'blue',
  Screening: 'yellow',
  Interview: 'purple',
  Offer: 'amber', // REDESIGN: was indigo
  Hired: 'green',
  Rejected: 'red',
};

export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '500+',
];
