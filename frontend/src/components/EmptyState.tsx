import type { ReactNode } from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title = 'No records found',
  description = 'There are no items to show in this view right now.',
  icon = <Database className="h-10 w-10 text-slate-400 dark:text-dark-500" />,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 dark:border-dark-800 rounded-2xl bg-white/30 dark:bg-dark-900/30 min-h-[300px] transition-all">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-dark-800 mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-dark-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}
