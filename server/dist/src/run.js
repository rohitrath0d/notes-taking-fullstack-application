import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
dotenv.config();
const app = express();
// Middleware
app.use(express.json());
// db connection
connectDB();
// routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=run.js.map