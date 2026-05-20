import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { AnalyticsSummary } from '../types';
import { DashboardSkeleton } from '../components/LoadingSkeletons';
import { EmptyState } from '../components/EmptyState';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Cell,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, UserCheck, RefreshCw, Layers, TrendingUp, CalendarDays, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useQuery<AnalyticsSummary>({
    queryKey: ['analyticsSummary'],
    queryFn: async () => {
      const response = await api.get('/analytics/summary');
      return response.data.data;
    },
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Could not load analytics"
        description="There was a connection issue while pulling dashboard data. Please try again."
        action={
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </button>
        }
      />
    );
  }

  // Calculate metrics
  const totalLeads = data.totalLeads;
  const status = data.statusBreakdown;
  const source = data.sourceBreakdown;

  const qualifiedLeads = status.Qualified || 0;
  const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0';

  // Pie chart formatting
  const statusData = [
    { name: 'New', value: status.New || 0, color: '#3b82f6' }, // Blue
    { name: 'Contacted', value: status.Contacted || 0, color: '#a855f7' }, // Purple
    { name: 'Qualified', value: status.Qualified || 0, color: '#10b981' }, // Green
    { name: 'Lost', value: status.Lost || 0, color: '#ef4444' }, // Red
  ].filter((item) => item.value > 0);

  // Fallback if no status items exist
  const statusPieData = statusData.length > 0 ? statusData : [{ name: 'Empty', value: 1, color: '#e2e8f0' }];

  // Bar chart formatting
  const sourceData = [
    { name: 'Website', Leads: source.Website || 0, fill: '#6366f1' },
    { name: 'Instagram', Leads: source.Instagram || 0, fill: '#ec4899' },
    { name: 'Referral', Leads: source.Referral || 0, fill: '#f59e0b' },
  ];

  // Area chart formatting (Ensuring smooth X-axis values)
  const areaData = data.monthlyTrend.map((item) => {
    const [year, month] = item.date.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1);
    const label = dateObj.toLocaleString('default', { month: 'short', year: '2-digit' });
    return {
      name: label,
      Leads: item.count,
    };
  });

  return (
    <div className="space-y-8">
      {/* Grid of Key KPI Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total Leads',
            value: totalLeads,
            icon: <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
            color: 'from-indigo-500/10 to-blue-500/10 border-indigo-200/50 dark:border-indigo-900/30',
          },
          {
            title: 'Qualified Leads',
            value: qualifiedLeads,
            icon: <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
            color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/50 dark:border-emerald-900/30',
          },
          {
            title: 'Active Contacts',
            value: (status.Contacted || 0) + (status.New || 0),
            icon: <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
            color: 'from-purple-500/10 to-fuchsia-500/10 border-purple-200/50 dark:border-purple-900/30',
          },
          {
            title: 'Conversion Rate',
            value: `${conversionRate}%`,
            icon: <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
            color: 'from-amber-500/10 to-orange-500/10 border-amber-200/50 dark:border-amber-900/30',
          },
        ].map((kpi, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={kpi.title}
            className={`bg-gradient-to-br ${kpi.color} border bg-white dark:bg-dark-900 rounded-2xl p-6 shadow-sm flex items-center justify-between`}
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-dark-400">
                {kpi.title}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {kpi.value}
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white dark:bg-dark-800 border border-slate-200/60 dark:border-dark-700/60 flex items-center justify-center shadow-sm">
              {kpi.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Monthly Trend Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="h-4 w-4 text-brand-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Leads Generation Trend</h4>
          </div>
          <div className="h-[280px]">
            {areaData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-dark-800" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="Leads" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#leadsGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No trend data yet.</div>
            )}
          </div>
        </motion.div>

        {/* Status breakdown Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl p-6 shadow-sm"
        >
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Leads by Status</h4>
          <div className="h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.name}</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{item.value} leads</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 3: Sources Bar Chart & Recent Leads */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Source breakdown chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl p-6 shadow-sm"
        >
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Leads by Channel Source</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-dark-800" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="Leads" radius={[4, 4, 0, 0]}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Leads Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recent Leads Incoming</h4>
              <Link
                to="/leads"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                View all leads
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              {data.recentLeads.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-dark-800">
                      <th className="py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Name</th>
                      <th className="py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Channel</th>
                      <th className="py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Added Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-dark-850">
                    {data.recentLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/20 group transition-colors">
                        <td className="py-3 pr-2">
                          <Link to={`/leads/${lead._id}`} className="block">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                              {lead.name}
                            </span>
                            <span className="block text-[10px] text-slate-400 dark:text-dark-500 leading-none mt-0.5 truncate max-w-[150px]">
                              {lead.email}
                            </span>
                          </Link>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            lead.source === 'Website' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                            lead.source === 'Instagram' ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400' :
                            'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}>
                            {lead.source}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            lead.status === 'New' ? 'bg-blue-500/10 text-blue-600' :
                            lead.status === 'Contacted' ? 'bg-purple-500/10 text-purple-600' :
                            lead.status === 'Qualified' ? 'bg-emerald-500/10 text-emerald-600' :
                            'bg-red-500/10 text-red-600'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 text-right text-[10px] font-semibold text-slate-400">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">No leads added yet.</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
