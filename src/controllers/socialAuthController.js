import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import User from "../models/userModel.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ message: "Google token is required" });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // Create a new candidate user by default if they don't exist
            user = await User.create({
                name,
                email,
                userImage: picture,
                authProvider: 'google',
                googleId: sub,
                role: 'candidate',
                password: Math.random().toString(36).slice(-10), // Random password for oauth users
                isProfileComplete: false, // New users need onboarding
            });
        }

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        await User.findByIdAndUpdate(user._id, { refreshToken });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: 'Login Successful',
            accessToken,
            refreshToken,
            isProfileComplete: user.isProfileComplete,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                userImage: user.userImage,
            },
        });
    } catch (error) {
        console.error('googleAuth Error: ', error.message);
        return res.status(500).json({ message: 'Server error during Google auth' });
    }
};

export const handleSocialAuthCallback = async (req, res) => {
    try {
        const user = req.user;

        if(!user) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/login?error=Authentication failed`
            );
        }

        // IF NEW USER: Redirect to onboarding WITHOUT tokens
        if (!user.isProfileComplete) {
            return res.redirect(
                `${process.env.FRONTEND_URL}/complete-profile?userId=${user._id}`
            );
        }

        // IF EXISTING USER: Generate tokens and redirect to callback
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        await User.findByIdAndUpdate(user._id, { refreshToken });

        // Store tokens in cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Redirect to frontend callback route
        const redirectUrl = new URL(`${process.env.FRONTEND_URL}/social-callback`);
        redirectUrl.searchParams.append('accessToken', accessToken);
        redirectUrl.searchParams.append('refreshToken', refreshToken);
        redirectUrl.searchParams.append('isProfileComplete', 'true');

        console.log("Social Auth Redirecting to:", redirectUrl.toString());
        return res.redirect(redirectUrl.toString());
    } catch (error) {
        console.error('handleSocialAuthCallback Error: ', error.message);
        return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=Server error`
        );
    }
};



export const getSocialAuthUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('company', 'name industry logo');

        return res.status(200).json({ 
            user: {
                id: user._id,
                name: user.name,
                email: user.name,
                email: user.email,
                role: user.role,
                userImage: user.userImage,
                company: user.company,
                authProvider: user.authProvider,
            },
        });
    } catch (error) {
        console.error('getSocialAuthUser Error: ', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};