import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, setInitialized } from './store/authSlice';
import { ROLES } from './utils/constants';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CinematicLoader from './components/common/CinematicLoader';
import GradientBackground from './components/animations/GradientBackground';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load Pages
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const JobsPage = lazy(() => import('./pages/public/JobsPage'));
const JobDetailPage = lazy(() => import('./pages/public/JobDetailPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const CompanyPublicProfile = lazy(() => import('./pages/public/CompanyPublicProfile'));
const CandidatePublicProfile = lazy(() => import('./pages/public/CandidatePublicProfile'));

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const SocialCallback = lazy(() => import('./pages/auth/SocialCallback'));
const CompleteProfile = lazy(() => import('./pages/auth/CompleteProfile'));

const CandidateDashboard = lazy(() => import('./pages/candidate/CandidateDashboard'));
const MyApplications = lazy(() => import('./pages/candidate/MyApplications'));
const CandidateProfile = lazy(() => import('./pages/candidate/CandidateProfile'));

const CompanyDashboard = lazy(() => import('./pages/company/CompanyDashboard'));
const JobManagement = lazy(() => import('./pages/company/JobManagement'));
const CreateJob = lazy(() => import('./pages/company/CreateJob'));
const EditJob = lazy(() => import('./pages/company/EditJob'));
const Applicants = lazy(() => import('./pages/company/Applicants'));
const ApplicantDetail = lazy(() => import('./pages/company/ApplicantDetail'));
const KanbanPipeline = lazy(() => import('./pages/company/KanbanPipeline'));
const CompanyProfile = lazy(() => import('./pages/company/CompanyProfile'));
const ActivityPage = lazy(() => import('./pages/company/ActivityPage'));

const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const CompaniesPage = lazy(() => import('./pages/admin/CompaniesPage'));
const AdminJobsPage = lazy(() => import('./pages/admin/JobsPage'));

const AdminUserDetails = lazy(() => import('./pages/admin/AdminUserDetails'));
const AdminCompanyDetails = lazy(() => import('./pages/admin/AdminCompanyDetails'));
const AdminJobDetails = lazy(() => import('./pages/admin/AdminJobDetails'));

const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));

const RoleRedirect = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const token = localStorage.getItem('accessToken');
  
  if (loading) return <CinematicLoader fullScreen text="Verifying session..." />;
  if (!token) return <Navigate to="/login" replace />;
  if (!user) return <CinematicLoader fullScreen text="Fetching profile..." />;

  switch (user?.role) {
    case 'candidate': return <Navigate to="/dashboard/candidate" replace />;
    case 'company_admin':
    case 'recruiter': return <Navigate to="/dashboard/company" replace />;
    case 'super_admin': 
    case 'superadmin': return <Navigate to="/dashboard/admin" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

import Lenis from "@studio-freight/lenis";

const App = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.8 });
    window.lenis = lenis;
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) dispatch(fetchCurrentUser());
    else dispatch(setInitialized());
  }, [dispatch]);

  useEffect(() => {
    if (mode === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [mode]);

  return (
    <div className="min-h-screen">
      <GradientBackground />
      <Suspense fallback={<CinematicLoader fullScreen />}>
        <Routes location={location}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/company/:id" element={<CompanyPublicProfile />} />
            <Route path="/candidate/:id" element={<CandidatePublicProfile />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/social-callback" element={<SocialCallback />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/dashboard" element={<RoleRedirect />} />
          <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['superadmin', 'super_admin']}><ErrorBoundary><DashboardLayout /></ErrorBoundary></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<AdminUserDetails />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="companies/:id" element={<AdminCompanyDetails />} />
            <Route path="jobs" element={<AdminJobsPage />} />
            <Route path="jobs/:id" element={<AdminJobDetails />} />
          </Route>
          <Route path="/dashboard/candidate" element={<ProtectedRoute allowedRoles={['candidate']}><ErrorBoundary><DashboardLayout /></ErrorBoundary></ProtectedRoute>}>
            <Route index element={<CandidateDashboard />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="profile" element={<CandidateProfile />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="/dashboard/company" element={<ProtectedRoute allowedRoles={['company_admin', 'recruiter']}><ErrorBoundary><DashboardLayout /></ErrorBoundary></ProtectedRoute>}>
            <Route index element={<CompanyDashboard />} />
            <Route path="jobs" element={<JobManagement />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/edit/:id" element={<EditJob />} />
            <Route path="applicants" element={<Applicants />} />
            <Route path="applicants/:id" element={<ApplicantDetail />} />
            <Route path="pipeline" element={<KanbanPipeline />} />
            <Route path="profile" element={<CompanyProfile />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
