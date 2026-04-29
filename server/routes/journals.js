import mongoose from "mongoose";
import Journal from "../schema/journal.js";
import express from "express";
import database from "../database/connection.js";
import User from "../schema/user.js";
import Error from "../schema/error.js";
import axios from "axios";
import JournalEntry from "../schema/journalEntry.js";
import authenticateToken from "../authentication/authenticateToken.js";
import user from "../schema/user.js";

const router = express.Router();

//Journal should remove or add the page functionality to the app for better sync
router.get("/journalOverview/:journalId", async (req, res, next) => {
  try {
    const { journalId } = req.params;

    //query the journal object
    const journal = await Journal.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "User not found" });
    }

    //then query the journal paginated pages assosiated
    const { page = 1, limit = 15 } = req.query;

    const entries = await JournalEntry.paginate(
      { journalID: journalId },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { dateCreated: -1 },
      },
    );

    res.json({
      journal,
      entries: {
        docs: entries.docs,
        totalPages: entries.totalPages,
        currentPage: entries.page,
        totalDocs: entries.totalDocs,
      },
    });
  } catch (error) {
    next(error);
  }
});
router.get("/journalSelect", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userWithJournals = await User.findById(userId).populate("journals");
    res.status(200).json({ docs: userWithJournals.journals });
  } catch (error) {
    console.error("Error in journalSelect:", error);
    next(error);
  }
});
router.post("/createJournal", authenticateToken, async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;
  
    const newJournal = new Journal({ title: title, userID: userId });

    const savedJournal = await newJournal.save();

    // Add the new journal to the user's journals array
    await User.findByIdAndUpdate(userId, {
      $push: { journals: savedJournal._id },
    });

    res.status(201).json(savedJournal);
  } catch (error) {
    next(error);
  }
});

router.post("/createEntry", authenticateToken, async (req, res, next) => {
  try {
    const { pages, mood, journalId } = req.body;
    const userId = req.user.id;

    const newEntry = new JournalEntry({
      pages,
      mood,
      userId: userId,
      journalID: journalId,
    });

    const savedEntry = await newEntry.save();

    // Update journal
    await Journal.findByIdAndUpdate(
      journalId,
      { $push: { entries: savedEntry._id } },
      { new: true }, // Return updated document
    );
  
    res.status(200).json({ savedEntry });
  } catch (error) {
    next(error);
  }
});
//edit

router.put("/editEntry", authenticateToken, async (req, res, next) => {
  try {
    const { pages, mood, journalEntryId } = req.body;
    const userId = req.user.id;

    const updatedEntry = await JournalEntry.findByIdAndUpdate(
      journalEntryId,
      { pages: pages, mood: mood, userID: userId },
      { new: true },
    );
    

    if (!updatedEntry) {
      return res.status(404).json({ message: "Journal or Entry not found" });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const updatedJournal = await Journal.findByIdAndUpdate(
      id,
      { title: title },
      { new: true },
    );

    if (!updatedJournal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.status(200).json(updatedJournal);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteEntires = await JournalEntry.deleteMany({journalID : id}) 
    const deletedJournal = await Journal.findByIdAndDelete(id);
    await User.updateMany({ journals: id }, { $pull: { journals: id } });
    if (!deletedJournal) {
      return res
        .status(404)
        .json({ error: "Journal not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Journal deleted successfully", success: true });
  } catch (error) {
    next(error);
  }
});
//delete entry
router.delete("/deleteEntry/:journalEntryId", async (req, res, next) => {
  try {
    const { journalEntryId } = req.params;

    const deletedEntry = await JournalEntry.findByIdAndDelete(journalEntryId);

    if (!deletedEntry) {
      return res
        .status(404)
        .json({ error: "Journal Entry not found", success: false });
    }

    await Journal.findByIdAndUpdate(
      deletedEntry.journalID,
      { $pull: { entries: deletedEntry._id } },
      { new: true },
    );
    res
      .status(200)
      .json({ message: "Journal Entry deleted successfully", success: true });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const journal = await Journal.findById(id);
    if (!journal) {
      return res.status(404).json({ message: "No journals found" });
    }
    res.status(200).json(journal);
  } catch (error) {
    next(error);
  }
});

export default router;
