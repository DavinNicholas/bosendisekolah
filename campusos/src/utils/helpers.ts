import { format, isToday, isTomorrow, isYesterday, differenceInDays, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return dateString;
  }
};

export const getRelativeDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    const days = differenceInDays(date, new Date());
    
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days <= 7) return `Due in ${days} days`;
    return format(date, 'MMM d');
  } catch {
    return dateString;
  }
};

export const getCountdown = (dateString: string): number => {
  try {
    return Math.max(0, differenceInDays(parseISO(dateString), new Date()));
  } catch {
    return 0;
  }
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const calculatePercentage = (current: number, max: number): number => {
  if (max === 0) return 0;
  return Math.round((current / max) * 100);
};

export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'urgent': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
    case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
    case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
    default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
    case 'done':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
    case 'in-progress':
    case 'doing':
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
    case 'todo':
    case 'not-started':
      return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
