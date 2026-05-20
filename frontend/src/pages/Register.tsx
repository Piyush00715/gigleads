import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FormInput } from '../components/FormInput';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { Loader2, UserPlus } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Sales']).default('Sales'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Sales',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      const user = response.data.data.user;
      login(user);
      toast.success('Account registered successfully!');
      navigate('/', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Create Account</h3>
        <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">
          Register to join the sales team workspace
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Full Name"
          type="text"
          placeholder="e.g. Jane Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <FormInput
          label="Email Address"
          type="email"
          placeholder="e.g. jane@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Min 6 characters"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="text-left space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
            Workspace Role
          </label>
          <select
            {...register('role')}
            className="w-full px-4 py-2.5 rounded-xl text-sm border bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          >
            <option value="Sales">Sales User (Regular access)</option>
            <option value="Admin">Admin User (Full permissions)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-brand-500/20 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 transition-all mt-6"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Register Account
              <UserPlus className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center border-t border-slate-200/50 dark:border-dark-800/50 pt-4 mt-6">
        <span className="text-xs text-slate-500 dark:text-dark-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Sign In
          </Link>
        </span>
      </div>
    </div>
  );
}
