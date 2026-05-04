import express from 'express'
import { 
    register,
    login,
    getMe,
    logOut,
    refreshToken,
    forgotPassword,
    verifyResetToken,
    resetPassword,
    forgotPasswordOtp,
    verifyOTP,
    resetPasswordWithOTP, // FIXED: Changed from resetPasswordDual to resetPasswordWithOTP
    getSecurityQuestion,
    updateSecuritySettings,
    completeProfile,
} from '../controllers/authController.js'
import {protect} from "../middleware/authMiddleware.js"
import { getSocialAuthUser, handleSocialAuthCallback, googleAuth } from '../controllers/socialAuthController.js';
import passport from 'passport';

const router = express.Router();

// Local auth ----------------
router.post("/register", register);
router.post('/login',login);
router.post('/forgot-password', forgotPassword);

// FIXED: OTP Routes
router.post('/forgot-password-otp', forgotPasswordOtp);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password-otp', resetPasswordWithOTP);

router.post('/get-security-question', getSecurityQuestion);
router.patch('/security-settings', protect, updateSecuritySettings);
router.post('/complete-profile', completeProfile);
router.get('/verify-reset-token/:token', verifyResetToken);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.get('/me',protect, getMe);
router.post('/logout', protect, logOut);

//-------- Google auth ----------------------
router.post('/google', googleAuth); // Frontend-based flow (google-auth-library)
router.get('/google/passport', (req, res, next) => {
    console.log("Google login triggered");
    next();
}, passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account',
    accessType: 'offline'
})); // Backend-based flow (passport)

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=Google auth failed`,
        session: false,
    }),
    handleSocialAuthCallback
);


//---------- GitHub Auth-------------]
router.get(
    '/github',
    passport.authenticate('github', {
        scope: ['user:email'],
        session: false,
    })
);

router.get(
    '/github/callback',
    passport.authenticate('github',{
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=GitHub auth failed`,
        session: false,
    }),
    handleSocialAuthCallback
);


//------ Get user after social redirect -----------
router.get('/social/me', protect, getSocialAuthUser);



export default router;
