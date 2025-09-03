import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
// import TemporaryCode from "../models/TemporaryCode.js";
// import User from "../models/userModel.js";
// import crypto from "crypto";


dotenv.config();

const router = express.Router();


router.get("/google", passport.authenticate("google",
  {
    scope: ["profile", "email"],
    session: false,
    failureRedirect: "/auth/error"
  }));

router.get(
  "/google/callback",
  passport.authenticate("google",
    {
      scope: ["profile", "email"],
      session: false,
      // failureRedirect: "/auth/error"

    }),
  async (req, res) => {
    try {
      const user = req.user as any;

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          googleId: user.googleId,
          provider: user.provider
        },
        process.env.JWT_SECRET!,
        { expiresIn: "2h" }
      );

      // res.redirect(`http://your-frontend-url?token=${token}`);

      // Option 2: Send as secure HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,                                          // The problem is that Google OAuth flow is setting the token as an HTTP-only cookie instead of returning it in a way that the frontend can access and store in localStorage. HTTP-only cookies are not accessible by JavaScript for security reasons.
        secure: process.env.NODE_ENV === "production",      // true in prod
        // sameSite: "strict",
        // sameSite: "lax",  // User agents should send the cookie for same-site requests and cross-site top level navigations - GET requests (e.g., clicking a link), but NOT for fetch/XHR/POST. Works for login redirects (Google OAuth redirect). Still won’t send cookies for most API requests between Netlify ↔ Render.
        sameSite: "none",   //  Required if frontend and backend are on different domains (Netlify ↔ Render). Must also set Secure: true (only works over HTTPS).
        // path: "/api/auth/check"
      });

      // res.redirect("http://localhost:5173/dashboard");
      // Redirect to frontend with token as query parameter

      // res.redirect(`http://localhost:5173/dashboard?token=${token}`);

      // Generate a temporary code (short-lived, 5 minutes)
      // const tempCode = crypto.randomBytes(32).toString('hex');

      // await TemporaryCode.create({
      //   code: tempCode,
      //   userId: user._id,
      //   expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      // });

      // res.redirect(`${process.env.VITE_CLIENT_URL}/dashboard?token=${token}`);
      // res.redirect(`${process.env.VITE_CLIENT_URL}/auth/callback?code=${tempCode}&type=google`);
      // res.redirect(`${process.env.VITE_CLIENT_URL}/dashboard`)
      res.redirect(`${process.env.VITE_CLIENT_URL}/auth/callback`)

    } catch (error) {
      console.error("Google OAuth callback error:", error);
      // res.redirect(`${process.env.VITE_CLIENT_URL}/?error=auth_failed`);
      // res.redirect("/auth/error");
    }
  }
);


// // Add a new endpoint to exchange temporary code for JWT
// router.post("/exchange-code", async (req, res) => {
//   try {
//     const { code } = req.body;

//     if (!code) {
//       return res.status(400).json({
//         success: false,
//         message: "Code is required"
//       });
//     }

//     // Find and validate the temporary code
//     const tempCode = await TemporaryCode.findOne({
//       code,
//       expiresAt: { $gt: new Date() }
//     });

//     if (!tempCode) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid or expired code"
//       });
//     }

//     // Get user data
//     const user = await User.findById(tempCode.userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         googleId: user.googleId,
//         provider: user.provider
//       },
//       process.env.JWT_SECRET!,
//       { expiresIn: "1h" }
//     );

//     // Delete the used temporary code
//     await TemporaryCode.deleteOne({ code });

//     return res.json({
//       success: true,
//       token,
//       user: {
//         name: user.name,
//         email: user.email,
//         googleId: user.googleId,
//         provider: user.provider
//       }
//     });

//   } catch (error) {
//     console.error("Code exchange error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// });


// Add this endpoint to check auth and return token
router.get("/check", async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: "No authentication token found" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // Optionally get user data from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return token to be stored in localStorage
    return res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Add logout endpoint to clear cookie
router.post("/logout", (_req, res) => {
  // res.clearCookie("auth_token", {
  res.clearCookie("token", {
    // path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production"
  });
  return res.json({ success: true, message: "Logged out successfully" });
});


export default router;