import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Building2, Mail, Lock, User as UserIcon, Github } from 'lucide-react';
import { registerUser } from '../../store/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { toast } from 'react-hot-toast';

const registerSchema = z.object({
  role: z.enum(['candidate', 'recruiter']),
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms' }),
  }),
}).refine((data) => {
  if (data.role === 'recruiter' && !data.companyName) return false;
  return true;
}, {
  message: 'Company name is required for employers',
  path: ['companyName'],
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const { register, handleSubmit, watch, setError, clearErrors, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'candidate' }
  });

  const selectedRole = watch('role');
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && user && !redirected) {
      setRedirected(true);
      navigate('/dashboard', { replace: true });
    }
  }, [loading, isAuthenticated, user, redirected, navigate]);

  const onSubmit = async (data) => {
    try {
      clearErrors('root.serverError');
      await dispatch(registerUser(data)).unwrap();
      toast.success('Account created successfully!');
    } catch (err) {
      const errorMessage = err || 'Registration failed';
      setError('root.serverError', { message: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    // ✅ FIXED: Using Grid Layout for Auth Pages
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#0F0F0F]">
      
      {/* LEFT: FORM SECTION */}
      <div className="flex items-center justify-center px-6 md:px-12 lg:px-20 py-10 z-10 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link to="/" className="flex items-center gap-3 mb-10 group">
            <div className="p-2.5 bg-primary rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Brain className="text-white" size={26} />
            </div>
            <span className="text-2xl font-serif text-text-primary dark:text-white">HireMind</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-serif text-text-primary dark:text-white mb-2">Create Account</h1>
            <p className="text-text-secondary dark:text-gray-400 font-medium">Join the future of talent acquisition today.</p>
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl border border-border dark:border-white/5">
                 <label className={`flex items-center justify-center py-2.5 rounded-xl cursor-pointer transition-all font-bold text-xs ${selectedRole === 'candidate' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' : 'text-text-secondary'}`}>
                   <input type="radio" value="candidate" {...register('role')} className="hidden" />
                   Job Seeker
                 </label>
                 <label className={`flex items-center justify-center py-2.5 rounded-xl cursor-pointer transition-all font-bold text-xs ${selectedRole === 'recruiter' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' : 'text-text-secondary'}`}>
                   <input type="radio" value="recruiter" {...register('role')} className="hidden" />
                   Recruiter
                 </label>
            </div>

            <Input label="Full Name" placeholder="John Doe" icon={UserIcon} {...register('name')} error={errors.name?.message} />
            <Input label="Email Address" type="email" placeholder="john@example.com" icon={Mail} {...register('email')} error={errors.email?.message} />

            <AnimatePresence mode="popLayout">
              {selectedRole === 'recruiter' && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <Input label="Company Name" placeholder="Acme Inc." icon={Building2} {...register('companyName')} error={errors.companyName?.message} />
                </motion.div>
              )}
            </AnimatePresence>

            <Input label="Password" type="password" placeholder="••••••••" icon={Lock} {...register('password')} error={errors.password?.message} />

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" {...register('terms')} className="w-5 h-5 mt-0.5 rounded-lg border-border dark:border-white/10 text-primary focus:ring-primary/20" />
                <span className="text-xs text-text-secondary dark:text-gray-400 leading-relaxed">
                  I agree to the <Link to="/terms" className="text-primary font-bold hover:underline">Terms</Link> and <Link to="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
                </span>
              </label>
              {errors.terms && <p className="text-xs font-medium text-red-500 mt-1">{errors.terms.message}</p>}
            </div>

            <Button type="submit" size="xl" className="w-full rounded-2xl" loading={loading}>Create Account</Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border dark:border-white/5"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white dark:bg-[#0F0F0F] px-4 text-text-secondary transition-colors">Or continue with</span></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.href = "/api/auth/google"}
              className="flex items-center justify-center gap-3 py-3 rounded-xl border border-border dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-bold text-xs dark:text-white"
            >
               <svg size={18} viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
               Google
            </button>
            <button 
              onClick={() => window.location.href = "/api/auth/github"}
              className="flex items-center justify-center gap-3 py-3 rounded-xl border border-border dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-bold text-xs dark:text-white"
            >
               <Github size={18} />
               GitHub
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-text-secondary dark:text-gray-400 font-medium">
            Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* RIGHT: IMAGE SECTION (Hidden on mobile) */}
      <div className="hidden md:flex items-center justify-center bg-gray-50 dark:bg-[#151515] p-12 overflow-hidden relative transition-colors">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-lg text-center"
        >
          <img src="/images/auth-3d.png" alt="3D Auth Visual" className="w-full h-auto drop-shadow-2xl rounded-3xl mb-12" />
          <h2 className="text-4xl font-serif text-text-primary dark:text-white mb-4">Start your journey.</h2>
          <p className="text-text-secondary dark:text-gray-400 font-medium">Join 50,000+ professionals and companies already using HireMind.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
