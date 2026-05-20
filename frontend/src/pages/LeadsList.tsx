import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { LeadsResponse, Lead } from '../types';
import { useAuthStore } from '../store/authStore';
import { useDebounce } from '../hooks/useDebounce';
import { TableSkeleton } from '../components/LoadingSkeletons';
import { EmptyState } from '../components/EmptyState';
import { LeadModal } from '../components/LeadModal';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  SlidersHorizontal, 
  Download, 
  PlusCircle, 
  Trash2, 
  Eye, 
  Edit2, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  X
} from 'lucide-react';

export default function LeadsList() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL search params
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchInput = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const source = searchParams.get('source') || '';
  const sortOrder = searchParams.get('sort') || 'desc'; // 'desc' (Latest), 'asc' (Oldest)

  // Local state for immediate typing feedback, then debounced for API calls
  const [searchTerm, setSearchTerm] = useState(searchInput);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Sync debounced search to URL search parameter
  useEffect(() => {
    updateParams({ search: debouncedSearch, page: 1 }); // reset to page 1 on new search
  }, [debouncedSearch]);

  // Read query data
  const { data, isLoading, isError, refetch } = useQuery<LeadsResponse>({
    queryKey: ['leads', page, debouncedSearch, status, source, sortOrder],
    queryFn: async () => {
      const response = await api.get('/leads', {
        params: {
          page,
          limit: 10,
          search: debouncedSearch,
          status,
          source,
          sortOrder,
        },
      });
      return response.data.data;
    },
  });

  // Delete lead mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['analyticsSummary'] });
      toast.success('Lead deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete lead');
    },
  });

  const updateParams = (newParams: Record<string, string | number | null>) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated = { ...current, ...newParams };
    const cleanParams: Record<string, string> = {};

    Object.keys(updated).forEach((key) => {
      const val = updated[key];
      if (val !== '' && val !== null && val !== undefined) {
        cleanParams[key] = String(val);
      }
    });

    setSearchParams(cleanParams);
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/leads/export', {
        params: { search: debouncedSearch, status, source },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV export completed!');
    } catch (err: any) {
      toast.error(err.message || 'Export failed');
    }
  };

  const openCreateModal = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete lead "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-dark-800 bg-white dark:bg-dark-900 text-slate-700 dark:text-dark-300 hover:bg-slate-50 dark:hover:bg-dark-800 text-sm font-semibold transition-colors shadow-sm w-1/2 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-all shadow-md hover:shadow-brand-500/10 w-1/2 sm:w-auto"
          >
            <PlusCircle className="h-4 w-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters & Sorting section */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <SlidersHorizontal className="h-3.5 w-3.5 text-brand-500" />
          Filters
        </div>

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => updateParams({ status: e.target.value || null, page: 1 })}
          className="px-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-dark-850 border-slate-200 dark:border-dark-800 text-xs font-semibold text-slate-600 dark:text-dark-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>

        {/* Source Dropdown */}
        <select
          value={source}
          onChange={(e) => updateParams({ source: e.target.value || null, page: 1 })}
          className="px-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-dark-850 border-slate-200 dark:border-dark-800 text-xs font-semibold text-slate-600 dark:text-dark-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>

        {/* Sort Select */}
        <select
          value={sortOrder}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="px-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-dark-850 border-slate-200 dark:border-dark-800 text-xs font-semibold text-slate-600 dark:text-dark-300 focus:outline-none focus:ring-1 focus:ring-brand-500 ml-auto"
        >
          <option value="desc">Sort: Latest</option>
          <option value="asc">Sort: Oldest</option>
        </select>

        {/* Active indicators reset */}
        {(status || source || debouncedSearch) && (
          <button
            onClick={clearFilters}
            className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
          >
            Clear Active Filters
          </button>
        )}
      </div>

      {/* Main Table / Grid Loader states */}
      {isLoading ? (
        <TableSkeleton />
      ) : isError || !data ? (
        <EmptyState
          title="Leads Sync Failed"
          description="We had issues communicating with the lead services database."
          action={
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Leads
            </button>
          }
        />
      ) : data.leads.length === 0 ? (
        <EmptyState
          title="No leads match your criteria"
          description="Try updating your search query or status filter parameters."
          action={
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-white text-sm font-semibold"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Table display (large screen desktop) */}
          <div className="hidden md:block bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-dark-950/50 border-b border-slate-200/60 dark:border-dark-800">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Channel Source</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Rep</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Added Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-850">
                {data.leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/30 dark:hover:bg-dark-800/10 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-white font-semibold text-xs uppercase">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{lead.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-dark-500 leading-none mt-0.5">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lead.status === 'New' ? 'bg-blue-500/10 text-blue-600' :
                        lead.status === 'Contacted' ? 'bg-purple-500/10 text-purple-600' :
                        lead.status === 'Qualified' ? 'bg-emerald-500/10 text-emerald-600 font-bold' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        lead.source === 'Website' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                        lead.source === 'Instagram' ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400' :
                        'bg-amber-500/10 text-amber-600'
                      }`}>
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-dark-300">
                      {lead.assignedTo?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-dark-400">
                      {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/leads/${lead._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => openEditModal(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors"
                          title="Edit Lead"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {user?.role === 'Admin' && (
                          <button
                            onClick={() => handleDelete(lead._id, lead.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards display (mobile screens) */}
          <div className="md:hidden grid gap-4 grid-cols-1">
            {data.leads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-white font-semibold text-xs">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{lead.name}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-dark-500">{lead.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lead.status === 'New' ? 'bg-blue-500/10 text-blue-600' :
                    lead.status === 'Contacted' ? 'bg-purple-500/10 text-purple-600' :
                    lead.status === 'Qualified' ? 'bg-emerald-500/10 text-emerald-600' :
                    'bg-red-500/10 text-red-600'
                  }`}>
                    {lead.status}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    lead.source === 'Website' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                    lead.source === 'Instagram' ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400' :
                    'bg-amber-500/10 text-amber-600'
                  }`}>
                    {lead.source}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-dark-400 border-t border-slate-100 dark:border-dark-850 pt-3">
                  <span>Rep: {lead.assignedTo?.name || 'Unassigned'}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/leads/${lead._id}`}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => openEditModal(lead)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {user?.role === 'Admin' && (
                      <button
                        onClick={() => handleDelete(lead._id, lead.name)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-dark-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-dark-400">
              Showing{' '}
              <span className="font-bold text-slate-800 dark:text-white">
                {(page - 1) * 10 + 1}
              </span>{' '}
              to{' '}
              <span className="font-bold text-slate-800 dark:text-white">
                {Math.min(page * 10, data.pagination.total)}
              </span>{' '}
              of{' '}
              <span className="font-bold text-slate-800 dark:text-white">
                {data.pagination.total}
              </span>{' '}
              leads
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={!data.pagination.hasPrevPage}
                onClick={() => updateParams({ page: page - 1 })}
                className="p-2 rounded-xl border border-slate-200/60 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-800 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Numbered links */}
              {[...Array(data.pagination.totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => updateParams({ page: pageNumber })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      page === pageNumber
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'border border-slate-200/60 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-800 text-slate-600 dark:text-dark-300'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                disabled={!data.pagination.hasNextPage}
                onClick={() => updateParams({ page: page + 1 })}
                className="p-2 rounded-xl border border-slate-200/60 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-800 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creation/Edit Dialog Overlay */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={selectedLead}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['leads'] });
          queryClient.invalidateQueries({ queryKey: ['analyticsSummary'] });
        }}
      />
    </div>
  );
}
