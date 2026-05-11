import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Brain, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { loginUser } from '../../store/authSlice';
import GlowButton from '../../components/animations/GlowButton';
import Input from '../../components/common/Input';
import PageTransition from '../../components/animations/PageTransition';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && user && !redirected) {
      setRedirected(true);
      const fromPath = location.state?.from?.pathname || '/dashboard';
      navigate(fromPath, { replace: true });
    }
  }, [loading, isAuthenticated, user, redirected, navigate, location]);

  const onSubmit = async (data) => {
    try {
      clearErrors('root.serverError');
      await dispatch(loginUser(data)).unwrap();
    } catch (err) {

      const errorMessage = err || 'Login failed';
      setError('root.serverError', { message: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-transparent">
      
      {/* LEFT: FORM SECTION */}
      <div className="flex items-center justify-center px-6 md:px-12 lg:px-20 py-10 z-10">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="p-2.5 bg-primary rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Brain className="text-white" size={26} />
            </div>
            <span className="text-2xl font-serif text-text-primary dark:text-white">HireMind</span>
          </Link>

          <div className="mb-10">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-serif text-text-primary dark:text-white mb-3"
            >
              Welcome back to <span className="gradient-neon-text font-bold italic">HireMind</span>
            </motion.h2>
            <p className="text-text-secondary dark:text-gray-400 font-medium">
              Access your dashboard and manage your hiring journey seamlessly.
            </p>
          </div>

          {/* ERROR DISPLAY */}
          {errors.root?.serverError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {errors.root.serverError.message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input label="Email Address" type="email" placeholder="name@company.com" icon={Mail} {...register('email')} error={errors.email?.message} />
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-widest text-text-secondary">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                 <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className={`w-full rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-white/5 pl-4 pr-12 py-3.5 text-sm text-text-primary dark:text-white outline-none focus:border-primary transition-all ${errors.password ? 'border-red-500' : ''}`}
                 />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
              </div>
            </div>
            <GlowButton type="submit" variant="glow" className="w-full rounded-2xl py-3.5" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </GlowButton>
          </form>

          <div className="mt-10 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border dark:border-slate-700"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white dark:bg-slate-900 px-4 text-text-secondary">Or continue with</span></div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4">
            <button 
              onClick={() => window.location.href = "/api/auth/google"}
              className="flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-border dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-bold text-sm dark:text-white"
            >
               <svg size={20} viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
               Continue with Google
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-text-secondary font-medium">
            New here? <Link to="/register" className="font-bold text-primary hover:underline">Join HireMind</Link>
          </p>
        </div>
      </div>

      {/* RIGHT: IMAGE SECTION (Premium Overhaul) */}
      <div className="hidden lg:flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-12 overflow-hidden relative transition-colors">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg"
        >
          {/* Main Card with Gradient */}
          <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-[#1A1A1A] dark:to-[#111111] rounded-[3rem] p-10 shadow-2xl border border-border dark:border-slate-700 overflow-hidden group">
             {/* Floating Micro-elements */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-6 left-6 w-12 h-12 bg-primary/20 rounded-2xl blur-xl" 
             />
             <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-10 right-10 w-16 h-16 bg-secondary/20 rounded-full blur-xl" 
             />

             <img 
               src="/images/auth-visual-premium.png" 
               alt="Cinematic Hiring Team" 
               className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-700 relative z-10 rounded-2xl" 
               loading="eager"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 rounded-2xl pointer-events-none mix-blend-overlay" />
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-4xl font-serif text-text-primary dark:text-white mb-4">The future of hiring.</h2>
            <p className="text-text-secondary dark:text-gray-400 font-medium max-w-md mx-auto">Experience AI-ranked talent and automated screening workflows.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
