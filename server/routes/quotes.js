import express from "express";
import database from "../database/connection.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get(
  "/quote",
  asyncHandler(async (req, res) => {
    const collection = await database.collection("quotes");
    const collections = await collection.find({}).toArray();
    res.json(collections);
  }),
);

export default router;