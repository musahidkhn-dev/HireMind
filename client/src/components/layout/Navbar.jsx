import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Menu, X, Sun, Moon, LogOut, LayoutDashboard, User, ChevronDown } from 'lucide-react';
import { toggleTheme } from '../../store/themeSlice';
import { logoutUser } from '../../store/authSlice';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import Avatar from '../common/Avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { mode } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      queryClient.clear();
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      setIsOpen(false);
      setIsProfileOpen(false);
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const toggleMobileMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 🏷️ Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-slate-950 dark:bg-white rounded-xl transition-all group-hover:scale-105 active:scale-95 shadow-lg shadow-slate-950/10 dark:shadow-white/5">
              <Brain className="text-white dark:text-slate-950" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              Hire<span className="text-indigo-600 dark:text-indigo-400">Mind</span>
            </span>
          </Link>

          {/* 💻 Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-all hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  location.pathname === link.path 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 🛠️ Desktop Actions */}
          <div className="hidden md:flex items-center gap-5">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Toggle Theme"
            >
              {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors px-3"
                >
                  Sign In
                </Link>
                <Link to="/register">
                  <button className="px-5 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-sm font-bold shadow-lg shadow-slate-900/10 dark:shadow-white/5 hover:scale-105 active:scale-95 transition-all">
                    Get Started
                  </button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1 pr-3 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-95"
                >
                  <Avatar src={user?.userImage} name={user?.name} size="sm" className="ring-1 ring-slate-100 dark:ring-slate-800" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

      {isProfileOpen && (
        <div
          className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
        >
          <div className="p-2 space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setIsProfileOpen(false)}
              className="flex items-center gap-3 p-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsProfileOpen(false)}
              className="flex items-center gap-3 p-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <User size={18} /> Profile
            </Link>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 p-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )}
</div>

{/* 📱 Mobile Toggle */}
<div className="md:hidden flex items-center gap-4">
   <button
    onClick={() => dispatch(toggleTheme())}
    className="p-2 text-slate-500 dark:text-slate-400"
  >
    {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
  </button>
  <button
    onClick={toggleMobileMenu}
    className="p-2.5 text-slate-950 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-xl active:scale-90 transition-transform"
    aria-label="Toggle Menu"
  >
    {isOpen ? <X size={20} /> : <Menu size={20} />}
  </button>
</div>
</div>
</div>

{/* 📱 Mobile Dropdown Menu (CLEAN & SIMPLE) */}
{isOpen && (
  <>
    {/* Overlay background to catch clicks outside */}
    <div 
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 top-16 bg-slate-950/20 backdrop-blur-sm z-40 md:hidden"
    />
    
    <div
      className="absolute top-full right-4 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 md:hidden overflow-hidden"
    >
      <div className="p-3 flex flex-col gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={`p-3.5 text-base font-bold rounded-xl transition-colors ${
              location.pathname === link.path
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
        
        <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2" />

        {!isAuthenticated ? (
          <div className="flex flex-col gap-2 p-1">
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <button className="w-full py-3 text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                Sign In
              </button>
            </Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>
              <button className="w-full py-3.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                Get Started
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <Link 
              to="/dashboard" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3.5 text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <LayoutDashboard size={20} className="text-slate-400" /> Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 p-3.5 text-base font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors text-left"
            >
              <LogOut size={20} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  </>
)}
    </nav>
  );
};

export default Navbar;
