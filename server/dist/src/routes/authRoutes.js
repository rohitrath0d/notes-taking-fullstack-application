import express from "express";
import { requestOtp, verifyOtpAndLoginAndSignup } from "../controllers/authController.js";
// import { signup, login } from "../controllers/authController.js";
const router = express.Router();
// router.post("/signup", signup);
// router.post("/login", login);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtpAndLoginAndSignup);
export default router;
//# sourceMappingURL=authRoutes.js.map