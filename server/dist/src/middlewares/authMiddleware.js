import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided."
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id };
        next();
        return;
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token."
        });
    }
};
//# sourceMappingURL=authMiddleware.js.map