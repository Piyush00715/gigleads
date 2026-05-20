import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { FormInput } from '../components/FormInput';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { Loader2, Save, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
}).refine(
  (data) => {
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  },
  {
    message: 'Current password is required to set a new password',
    path: ['currentPassword'],
  }
).refine(
  (data) => {
    if (data.newPassword && data.newPassword.length < 6) {
      return false;
    }
    return true;
  },
  {
    message: 'New password must be at least 6 characters',
    path: ['newPassword'],
  }
);

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      const response = await api.put('/users/me', {
        name: data.name,
        email: data.email,
        currentPassword: data.currentPassword || undefined,
        newPassword: data.newPassword || undefined,
      });

      const updatedUser = response.data.data.user;
      updateUser(updatedUser);
      toast.success('Profile updated successfully!');
      
      // Clear password fields
      reset({
        name: updatedUser.name,
        email: updatedUser.email,
        currentPassword: '',
        newPassword: '',
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl p-6 md:p-8 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-dark-850">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-extrabold text-2xl uppercase">
            {user?.name.charAt(0)}
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
              {user?.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-slate-500 dark:text-dark-400">
              <span className="text-xs">{user?.email}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-dark-700 hidden sm:inline" />
              <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider">
                {user?.role} Rep
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-dark-500 mt-2">
              Sales Agent since {memberSince}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              type="text"
              placeholder="Full name"
              error={errors.name?.message}
              {...register('name')}
            />

            <FormInput
              label="Email Address"
              type="email"
              placeholder="e.g. rep@smartleads.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="border-t border-slate-100 dark:border-dark-850 pt-6">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-violet-500" />
              Security Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                error={errors.currentPassword?.message}
                {...register('currentPassword')}
              />

              <FormInput
                label="New Password"
                type="password"
                placeholder="Min 6 characters"
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-dark-850">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-4 py-2.5 text-sm font-semibold transition-all shadow-md hover:shadow-brand-500/10"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
