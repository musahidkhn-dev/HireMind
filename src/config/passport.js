import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';
import CandidateProfile from '../models/candidateProfileModel.js';
import { refreshToken } from '../controllers/authController.js';

const getBaseUrl = () => process.env.BASE_URL || "http://localhost:8080";

//------- Google Strategy ------------------------------------------------------

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${getBaseUrl()}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const profileImage = profile.photos?.[0]?.value;

                if (!email) {
                    return done(new Error("Google email not available"), null);
                }

                // 1. Check if user already exists by email (Primary Identifier)
                let user = await User.findOne({ email: email.toLowerCase() });

                if (user) {
                    // Link Google ID if not already linked
                    let needsUpdate = false;
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        needsUpdate = true;
                    }
                    // Legacy support: update providerId if it was local/empty
                    if (!user.providerId || user.authProvider === 'local') {
                        user.authProvider = 'google';
                        user.providerId = profile.id;
                        needsUpdate = true;
                    }
                    if (needsUpdate) await user.save();
                    return done(null, user);
                }

                // 2. Create new user if doesn't exist
                user = await User.create({
                    name: profile.displayName,
                    email: email.toLowerCase(),
                    userImage: profileImage || '',
                    role: 'candidate',
                    authProvider: 'google',
                    providerId: profile.id,
                    googleId: profile.id,
                    isActive: true,
                    isProfileComplete: false,
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);


//------- GitHub Strategy ------------------------------------------------------

passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${getBaseUrl()}/api/auth/github/callback`,
            scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value || profile._json?.email;
                const profileImage = profile.photos?.[0]?.value;

                if (!email) {
                    return done(new Error("GitHub email not available. Please make your email public on GitHub."), null);
                }

                // 1. Check if user already exists by email (Primary Identifier)
                let user = await User.findOne({ email: email.toLowerCase() });

                if (user) {
                    // Link GitHub ID if not already linked
                    let needsUpdate = false;
                    if (!user.githubId) {
                        user.githubId = profile.id.toString();
                        needsUpdate = true;
                    }
                    // Legacy support: update providerId if it was local/empty
                    if (!user.providerId || user.authProvider === 'local') {
                        user.authProvider = 'github';
                        user.providerId = profile.id.toString();
                        needsUpdate = true;
                    }
                    if (needsUpdate) await user.save();
                    return done(null, user);
                }

                // 2. Create new user if doesn't exist
                user = await User.create({
                    name: profile.displayName || profile.username,
                    email: email.toLowerCase(),
                    userImage: profileImage || '',
                    role: 'candidate',
                    authProvider: 'github',
                    providerId: profile.id.toString(),
                    githubId: profile.id.toString(),
                    isActive: true,
                    isProfileComplete: false,
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);


export default passport;