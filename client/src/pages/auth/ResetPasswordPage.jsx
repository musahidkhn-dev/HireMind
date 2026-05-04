import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Brain, Lock, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { authApi } from '../../api/authApi';
import { toast } from 'react-hot-toast';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [verifying, setVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
  });

  const password = watch('password', '');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerifying(false);
        return;
      }
      try {
        await authApi.verifyResetToken(token);
        setIsValid(true);
      } catch (err) {
        setIsValid(false);
      } finally {
        setVerifying(false);
      }
    };
    verifyToken();
  }, [token]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password: data.password });
      toast.success('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s += 25;
    if (/[A-Z]/.test(password)) s += 25;
    if (/[0-9]/.test(password)) s += 25;
    if (/[^A-Za-z0-9]/.test(password)) s += 25;
    return s;
  };

  if (verifying) return <Loader fullScreen text="Verifying reset link..." />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-12">
        <div className="p-2 bg-amber-600 rounded-lg">
          <Brain className="text-white" size={32} />
        </div>
        <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
          Hire<span className="text-amber-600">Mind</span>
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-800"
      >
        {!isValid ? (
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center text-red-600 mx-auto mb-8">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Invalid or Expired Link</h2>
            <p className="text-gray-500 mb-8">The password reset link is invalid or has expired. Please request a new one.</p>
            <Link to="/forgot-password" title="Go to Forgot Password">
              <Button className="w-full">Request New Link</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center">
               <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Set New Password</h1>
               <p className="text-gray-500">Your identity has been verified. Choose a secure new password.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Input 
                  label="New Password" 
                  type="password" 
                  placeholder="••••••••" 
                  icon={Lock} 
                  {...register('password')} 
                  error={errors.password?.message} 
                />
                {password && (
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${getPasswordStrength()}%` }}
                        className={`h-full ${getPasswordStrength() <= 50 ? 'bg-red-500' : 'bg-green-500'}`} 
                     />
                  </div>
                )}
              </div>
              
              <Input 
                label="Confirm New Password" 
                type="password" 
                placeholder="••••••••" 
                icon={Lock} 
                {...register('confirmPassword')} 
                error={errors.confirmPassword?.message} 
              />

              <Button type="submit" className="w-full h-12" loading={loading} icon={ShieldCheck}>
                Reset Password
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
