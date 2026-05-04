import jwt from "jsonwebtoken";

// Short lived access token - 15 minutes
export const generateAccessToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: '1h'}
    );
};

// Long lived refresh token - 7 Days
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};


// Keep this for backward compatibility
// export default generateAccessToken;