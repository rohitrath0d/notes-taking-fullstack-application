import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
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