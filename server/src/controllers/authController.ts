import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required." 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "Email already in use." 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id }, 
      JWT_SECRET!, 
      { expiresIn: "1h" });

    return res.status(201).json({ success: true,
       token, 
       user: savedUser, 
    });
  } catch (error: string | any) {
    return res.status(500).json({ 
      message: "Signup failed.", 
      error: error.message, 
    });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required." 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found." 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials." 
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET!, { expiresIn: "1h" });

    return res.status(200).json({ 
      success: true,
      token, 
      user 
    });

  } catch (error: string | any) {
    return res.status(500).json({ 
      success: false,
       message: "Login failed.", error: error.message 
    });
  }
};