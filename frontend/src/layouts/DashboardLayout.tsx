import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-dark-950 font-sans">
      {/* Desktop Sidebar (Left Sidebar fixed) */}
      <div className="hidden lg:flex h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            {/* Slide-out Sidebar container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <div className="relative h-full w-full">
                {/* Close drawer button inside sidebar */}
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="absolute right-4 top-4 p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area (Header + Child pages container) */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8 bg-slate-50/50 dark:bg-dark-950">
          {children}
        </main>
      </div>
    </div>
  );
}
