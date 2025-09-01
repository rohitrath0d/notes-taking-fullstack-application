import rateLimit from "express-rate-limit";

// Limit OTP requests to 5 per 10 minutes per IP
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit login attempts (local or Google callback)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 login attempts per IP
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  },
});
