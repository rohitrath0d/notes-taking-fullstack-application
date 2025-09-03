import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import passport from "passport";
import "./services/google-oauth.js"   // the strategy to be imported before routes to work properly
import googleoauthRoutes from "./routes/googleoauthRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// enable cors & corsOptions
const corsOptions    = {
    // origin:'http://localhost:8080',       // --> this request should be coming from frontend
    origin: process.env.VITE_CLIENT_URL,
    credentials: true,                                      // as we are using cookie, credentials will be true.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};



// app.use(cors({
//   origin: "http://localhost:5173",  // frontend origin
//   credentials: true,                // allow cookies / auth headers
// }));
app.use(cors(corsOptions));
app.use(cookieParser());


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

app.get("/", (_req, res) => {
  res.send("Notes Taking web app Backend API is all up & running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

