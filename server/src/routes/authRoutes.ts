import express from "express";
import { requestOtp, verifyOtpAndLoginAndSignup } from "../controllers/authController.js";
// import { signup, login } from "../controllers/authController.js";
import { otpLimiter, loginLimiter } from "../services/rate-limiter.js";

const router = express.Router();

// router.post("/signup", signup);
// router.post("/login", login);

router.post("/request-otp", otpLimiter, requestOtp);
router.post("/verify-otp", loginLimiter, verifyOtpAndLoginAndSignup);


export default router;