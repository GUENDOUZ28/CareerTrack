/**
 * Date helper utilities for CareerTrack
 */

export const getTodayString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const addDays = (dateStr: string, days: number): string => {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) return getTodayString();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateSafe = (dateStr?: string): Date | null => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

export const getDaysDifference = (targetDateStr: string): number => {
  if (!targetDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Treat date string as local date without timezone shifts
  const parts = targetDateStr.split('-');
  if (parts.length !== 3) {
    const d = new Date(targetDateStr);
    if (isNaN(d.getTime())) return 0;
    d.setHours(0, 0, 0, 0);
    const diffTime = d.getTime() - today.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }

  const target = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'Not set';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getRelativeDateStatus = (dateStr?: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  isUpcoming: boolean;
  days: number;
} => {
  if (!dateStr) {
    return { label: 'No date', isOverdue: false, isToday: false, isUpcoming: false, days: 0 };
  }

  const days = getDaysDifference(dateStr);

  if (days < 0) {
    const absDays = Math.abs(days);
    return {
      label: `${absDays} ${absDays === 1 ? 'day' : 'days'} overdue`,
      isOverdue: true,
      isToday: false,
      isUpcoming: false,
      days
    };
  } else if (days === 0) {
    return {
      label: 'Today',
      isOverdue: false,
      isToday: true,
      isUpcoming: true,
      days: 0
    };
  } else if (days === 1) {
    return {
      label: 'Tomorrow',
      isOverdue: false,
      isToday: false,
      isUpcoming: true,
      days: 1
    };
  } else if (days <= 7) {
    return {
      label: `In ${days} days`,
      isOverdue: false,
      isToday: false,
      isUpcoming: true,
      days
    };
  } else {
    return {
      label: `In ${days} days`,
      isOverdue: false,
      isToday: false,
      isUpcoming: false,
      days
    };
  }
};
