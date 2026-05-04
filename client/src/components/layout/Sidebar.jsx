import React, { useState } from 'react'; // FIXED: Add useState
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query'; // FIXED: Add useQueryClient
import { toast } from 'react-hot-toast'; // FIXED: Add toast
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  UserCircle, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  Brain,
  Layers,
  FileText,
  Building2,
  Bell
} from 'lucide-react';
import { logoutUser } from '../../store/authSlice';
import { ROLES } from '../../utils/constants';

const Sidebar = ({ collapsed, onToggle, isMobileOpen, onCloseMobile }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // FIXED: Initialize queryClient
  const [isLoggingOut, setIsLoggingOut] = useState(false); // FIXED: Add logging out state

  // FIXED: Updated logout handler to clear cache and tokens properly
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    queryClient.clear(); // 1. clear cache
    await dispatch(logoutUser()); // 2. clear tokens
    
    if (onCloseMobile) onCloseMobile();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true }); // 3. go to login
  };

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const candidateLinks = [
    { label: 'Dashboard', path: '/dashboard/candidate', icon: LayoutDashboard },
    { label: 'Applications', path: '/dashboard/candidate/applications', icon: FileText },
    { label: 'Profile', path: '/dashboard/candidate/profile', icon: UserCircle },
    { label: 'Notifications', path: '/dashboard/candidate/notifications', icon: Bell },
  ];

  const companyLinks = [
    { label: 'Dashboard', path: '/dashboard/company', icon: LayoutDashboard },
    { label: 'Jobs', path: '/dashboard/company/jobs', icon: Briefcase },
    { label: 'Applicants', path: '/dashboard/company/applicants', icon: Users },
    { label: 'Pipeline', path: '/dashboard/company/pipeline', icon: Layers },
    { label: 'Profile', path: '/dashboard/company/profile', icon: UserCircle },
    { label: 'Notifications', path: '/dashboard/company/notifications', icon: Bell },
  ];

  const adminLinks = [
    { label: 'Platform', path: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/dashboard/admin/users', icon: Users },
    { label: 'Companies', path: '/dashboard/admin/companies', icon: Building2 },
    { label: 'Jobs', path: '/dashboard/admin/jobs', icon: Briefcase },
  ];

  // FIXED: Handle both superadmin and legacy super_admin roles to prevent sidebar crashes
  let links = [];
  if (user?.role === ROLES.CANDIDATE) {
    links = candidateLinks;
  } else if (user?.role === ROLES.SUPERADMIN || user?.role === 'super_admin') {
    links = adminLinks;
  } else if (user?.role === ROLES.RECRUITER || user?.role === 'company_admin') {
    links = companyLinks;
  } else {
    links = []; // Fallback
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* REDESIGN: White bg sidebar with golden active link */}
      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? 100 : 280,
          x: (typeof window !== 'undefined' && window.innerWidth < 1024 && !isMobileOpen) ? -280 : 0
        }}
        className={`fixed left-0 top-0 bottom-0 z-50 bg-white dark:bg-[#0F0F0F] border-r border-border dark:border-white/5 flex flex-col transition-transform lg:transition-none ${
          isMobileOpen ? 'translate-x-0 w-[280px]' : ''
        }`}
      >
        <Link to="/" className="h-20 flex items-center px-8 gap-3 cursor-pointer group" onClick={handleLinkClick}>
          <div className="p-2 bg-primary rounded-2xl shrink-0 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
            <Brain className="text-white" size={24} />
          </div>
          {(!collapsed || isMobileOpen) && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-serif text-text-primary dark:text-white whitespace-nowrap"
            >
              Hire<span className="text-primary italic">Mind</span>
            </motion.span>
          )}
        </Link>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-bg"
                      className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-2xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <link.icon size={20} className={`shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-text-secondary dark:text-gray-400 group-hover:text-text-primary dark:group-hover:text-white'}`} />
                  {(!collapsed || isMobileOpen) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-bold text-sm tracking-tight"
                    >
                      {link.label}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute right-0 w-1 h-6 bg-primary rounded-l-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 space-y-2 border-t border-border dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-bold text-sm"
          >
            <LogOut size={20} className="shrink-0" />
            {(!collapsed || isMobileOpen) && <span>Logout</span>}
          </button>

          <button
            onClick={onToggle}
            className="hidden lg:flex w-full items-center gap-4 px-4 py-3 rounded-2xl text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-bold text-sm"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              className="shrink-0"
            >
              <ChevronLeft size={20} />
            </motion.div>
            {!collapsed && <span>Collapse Menu</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
