import express from "express";
import { createNote, getNotes, deleteNote, updateNote } from "../controllers/notesController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authenticate, createNote);
router.get("/get", authenticate, getNotes);
router.put("/update/:id", authenticate, updateNote);
router.delete("/delete/:id", authenticate, deleteNote);

export default router;