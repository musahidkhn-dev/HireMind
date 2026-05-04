import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../api/authApi.js';
import toast from 'react-hot-toast';

// FIXED: Complete OTP flow implementation as requested in Step 7
export default function ForgotPasswordPage() {
  const [step, setStep] = useState('method'); // method|email|otp|reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  // Send OTP mutation
  const { mutate: sendOTP, isPending: sending } = useMutation({
    mutationFn: () => authApi.sendOTP(email),
    onSuccess: () => {
      toast.success('OTP sent to your email!');
      setStep('otp');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to send OTP');
    },
  });

  // Verify OTP mutation
  const { mutate: verifyOTP, isPending: verifying } = useMutation({
    mutationFn: () => authApi.verifyOTP(email, otp),
    onSuccess: () => {
      toast.success('OTP verified!');
      setStep('reset');
    },
    onError: () => {
      toast.error('Invalid or expired OTP');
    },
  });

  // Reset password mutation
  const { mutate: resetPw, isPending: resetting } = useMutation({
    mutationFn: () => authApi.resetPasswordWithOTP(email, otp, password),
    onSuccess: () => {
      toast.success('Password reset successfully!');
      navigate('/login');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Reset failed');
    },
  });

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');
    sendOTP();
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');
    verifyOTP();
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (password.length < 6)
      return toast.error('Password min 6 characters');
    if (password !== confirm)
      return toast.error('Passwords do not match');
    resetPw();
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8
                      border border-gray-800">

        {/* STEP: choose method */}
        {step === 'method' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white text-center">
              Choose Method
            </h1>
            <p className="text-gray-400 text-center text-sm">
              How would you like to reset your password?
            </p>
            <button
              onClick={() => setStep('email')}
              className="w-full flex items-center gap-4 p-4 rounded-xl
                         border border-gray-700 hover:border-amber-500
                         text-left transition-colors"
            >
              <div className="w-10 h-10 bg-amber-900/50 rounded-xl
                              flex items-center justify-center text-amber-400 font-bold">
                ✉
              </div>
              <div>
                <p className="font-semibold text-white">Email OTP</p>
                <p className="text-sm text-gray-400">
                  Send a 6-digit code to your email
                </p>
              </div>
            </button>
          </div>
        )}

        {/* STEP: enter email */}
        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <button
              type="button"
              onClick={() => setStep('method')}
              className="text-sm text-gray-400 hover:text-white
                         flex items-center gap-1"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-white">
              Enter your email
            </h1>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800
                         border border-gray-700 text-white
                         focus:outline-none focus:border-amber-500"
              required
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 gradient-primary text-white
                         rounded-xl font-medium disabled:opacity-50"
            >
              {sending ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* STEP: enter OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <h1 className="text-2xl font-bold text-white">
              Enter OTP
            </h1>
            <p className="text-gray-400 text-sm">
              Check your email <strong className="text-white">{email}</strong>
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl bg-gray-800
                         border border-gray-700 text-white text-center
                         text-2xl tracking-widest
                         focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={verifying || otp.length !== 6}
              className="w-full py-3 gradient-primary text-white
                         rounded-xl font-medium disabled:opacity-50"
            >
              {verifying ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => sendOTP()}
              className="w-full text-sm text-amber-400 hover:underline"
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* STEP: reset password */}
        {step === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <h1 className="text-2xl font-bold text-white">
              New Password
            </h1>
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800
                         border border-gray-700 text-white
                         focus:outline-none focus:border-amber-500"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800
                         border border-gray-700 text-white
                         focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={resetting}
              className="w-full py-3 gradient-primary text-white
                         rounded-xl font-medium disabled:opacity-50"
            >
              {resetting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-amber-400 hover:underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
