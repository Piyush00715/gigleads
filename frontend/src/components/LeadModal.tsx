import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Lead } from '../types';
import { FormInput } from './FormInput';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null; // If provided, we are in edit mode
  onSuccess: () => void;
}

export function LeadModal({ isOpen, onClose, lead, onSuccess }: LeadModalProps) {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website',
    },
  });

  // Reset form values when lead changes or modal opens
  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      });
    } else {
      reset({
        name: '',
        email: '',
        status: 'New',
        source: 'Website',
      });
    }
  }, [lead, reset, isOpen]);

  const onSubmit = async (data: LeadFormValues) => {
    setLoading(true);
    try {
      if (isEditMode && lead) {
        await api.put(`/leads/${lead._id}`, data);
        toast.success('Lead updated successfully!');
      } else {
        await api.post('/leads', data);
        toast.success('Lead created successfully!');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white dark:bg-dark-900 border border-slate-200/50 dark:border-dark-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-dark-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isEditMode ? 'Edit Sales Lead' : 'Create New Lead'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Contact Name"
            type="text"
            placeholder="e.g. John Doe"
            error={errors.name?.message}
            {...register('name')}
          />

          <FormInput
            label="Email Address"
            type="email"
            placeholder="e.g. john@company.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Status Selector */}
            <div className="text-left space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
                Lead Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Source Selector */}
            <div className="text-left space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
                Acquisition Channel
              </label>
              <select
                {...register('source')}
                className="w-full px-3 py-2 rounded-xl text-sm border bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              >
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-dark-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200/60 dark:border-dark-800 text-slate-600 dark:text-dark-350 hover:bg-slate-50 dark:hover:bg-dark-800 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-4 py-2 text-sm font-semibold transition-all shadow-md hover:shadow-brand-500/10"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditMode ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
