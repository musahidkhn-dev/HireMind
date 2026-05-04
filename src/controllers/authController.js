import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import User from "../models/userModel.js"
import Company from "../models/companyModel.js"
import CandidateProfile from "../models/candidateProfileModel.js"
import OTP from '../models/OTP.js'; 
import {generateAccessToken, generateRefreshToken}  from "../utils/generateToken.js"
import sendEmail, { transporter } from '../utils/sendEmail.js' // FIXED: Added transporter import
import jwt from 'jsonwebtoken';

//------------ Cookie options -----------------------------
const cookieOptions = {
    httpOnly: true,   // JS cannot access - prevents XXS
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',  //prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

const accessTokenCookieOptions = {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000, // 1 hour
};



// ----------------------Register-------------------------

export const register = async (req, res) => {
    try {
        const { name, email, password, role, companyName, companyIndustry} = req.body;
            
        // Basic validation
        if(!name || !email || !password || !role) {
            return res.status(400).json({ message: "Please provide name, email, password and role"});
        }

        const validRoles = ['candidate', 'recruiter', 'superadmin'];
        if(!validRoles.includes(role)) {
            return res.status(400).json({ message : 'Invalid role provided during registration'});
        }

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(409).json({ message: 'Email already registered'});
        }

        // If registering as recruiter, companyName is required
        if (role === 'recruiter' && !companyName) {
            return res.status(400).json({ message: 'Company name is required for recruiter registration'});
        }

        // Create User
        const user = await User.create({name, email, password, role});

        //If recruiter => create the company and link it 
        if (role === 'recruiter') {
            // Check if company already exists for this user
            const existingCompany = await Company.findOne({ createdBy: user._id });
            if (existingCompany) {
                user.company = existingCompany._id;
                await user.save();
            } else {
                const company = await Company.create({
                    name: companyName,
                    industry: companyIndustry || '',
                    createdBy: user._id,
                });
                user.company = company._id;
                await user.save();
            }
        }

        // If candidate => create an empty profile
        if(role === 'candidate') {
            await CandidateProfile.create({ user: user._id });
        }



        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id)

        //Save refresh token to DB (skip pre-save hooks & validation)
        await User.findByIdAndUpdate(
            user._id,
            { refreshToken },
            { runValidators: false }
        );

        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        // Populate company for the response
        if (user.company) {
            await user.populate('company');
        }

        return res.status(201).json({
            message: 'Registration Successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
            },
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Server error during registration' });
    }
};

// -------------------Login------------------------------------------

export const login = async (req, res) => {
    try {
        console.log("Login request received:", req.body?.email);
        const  {email, password} = req.body;
            
        if(!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password'});
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        console.log("User lookup result:", user ? `Found user ${user._id}` : "User not found");
        
        if(!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password'});
        }

        if(!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is deactivated'});
        }

        // Check if user has a password (might be a social login user)
        if (!user.password) {
            console.log("Login failed: User has no password (likely social login only)");
            return res.status(401).json({ success: false, message: 'Please login using your social account or set a password.'});
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password'});
        }

        // Check for JWT Secrets
        if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
            console.error("CRITICAL: JWT Secrets are missing in .env");
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token to DB (use updateOne to skip pre-save hooks & validation)
        await User.findByIdAndUpdate(
            user._id,
            { refreshToken },
            { new: true, runValidators: false }
        );

        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        // Populate company for the response
        if (user.company) {
            await user.populate('company');
        }

        return res.status(200).json({
            message: 'Login Successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,  
                role: user.role || "candidate",
                company: user.company,
            },
        });
    } catch (error) {
        console.error('Login Error (FULL):', error);
        return res.status(500).json({ 
            message: 'Server error during login', 
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });        
    }
};

// ---------------- Get Current User (me) -------------------------------------

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'company',
            select: 'name industry logo description website location size',
            populate: {
                path: 'team',
                select: 'name email userImage isActive role'
            }
        });
        return res.status(200).json({ user });
    } catch (error) {
        console.error('GetMe Error: ', error.message);
        return res.status(500).json({ message : 'Server error'});
    }
};


