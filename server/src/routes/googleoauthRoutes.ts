import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as any;
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        provider: user.provider
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // res.redirect(`http://your-frontend-url?token=${token}`);

    // Option 2: Send as secure HTTP-only cookie
    // res.cookie("token", token, {
    //   httpOnly: true,                                          // The problem is that Google OAuth flow is setting the token as an HTTP-only cookie instead of returning it in a way that the frontend can access and store in localStorage. HTTP-only cookies are not accessible by JavaScript for security reasons.
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 3600000, // 1h
    // });

    // res.redirect("http://localhost:5173/dashboard");
    // Redirect to frontend with token as query parameter
    // res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    res.redirect(`${process.env.VITE_CLIENT_URL}/dashboard?token=${token}`);
  }
);

export default router;