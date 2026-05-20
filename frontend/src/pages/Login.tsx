import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FormInput } from '../components/FormInput';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
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
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const user = response.data.data.user;
      login(user);
      toast.success('Logged in successfully!');
      navigate('/', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Welcome back</h3>
        <p className="text-xs text-slate-500 dark:text-dark-400 mt-1">
          Enter your credentials to access your sales workspace
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email Address"
          type="email"
          placeholder="e.g. rep@smartleads.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-brand-500/20 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 transition-all mt-6"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center border-t border-slate-200/50 dark:border-dark-800/50 pt-4 mt-6">
        <span className="text-xs text-slate-500 dark:text-dark-400">
          New sales representative?{' '}
          <Link
            to="/register"
            className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Register Account
          </Link>
        </span>
      </div>
    </div>
  );
}