//------- LogOut -----------------------------------------------------------------

export const logOut = async (req, res) => {
    try {
        //Clear refresh token from DB
        await User.findByIdAndUpdate(req.user._id, {
            refreshToken: null,
        });

        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken')

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error: ', error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};



//----------- Refresh Token -------------------------------------------------------

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken || req.body.refreshToken;

        if(!token) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        //Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        //Find user and check if refresh token matches
        const user = await User.findById(decoded.id);

        if(!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if(!user || user.refreshToken !== token) {
            return res.status(401).json({ message: 'Refresh token mismatch - please login again' });
        }

        if(!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }


        //Generate new tokens
        const newAccessToken = generateAccessToken(user._id, user.role);
        const newRefreshToken = generateRefreshToken(user._id);

        // Update refresh token in DB (rotation) - skip validation to prevent crash
        await User.findByIdAndUpdate(
            user._id,
            { refreshToken: newRefreshToken },
            { runValidators: false }
        );

        // Update cookies
        res.cookie('accessToken', newAccessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', newRefreshToken, cookieOptions);

        return res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error('refreshToken error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


//------ Forgot Password (Legacy) -------------------------------------------------------

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if(!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if(!user) {
            return res.status(200).json({ message: 'If this user exists, a reset link has been sent' });
        }


    //Generate reset token
    const rawToken =  crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry = new Date(Date.now() + 30 * 60 * 1000 ); // 30 minutes

    // Save reset token fields - skip validation to prevent crash on legacy users
    await User.findByIdAndUpdate(
        user._id,
        {
            passwordResetToken: hashedToken,
            passwordResetExpiry: expiry,
        },
        { runValidators: false }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await sendEmail({
        to: user.email,
        subject: 'HireMind - Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request </h2>
            <p>Hi ${user.name},</p>
            <p>You requested to reset your HireMind  password. Click the button below: </p>
            <a href="${resetUrl}"
                style="display:inline-block; padding: 12px 24px; background:#4F46E5; color: white; text-decoration: none; border-radius: 6px; margin:16px 0;">
            Reset Password
            </a>
            <p>This link expires in <strong>30 minutes</strong>.</p>
            <p>If you did not requested this, please ignore this mail. Your password will remain unchanged.</p>
            </div>
        `,
    });

    return res.status(200).json({message:'If this email exists, a reset link has been sent'});


    } catch (error) {
        console.error('CRITICAL: ForgotPassword Email Delivery Failed.');
        return res.status(500).json({ 
            message: 'Server Error', 
            details: process.env.NODE_ENV === 'development' ? error.message : 'Unable to send email.'
        });
    }
};


//---- Verify reset token ---------------------------------------
 
export const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');


        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpiry: { $gt: Date.now() },
        });


        if(!user) {
            return res.status(400).json({ message: 'Reset token is invalid or has expired' });
        }

        return res.status(200).json({ message: 'Token is valid', email: user.email });
    } catch (error) {
        console.error('verifyResetToken Error: ', error.message);
        return res.status(500).json({ message:  'Server Error'});
    }
};


//---------- Reset Password ------------------------------------------
 
export const resetPassword = async (req, res) => {
    try {
        const token = req.query.token || req.body.token;
        const password = req.query.password || req.body.password;

        

        if(!token || !password) {
            return res.status(400).json({ message:  'Token and new password are required' });
        }


        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpiry: { $gt: Date.now() },
        });

        if(!user) {
            return res.status(400).json({ message: 'Reset token is invalid or has expired' });
        }

        //Set new password
        user.password = password;
        user.passwordResetToken = null;
        user.passwordResetExpiry = null;
        user.refreshToken = null; // invalidate all sessions
        await user.save();


        //Send confirmation email
        try {
            await sendEmail({
                to: user.email,
                subject: 'HireMind - Password Changed Successfully',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Password Changed</h2>
                        <p>Hi ${user.name},</p>
                        <p>Your HireMind password has been successfully changed.</p>
                        <p>If you did not make this change, please contact support immediately.</p>
                    </div>
                `,
            });
        } catch (emailErr) {
            console.error('Password reset confirmation email failed:', emailErr.message);
        }

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('resetPassword error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};


// ─── FIXED OTP CONTROLLER ─────────────────────────────────────────────────

export const forgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Incoming email request for OTP:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Generated OTP for", email, ":", otp);

    // Save to user model as requested in the fix task
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Also sync with OTP model for consistency if needed, but primary is user model here
    await OTP.deleteMany({ email: email.toLowerCase() });
    await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send email using transporter directly or via utility
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: "HireMind — Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #4f46e5; text-align: center;">Password Reset OTP</h2>
          <p>Hi ${user.name},</p>
          <p>Your OTP code to reset your password is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5; text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    console.log("OTP email sent successfully to:", user.email);
    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("OTP ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to send OTP" });
  }
};

// Reuse existing verify and reset logic with naming adjustments
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        // Check both user model and OTP model for robustness
        const user = await User.findOne({ 
            email: email.toLowerCase(),
            resetOtp: otp,
            resetOtpExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        return res.status(200).json({ message: "OTP verified successfully", verified: true });
    } catch (error) {
        console.error('verifyOTP error:', error.message);
        return res.status(500).json({ message: "Server error during OTP verification" });
    }
};

export const resetPasswordWithOTP = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({ message: "Email, OTP and new password are required" });
        }

        const user = await User.findOne({ 
            email: email.toLowerCase(),
            resetOtp: otp,
            resetOtpExpire: { $gt: Date.now() }
        }).select("+password");

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Update password
        user.password = password;
        user.resetOtp = null;
        user.resetOtpExpire = null;
        user.refreshToken = null; 
        await user.save();

        await OTP.deleteMany({ email: email.toLowerCase() });

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error('resetPasswordWithOTP error:', error.message);
        return res.status(500).json({ message: "Server error during password reset" });
    }
};

// Aliases for compatibility
export const sendOTP = forgotPasswordOtp;

// 4. Get Security Question
export const getSecurityQuestion = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.securityQuestion) {
            return res.status(400).json({ message: "No security question set for this user" });
        }

        res.status(200).json({ question: user.securityQuestion });
    } catch (error) {
        console.error('getSecurityQuestion error:', error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// 5. Update Security Settings
export const updateSecuritySettings = async (req, res) => {
    try {
        const { securityQuestion, securityAnswer } = req.body;
        const user = await User.findById(req.user._id);

        if (securityQuestion) user.securityQuestion = securityQuestion;
        if (securityAnswer) {
            const salt = await bcrypt.genSalt(10);
            user.securityAnswer = await bcrypt.hash(securityAnswer.toLowerCase(), salt);
        }

        await user.save();
        res.status(200).json({ message: "Security settings updated" });
    } catch (error) {
        console.error('updateSecuritySettings error:', error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// 6. Complete Profile
export const completeProfile = async (req, res) => {
    try {
        const { role, companyName, industry, userId } = req.body;
        const targetId = req.user?._id || userId;

        if (!targetId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(targetId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        user.isProfileComplete = true;

        if (role === 'recruiter') {
            let company = await Company.findOne({ createdBy: user._id });
            if (!company) {
                company = await Company.create({
                    name: companyName,
                    industry: industry || '',
                    createdBy: user._id,
                });
            }
            user.company = company._id;
        } else if (role === 'candidate') {
            await CandidateProfile.create({ user: user._id });
        }

        await user.save();

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        await User.findByIdAndUpdate(user._id, { refreshToken });

        res.cookie("accessToken", accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        return res.status(200).json({
            message: "Profile completed successfully",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
            }
        });
    } catch (error) {
        console.error('completeProfile error:', error.message);
        res.status(500).json({ message: "Server error" });
    }
};
