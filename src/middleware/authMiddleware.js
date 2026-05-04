import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

// Verify Token And Attach User To Request
export const protect = async (req, res, next) => {
    try {
        
        let token;

        const authHeader = req.headers.authorization;
        
        if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        } else if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if(!token) {
            return res.status(401).json({ message: 'No token, authorization denied'})
        }
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = await User.findById(decoded.id).select('-password');

        if(!req.user) {
            return res.status(404).json({ message: 'User Not Found!'});
        }

        console.log("Authenticated User ID:", req.user._id);
        console.log("User Role:", req.user.role);

        // Block users who haven't completed onboarding (explicitly false)
        if (req.user.isProfileComplete === false) {
            return res.status(403).json({ 
                message: 'Onboarding incomplete. Please complete your profile first.',
                onboardingRequired: true 
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({ message: 'Token Invalid or Expired'});
    }
};


// Role-based access control - pass allowed roles as arguments
// Usage: authorizeRoles('recruiter', 'candidate')
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // FIXED: Grant global access to both superadmin and legacy super_admin
        const isSuperAdmin = req.user.role === 'superadmin' || req.user.role === 'super_admin';
        if(!roles.includes(req.user.role) && !isSuperAdmin) {
            return res.status(403).json({
                message: `Access denied. Required roles: ${roles.join(', ')}`,
            });
        }
        next()
    };
};

