import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import NotificationsPopover from './NotificationsPopover';
import Avatar from '../common/Avatar';
import { toggleTheme } from '../../store/themeSlice';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#0F0F0F] transition-colors duration-300">
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
        <header className="h-20 bg-white/80 dark:bg-[#0F0F0F]/80 backdrop-blur-md border-b border-border dark:border-white/5 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 md:gap-6 flex-1">
             <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl border border-border dark:border-white/5 shadow-sm"
             >
                <ChevronDown size={20} className="rotate-90" />
             </button>

             <div className="relative max-w-md w-full hidden sm:block group">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-gray-500 group-focus-within:text-primary transition-colors" />
               <input
                 type="text"
                 placeholder="Search for anything..."
                 className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl text-sm outline-none focus:bg-white dark:focus:bg-white/10 focus:border-primary/20 focus:ring-4 focus:ring-primary/5 dark:focus:ring-primary/10 transition-all dark:text-white"
               />
             </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2.5 rounded-2xl text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-border dark:hover:border-white/10 transition-all"
              >
                {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              <div className="relative">
                <NotificationsPopover 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(!showNotifications)} 
                />
              </div>
            </div>

            <div className="h-8 w-px bg-border dark:bg-white/5" />

            <div className="flex items-center gap-3 md:gap-4 group cursor-pointer pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-primary dark:text-white group-hover:text-primary transition-colors">{user?.name}</p>
                <p className="text-[10px] font-bold text-text-secondary dark:text-gray-500 uppercase tracking-widest">{user?.role?.replace('_', ' ')}</p>
              </div>
              <div className="relative">
                <Avatar src={user?.userImage} name={user?.name} size="md" className="rounded-2xl shadow-sm group-hover:shadow-md transition-shadow" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary border-2 border-white dark:border-[#0F0F0F] rounded-full" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 min-h-[calc(100vh-80px)] w-full max-w-full">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>

  );
};

export default DashboardLayout;
