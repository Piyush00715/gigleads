import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ShieldAlert } from 'lucide-react';

// Code Splitting / Lazy Loading for optimum production performance
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const LeadsList = lazy(() => import('../pages/LeadsList'));
const LeadDetails = lazy(() => import('../pages/LeadDetails'));
const Profile = lazy(() => import('../pages/Profile'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Global suspense loader placeholder
function SuspenseLoader() {
  return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 animate-spin mb-4">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <p className="text-xs font-semibold text-slate-400 dark:text-dark-400">
        Loading view components...
      </p>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/leads"
            element={
              <DashboardLayout>
                <LeadsList />
              </DashboardLayout>
            }
          />
          <Route
            path="/leads/:id"
            element={
              <DashboardLayout>
                <LeadDetails />
              </DashboardLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            }
          />
        </Route>

        {/* Fallback routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
