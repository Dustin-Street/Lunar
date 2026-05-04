import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;
const date = new Date();
const PageSchema = new Schema(
  {
    pageNumber: { type: Number, required: true, default: 1 },
    text: { type: String, default: "" },
    images: { type: [String], default: [] }, // Array of image URLs/paths
    dateCreated: {
      type: String,
      default: () => {
        const date = new Date();
        return date.toLocaleString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true, // Ensures 12-hour format with AM/PM
        });
        // Example output: "2/22/2026, 2:30 PM"
      },
    },
  },
  { _id: true },
  { strict: true },
);

const JournalEntrySchema = new Schema({
  dateCreated: {
    type: String,
    default: () => {
      const date = new Date();
      return date.toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Ensures 12-hour format with AM/PM
      });
      // Example output: "2/22/2026, 2:30 PM"
    },
  },
  rawDate: {
    type: Date,
    default: Date.now,
  },
  mood: { type: String, enum: ["happy", "sad", "neutral", "angry", "excited"] },
  pages: { type: [PageSchema], default: [], required: true },
  journalID: { type: mongoose.Schema.Types.ObjectId, ref: "Journal" },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {strict : true});

JournalEntrySchema.plugin(mongoosePaginate);
const JournalEntry = mongoose.model("JournalEntry", JournalEntrySchema);

export default JournalEntry;
