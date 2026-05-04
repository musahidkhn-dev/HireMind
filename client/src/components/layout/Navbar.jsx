import React, { useState } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast'; // FIXED: Add toast
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Menu, X, Sun, Moon, LogOut, LayoutDashboard, User, ChevronDown } from 'lucide-react';
import { toggleTheme } from '../../store/themeSlice';
import { logoutUser } from '../../store/authSlice';
import { ROLES } from '../../utils/constants';
import Button from '../common/Button';
import Avatar from '../common/Avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // FIXED: Add isLoggingOut state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mode } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // FIXED: Centralized logout handler
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    queryClient.clear();                              // 1. clear cache
    await dispatch(logoutUser());                     // 2. clear tokens
    
    toast.success('Logged out successfully');
    setIsProfileOpen(false);
    setIsOpen(false);
    navigate('/login', { replace: true });            // 3. go to login
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const toggleMobileMenu = () => setIsOpen(!isOpen);

  const profilePath = user?.role === ROLES.CANDIDATE 
    ? '/dashboard/candidate/profile' 
    : '/dashboard/company/profile';

  return (
    // REDESIGN: White bg, clean border, no glass blur effect
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0F0F0F]/80 backdrop-blur-md border-b border-border dark:border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-2xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
              <Brain className="text-white" size={24} />
            </div>
            <span className="text-2xl font-serif text-text-primary dark:text-white">
              Hire<span className="text-primary italic">Mind</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all relative py-2 ${
                    isActive ? 'text-primary' : 'text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 rounded-2xl border border-border dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-text-secondary dark:text-gray-400"
            >
              {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-sm font-medium text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="md" className="rounded-2xl shadow-xl shadow-primary/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 pl-4 rounded-2xl border border-border dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  <span className="text-sm font-medium text-text-primary dark:text-white">{user?.name?.split(' ')[0]}</span>
                  <Avatar src={user?.userImage} name={user?.name} size="sm" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-border dark:border-white/5 overflow-hidden p-2"
                    >
                      <div className="px-4 py-3 mb-2">
                        <p className="text-sm font-semibold text-text-primary dark:text-white">{user?.name}</p>
                        <p className="text-xs text-text-secondary dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <div className="space-y-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 p-3 text-sm text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                          <LayoutDashboard size={18} />
                          Dashboard
                        </Link>
                        <Link
                          to={profilePath}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 p-3 text-sm text-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                          <User size={18} />
                          Profile
                        </Link>
                        <div className="h-px bg-border dark:bg-white/5 my-2 mx-2" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 p-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <LogOut size={18} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={() => dispatch(toggleTheme())}
              className="p-2 text-text-secondary dark:text-gray-400"
            >
              {mode === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border dark:border-white/5 bg-white dark:bg-[#0F0F0F] overflow-hidden"
          >
            <div className="px-6 pt-4 pb-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-xl font-serif text-text-primary dark:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border dark:bg-white/5" />
              {!isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-center font-medium text-text-secondary dark:text-gray-400">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full shadow-xl shadow-primary/20">Get Started</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-text-primary dark:text-white">
                    <LayoutDashboard size={20} /> Dashboard
                  </Link>
                  <Link to={profilePath} onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-text-primary dark:text-white">
                    <User size={20} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-lg font-medium text-red-500"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
