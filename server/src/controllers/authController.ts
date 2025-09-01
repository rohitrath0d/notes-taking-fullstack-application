import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;

// // Signup
// export const signup = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required."
//       });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already in use."
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     const savedUser = await newUser.save();

//     const token = jwt.sign(
//       { id: savedUser._id },
//       JWT_SECRET!,
//       { expiresIn: "1h" });

//     return res.status(201).json({
//       success: true,
//       token,
//       user: savedUser,
//     });
//   } catch (error: string | any) {
//     return res.status(500).json({
//       message: "Signup failed.",
//       error: error.message,
//     });
//   }
// };

// // Login
// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required."
//       });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found."
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials."
//       });
//     }

//     const token = jwt.sign({ id: user._id }, JWT_SECRET!, { expiresIn: "1h" });

//     return res.status(200).json({
//       success: true,
//       token,
//       user
//     });

//   } catch (error: string | any) {
//     return res.status(500).json({
//       success: false,
//       message: "Login failed.", error: error.message
//     });
//   }
// };


// OTP-based Signup
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

// Temporary in-memory storage for OTPs (use Redis for production)
const otpStore: { [key: string]: { otp: string; expiresAt: number } } = {};

// Request OTP
export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res.status(400).json({ success: false, message: "Email already registered." });
    // }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otp);
    const expiresAt = Date.now() + OTP_EXPIRATION_TIME;

    // Store OTP in memory
    otpStore[email] = { otp, expiresAt };

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      // service: "smtp-relay.brevo.com",          // Use Sendinblue's SMTP
      // host: "smtp-relay.brevo.com",          // Use Sendinblue's SMTP
      host: "smtp.sendgrid.net",          // Use Sendinblue's SMTP
      // port: 587,
      port: 465,
      auth: {
        // user: process.env.SENDINBLUE_EMAIL_SERVICE_USER,
        // user: process.env.SENDGRID_EMAIL_SERVICE_USER,
        user: "apikey",
        pass: process.env.SENDGRID_EMAIL_SERVICE_PASS,
      },
    });

    const info = await transporter.sendMail({
      // from: process.env.SENDINBLUE_EMAIL_SERVICE_USER,
      // from: process.env.SENDGRID_EMAIL_SERVICE_PASS,
      from: "rohit.rthd.04@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });
    console.log("Domain info", info)

    // Return response indicating login or signup mode
    const mode = existingUser ? "login" : "signup";

    return res.status(200).json({
      success: true,
      message: "OTP sent to email.",
      mode
    });
  } catch (error: string | any ) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP.", 
      error: error.message
    });
  }
};

// Verify OTP and Complete Signup
export const verifyOtpAndLoginAndSignup = async (req: Request, res: Response) => {
  try {
    const { email, otp, name, password } = req.body;

    if (!email || !otp || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    const storedOtp = otpStore[email];
    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP."
      });
    }

    // if (storedOtp.expiresAt < Date.now()) {
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: "OTP has expired." 
    //   });
    // }

    // OTP is valid → check if user exists
    let user = await User.findOne({ email });     // User from mongodb model

    if (user) {
      // Existing user → login
      const token = jwt.sign({ id: user._id }, JWT_SECRET!, { expiresIn: "1h" });
      delete otpStore[email];
      return res.status(200).json({ success: true, mode: "login", token, user });
    } else {
      // New user → need name + password for signup
      if (!name || !password) {
        return res.status(400).json({ success: false, message: "Name and password are required for signup." });
      }

      // OTP is valid, create the user
      const hashedPassword = await bcrypt.hash(password, 10);

      // const newUser = new User({
      user = new User({                 // fetching the user from the let variable
        name,
        email,
        password: hashedPassword,
      });

      // const savedUser = await newUser.save();
      const savedUser = await user.save();

      // Generate JWT token
      const token = jwt.sign({ id: savedUser._id }, JWT_SECRET!, { expiresIn: "1h" });

      // Remove OTP from store
      delete otpStore[email];

      return res.status(201).json({
        success: true,
        token, user: savedUser
      });
    }

  } catch (error: any | string) {
    return res.status(500).json({
      success: false,
      message: "Signup failed.", error: error.message
    });
  }
};