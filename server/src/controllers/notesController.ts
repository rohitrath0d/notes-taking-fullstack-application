import  type { Request, Response } from "express";
import Note from "../models/notesModel.js";

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = req.user?.id;        // Assuming `req.user` is populated by auth middleware
    console.log("User ID from create note req.user:", userId);
    
    if (!title || !content) {
      return res.status(400).json({ 
        message: "Title and content are required." 
      });
    }

    const newNote = new Note({
      title,
      content,
      userId,
    }); 

    const savedNote = await newNote.save();
    return res.status(201).json(savedNote);
  } catch (error: string | any) {
    return res.status(500).json({ 
      success: false,
      message: "Failed to create note.", 
      error: error.message 
    });
  }
};

// Get all notes for the logged-in user
export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log("User ID from get note req.user:", userId)

    const notes = await Note.find({ userId });
    return res.status(200).json({
      success: true, 
      notes: notes
    });
  } catch (error: string | any) {
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch notes.", 
      error: error.message 
    });
  }
};

// Delete a note by ID
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    console.log("User ID from delete note req.user:", userId)

    const note = await Note.findOneAndDelete({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: "Note not found or unauthorized." 
      });
    }

    return res.status(200).json({ 
      success: true,
      message: "Note deleted successfully." 
    });
  } catch (error: string | any) {
    return res.status(500).json({ message: "Failed to delete note.", error: error.message });
  }
};