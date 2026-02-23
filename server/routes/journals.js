import mongoose from "mongoose";
import Journal from "../schema/journal.js";
import express from "express";
import database from "../database/connection.js";
import User from "../schema/user.js";
import Error from "../schema/error.js";
import axios from "axios";
import JournalEntry from "../schema/journalEntry.js";

const router = express.Router();

//Journal
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
router.get("/journalSelect/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log("Fetching journals for userID:", userId);

    const user = await User.findById(userId).populate("journals");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ docs: user.journals });
  } catch (error) {
    next(error);
  }
});
router.post("/createJournal", async (req, res, next) => {
  try {
    const { title, userID } = req.body;
    console.log("Creating journal for userID:", userID, "with title:", title);

    const newJournal = new Journal({ title: title, userID: userID });

    const savedJournal = await newJournal.save();

    // Add the new journal to the user's journals array
    await User.findByIdAndUpdate(userID, {
      $push: { journals: savedJournal._id },
    });

    res.status(201).json(savedJournal);
  } catch (error) {
    next(error);
  }
});

router.post("/createEntry", async (req, res, next) => {
  try {
    const { pages, mood, userID, journalId } = req.body;

    const newEntry = new JournalEntry({
      pages,
      mood,
      userID,
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

router.put("/editEntry", async (req, res, next) => {
  try {
    const { pages, mood, userID, journalEntryId } = req.body;
    console.log(pages, mood, userID, journalEntryId)
    const updatedEntry = await JournalEntry.findByIdAndUpdate(journalEntryId,
      {pages : pages, mood: mood, userID},
      {new: true}
    )
    console.log(updatedEntry)
    
    if (!updatedEntry) {
      return res.status(404).json({ message: "Journal or Entry not found" });
    }

    res.status(200).json(updatedEntry)
    
  } catch (error) {
    next(error)
  }
})

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  console.log(`hit route - ID :${id} with title of ${title}`);
  try {
    const updatedJournal = await Journal.findByIdAndUpdate(
      id,
      { title: title },
      { new: true },
    );
    console.log(`${updatedJournal} -> being sent to client`);

    if (!updatedJournal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.status(200).json(updatedJournal);
  } catch (error) {
    next(error);
  }
});

//`http://localhost:5050/journals/journals/${journalId}`
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
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
