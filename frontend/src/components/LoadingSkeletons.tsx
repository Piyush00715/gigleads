export function TableSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-xl overflow-hidden animate-pulse">
      {/* Header bar placeholder */}
      <div className="h-14 bg-slate-100 dark:bg-dark-800 border-b border-slate-200/60 dark:border-dark-800 flex items-center px-6 gap-4">
        <div className="h-4 w-1/4 bg-slate-200 dark:bg-dark-700 rounded" />
        <div className="h-4 w-1/5 bg-slate-200 dark:bg-dark-700 rounded" />
        <div className="h-4 w-1/5 bg-slate-200 dark:bg-dark-700 rounded" />
        <div className="h-4 w-1/6 bg-slate-200 dark:bg-dark-700 rounded ml-auto" />
      </div>
      {/* Rows placeholders */}
      <div className="divide-y divide-slate-100 dark:divide-dark-800">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 flex items-center px-6 gap-4">
            <div className="h-4 w-1/3 bg-slate-100 dark:bg-dark-800 rounded" />
            <div className="h-4 w-1/4 bg-slate-100 dark:bg-dark-800 rounded" />
            <div className="h-3 w-16 bg-slate-100 dark:bg-dark-800 rounded-full" />
            <div className="h-3 w-16 bg-slate-100 dark:bg-dark-800 rounded-full" />
            <div className="h-6 w-6 bg-slate-100 dark:bg-dark-800 rounded-lg ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 4 Cards Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl p-6 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="h-3 w-20 bg-slate-100 dark:bg-dark-800 rounded" />
              <div className="h-8 w-8 bg-slate-100 dark:bg-dark-800 rounded-lg" />
            </div>
            <div className="h-6 w-12 bg-slate-200 dark:bg-dark-700 rounded" />
          </div>
        ))}
      </div>

      {/* Main Charts & Side Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 h-[400px] bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl p-6">
          <div className="h-4 w-1/4 bg-slate-200 dark:bg-dark-700 rounded mb-6" />
          <div className="h-[280px] w-full bg-slate-100 dark:bg-dark-800 rounded-xl" />
        </div>
        <div className="h-[400px] bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl p-6">
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-dark-700 rounded mb-6" />
          <div className="h-[280px] w-full bg-slate-100 dark:bg-dark-800 rounded-full max-w-[200px] mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function LeadDetailsSkeleton() {
  return (
    <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 animate-pulse">
      {/* Primary Detail Card */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-slate-200 dark:bg-dark-700 rounded-full" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-slate-200 dark:bg-dark-700 rounded" />
              <div className="h-3 w-28 bg-slate-100 dark:bg-dark-800 rounded" />
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-dark-800 pt-4 grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-2 w-12 bg-slate-100 dark:bg-dark-800 rounded" />
                <div className="h-4 w-28 bg-slate-200 dark:bg-dark-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meta Sidebar Card */}
      <div className="bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl p-6 space-y-6">
        <div className="h-4 w-1/3 bg-slate-200 dark:bg-dark-700 rounded" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-16 bg-slate-150 dark:bg-dark-800 rounded" />
              <div className="h-3 w-24 bg-slate-200 dark:bg-dark-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
