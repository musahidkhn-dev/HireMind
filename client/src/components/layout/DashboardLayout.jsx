import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import NotificationsPopover from './NotificationsPopover';
import Avatar from '../common/Avatar';
import { toggleTheme } from '../../store/themeSlice';
import PageTransition from '../animations/PageTransition';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)} 
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />
      
      <div
        className={`transition-all duration-300 min-w-0 ${
          collapsed ? 'lg:ml-[100px]' : 'lg:ml-[280px]'
        }`}
      >
        <header className="h-16 lg:h-20 glass-premium border-b border-border/50 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3 lg:gap-6 flex-1">
             <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl border border-border dark:border-slate-700 shadow-sm"
             >
                <ChevronDown size={18} className="rotate-90" />
             </button>

             <div className="relative max-w-md w-full hidden sm:block group">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-gray-500 group-focus-within:text-primary transition-colors" />
               <input
                 type="text"
                 placeholder="Search..."
                 className="w-full pl-11 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-slate-700 rounded-xl lg:rounded-2xl text-xs lg:text-sm outline-none focus:bg-white dark:focus:bg-white/10 focus:border-primary/20 focus:ring-4 focus:ring-primary/5 dark:focus:ring-primary/10 transition-all dark:text-white"
               />
             </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 lg:p-2.5 rounded-xl lg:rounded-2xl text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-border dark:hover:border-white/10 transition-all"
              >
                {mode === 'light' ? <Moon size={18} className="lg:w-5 lg:h-5" /> : <Sun size={18} className="lg:w-5 lg:h-5" />}
              </button>

              <div className="relative">
                <NotificationsPopover 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(!showNotifications)} 
                />
              </div>
            </div>

            <div className="h-6 lg:h-8 w-px bg-border dark:bg-white/5" />

            <div className="flex items-center gap-2 lg:gap-4 group cursor-pointer pl-1 lg:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-primary dark:text-white group-hover:text-primary transition-colors">{user?.name}</p>
                <p className="text-[10px] font-bold text-text-secondary dark:text-gray-500 uppercase tracking-widest">{user?.role?.replace('_', ' ')}</p>
              </div>
              <div className="relative">
                <Avatar src={user?.userImage} name={user?.name} size="sm" className="rounded-xl lg:hidden" />
                <Avatar src={user?.userImage} name={user?.name} size="md" className="rounded-2xl hidden lg:block shadow-sm group-hover:shadow-md transition-shadow" />
                <div className="absolute -bottom-0.5 -right-0.5 lg:-bottom-1 lg:-right-1 w-3 h-3 lg:w-4 lg:h-4 bg-secondary border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-10 min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)] w-full max-w-full">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
