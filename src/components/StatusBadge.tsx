import React from 'react';
import { JobStatus, CVVersion } from '../types/job';
import { 
  Bookmark, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Trophy, 
  XCircle, 
  FileText, 
  Palette, 
  Globe 
} from 'lucide-react';

interface StatusBadgeProps {
  status: JobStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Saved':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          icon: Bookmark,
          label: 'Saved'
        };
      case 'To Apply':
        return {
          bg: 'bg-amber-50 text-amber-750 text-amber-800 border-amber-200 bg-amber-100/70',
          dot: 'bg-amber-500',
          icon: Send,
          label: 'To Apply'
        };
      case 'Applied':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          icon: CheckCircle2,
          label: 'Applied'
        };
      case 'Interview':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
          icon: MessageSquare,
          label: 'Interview'
        };
      case 'Accepted':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
          dot: 'bg-emerald-500',
          icon: Trophy,
          label: 'Accepted'
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          icon: XCircle,
          label: 'Rejected'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          icon: Bookmark,
          label: status
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};

interface CVBadgeProps {
  version: CVVersion;
  size?: 'sm' | 'md';
}

export const CVBadge: React.FC<CVBadgeProps> = ({ version, size = 'md' }) => {
  const getCVConfig = () => {
    switch (version) {
      case 'ATS CV':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: FileText,
          label: 'ATS CV'
        };
      case 'Visual CV':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: Palette,
          label: 'Visual CV'
        };
      case 'Website Portfolio':
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          icon: Globe,
          label: 'Website Portfolio'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: FileText,
          label: version || 'Standard CV'
        };
    }
  };

  const config = getCVConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${config.bg} ${sizeClasses[size]}`}
      title={`CV Version: ${config.label}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
