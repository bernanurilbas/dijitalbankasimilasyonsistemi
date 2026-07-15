import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './components/ui/Spinner';

// Layouts & Protection
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

// Customer Pages
const Dashboard = lazy(() => import('./pages/customer/Dashboard'));
const Accounts = lazy(() => import('./pages/customer/Accounts'));
const Transfers = lazy(() => import('./pages/customer/Transfers'));
const Cards = lazy(() => import('./pages/customer/Cards'));
const Bills = lazy(() => import('./pages/customer/Bills'));
const Investments = lazy(() => import('./pages/customer/Investments'));
const History = lazy(() => import('./pages/customer/History'));
const Settings = lazy(() => import('./pages/customer/Settings'));
const Profile = lazy(() => import('./pages/customer/Profile'));
const Support = lazy(() => import('./pages/customer/Support'));

// Staff Pages
const StaffDashboard = lazy(() => import('./pages/staff/StaffDashboard'));
const SupportTickets = lazy(() => import('./pages/staff/SupportTickets'));
const CustomerAccounts = lazy(() => import('./pages/staff/CustomerAccounts'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const StaffManagement = lazy(() => import('./pages/admin/StaffManagement'));
const SystemSettings = lazy(() => import('./pages/admin/SystemSettings'));

// App CSS
import './App.css';

// Root level redirect handler
const RootRedirect = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'staff':
      return <Navigate to="/staff" replace />;
    case 'customer':
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-textPrimary">
          <Spinner size="lg" />
        </div>
      }>
        <Routes>
          {/* Public Routes wrapped in AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          {/* Protected Dashboard Shell */}
          <Route element={<DashboardLayout />}>

            {/* Customer Panel */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Accounts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transfers"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Transfers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cards"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Cards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bills"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Bills />
                </ProtectedRoute>
              }
            />
            <Route
              path="/investments"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Investments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Support />
                </ProtectedRoute>
              }
            />

            {/* Bank Staff Panel */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/tickets"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <SupportTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/accounts"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <CustomerAccounts />
                </ProtectedRoute>
              }
            />

            {/* Administrator Panel */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <StaffManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SystemSettings />
                </ProtectedRoute>
              }
            />

            {/* Shared Profile & Settings pages */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                  <Settings />
                </ProtectedRoute>
              }
            />

          </Route>

          {/* Root fallback */}
          <Route path="/" element={<RootRedirect />} />

          {/* Wildcard catchall */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
