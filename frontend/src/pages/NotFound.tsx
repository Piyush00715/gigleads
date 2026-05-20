import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-dark-900 border border-slate-200/60 dark:border-dark-800 rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-500/10 text-amber-500 mx-auto mb-6 shadow-inner">
          <Compass className="h-7 w-7 animate-spin-slow" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          404 - Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-dark-400 mb-8 max-w-xs mx-auto">
          The page you are looking for does not exist or has been relocated to another address.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all shadow-md hover:shadow-brand-500/20"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
