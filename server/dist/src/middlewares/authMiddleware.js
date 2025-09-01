import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
export const authenticate = (req, res, next) => {
    // Next step would be to ensure your JWT auth middleware works seamlessly for Google OAuth users. Right now, the authenticate middleware reads the token from the header:
    // const token = req.headers.authorization?.split(" ")[1];
    // But with OAuth flow, the JWT is in a cookie. So for Google OAuth users, we would also want to check cookies as well to find the token in the cookie:
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided."
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token:", decoded);
        req.user = { id: decoded.id };
        console.log("User authenticated:", req.user);
        next();
        return;
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token. || unauthorized"
        });
    }
};
//# sourceMappingURL=authMiddleware.js.map