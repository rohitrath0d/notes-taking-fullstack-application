import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./db/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import passport from "passport";
import "./services/google-oauth.js"   // the strategy to be imported before routes to work properly
import googleoauthRoutes from "./routes/googleoauthRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// db connection
connectDB();



// Initialize passport middleware
app.use(passport.initialize());
// app.use(passport.session()); // optional if using sessions


// routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Mount the Google auth routes
app.use("/api/googleauth", googleoauthRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});