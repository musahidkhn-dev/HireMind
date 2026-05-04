export const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatSalary = (min, max, currency = 'USD') => {
  if (!min && !max) return 'Competitive';
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  return `${formatter.format(min)} - ${formatter.format(max)}`;
};

export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm ago';
  return Math.floor(seconds) + 's ago';
};

export const stageBadgeVariant = (stage) => {
  const variants = {
    Applied: 'bg-blue-100 text-blue-700 border-blue-200',
    Screening: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Interview: 'bg-purple-100 text-purple-700 border-purple-200',
    Offer: 'bg-amber-100 text-amber-700 border-amber-200',
    Hired: 'bg-green-100 text-green-700 border-green-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200',
  };
  return variants[stage] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getScoreColor = (percentage) => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '');
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};
