import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-dark-950 px-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-violet-300 dark:bg-violet-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white/70 dark:bg-dark-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-dark-800/50 rounded-2xl shadow-2xl p-8"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 shadow-lg text-white font-bold text-xl">
            S
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Smart Leads
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-dark-400">
            Enterprise Sales Lead Dashboard
          </p>
        </div>

        {children}
      </motion.div>
    </div>
  );
}
