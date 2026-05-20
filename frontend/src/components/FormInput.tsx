import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  type?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, type = 'text', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full text-left space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-dark-300">
          {label}
        </label>
        <div className="relative">
          <input
            type={inputType}
            ref={ref}
            className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all ${
              error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''
            } ${isPassword ? 'pr-11' : ''} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && (
          <span className="block text-xs font-medium text-red-500 mt-1 pl-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
