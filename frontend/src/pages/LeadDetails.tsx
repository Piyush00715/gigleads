import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Lead } from '../types';
import { useAuthStore } from '../store/authStore';
import { LeadDetailsSkeleton } from '../components/LoadingSkeletons';
import { EmptyState } from '../components/EmptyState';
import { LeadModal } from '../components/LeadModal';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Mail, 
  Layers, 
  UserCircle, 
  Trash2, 
  Edit, 
  Clock
} from 'lucide-react';

export default function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get lead query
  const { data: lead, isLoading, isError, refetch } = useQuery<Lead>({
    queryKey: ['lead', id],
    queryFn: async () => {
      const response = await api.get(`/leads/${id}`);
      return response.data.data.lead;
    },
    enabled: !!id,
  });

  // Delete lead mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['analyticsSummary'] });
      toast.success('Lead deleted successfully');
      navigate('/leads', { replace: true });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete lead');
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete lead "${lead?.name}"?`)) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return <LeadDetailsSkeleton />;
  }

  if (isError || !lead) {
    return (
      <EmptyState
        title="Lead not found"
        description="The lead details could not be retrieved, or it does not exist."
        action={
          <Link
            to="/leads"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-medium text-sm transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Leads List
          </Link>
        }
      />
    );
  }

  const creationDate = new Date(lead.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const updatedDate = new Date(lead.updatedAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Link
          to="/leads"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-dark-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads Management
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-dark-850">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 font-bold text-2xl uppercase">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {lead.name}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-dark-400">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="text-xs">{lead.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200/60 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-800 text-slate-700 dark:text-dark-350 text-xs font-bold transition-all w-1/2 sm:w-auto"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit Profile
                </button>
                {user?.role === 'Admin' && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200/60 dark:border-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 text-xs font-bold transition-all w-1/2 sm:w-auto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Lead
                  </button>
                )}
              </div>
            </div>

            {/* Profile grid info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {[
                { label: 'Current Status', value: lead.status, icon: <Layers className="h-4 w-4 text-brand-500" /> },
                { label: 'Acquisition Source', value: lead.source, icon: <Clock className="h-4 w-4 text-brand-500" /> },
                { label: 'Assigned Representative', value: lead.assignedTo?.name || 'Unassigned', icon: <UserCircle className="h-4 w-4 text-brand-500" /> },
                { label: 'Email Correspondence', value: lead.email, icon: <Mail className="h-4 w-4 text-brand-500" /> },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-dark-850 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">
                      {item.label}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Timeline Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Lead Activity Audit Log
            </h3>
            
            <div className="space-y-4">
              {/* Added node */}
              <div className="flex gap-3 relative pb-4 border-l border-slate-100 dark:border-dark-800 pl-4 ml-2">
                <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-4 ring-brand-100 dark:ring-brand-950" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Created Timestamp</span>
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-355 mt-0.5">{creationDate}</p>
                </div>
              </div>

              {/* Updated node */}
              <div className="flex gap-3 pl-4 ml-2 relative">
                <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-950" />
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider">Last Modified Timestamp</span>
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-355 mt-0.5">{updatedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={lead}
        onSuccess={refetch}
      />
    </div>
  );
}
