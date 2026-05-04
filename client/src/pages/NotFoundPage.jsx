import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12"
        >
          <motion.h1 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-[12rem] font-black leading-none gradient-text opacity-20 select-none"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <AlertTriangle size={80} className="text-amber-600 animate-pulse" />
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.3 }}
        >
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Lost in the Cloud?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">
             The page you are looking for doesn't exist or has been moved to a new dimension.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Button 
              size="lg" 
              icon={Home} 
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-10"
             >
                Go Back Home
             </Button>
             <Button 
              size="lg" 
              variant="outline" 
              icon={Search} 
              onClick={() => navigate('/jobs')}
              className="w-full sm:w-auto px-10"
             >
                Browse Jobs
             </Button>
          </div>
        </motion.div>

        {/* Decorative Grid Backdrop */}
        <div className="fixed inset-0 -z-10 opacity-5 pointer-events-none">
           <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
