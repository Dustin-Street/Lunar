import express from "express";
import database from "../database/connection.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get(
  "/quote",
  asyncHandler(async (req, res) => {
    try {
      const collection = await database.collection("quotes");
      const collections = await collection.find({}).toArray();
      res.json(collections);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }),
);

export default router;
