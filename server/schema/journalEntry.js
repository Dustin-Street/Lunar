import mongoose from "mongoose";

const { Schema } = mongoose;

const PageSchema = new Schema({
    pageNumber: { type: Number, required: true, default: 1 },
    text: { type: String, default: '' },
    images: { type: [String], default: [] }, // Array of image URLs/paths
    createdAt: { type: Date, default: Date.now } //self sustained no imput
}, { _id: true });

const JournalEntrySchema = new Schema(
    {
        dateCreated: { type: Date, default: Date.now, required: true },
        mood: { type: String, enum: ['happy', 'sad', 'neutral', 'angry', 'excited'] },
        pages: { type: [PageSchema], default: [], required:true }, 
        journalID: { type: mongoose.Schema.Types.ObjectId, ref: 'Journal' },
        userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    })

const JournalEntry = mongoose.model('JournalEntry', JournalEntrySchema);

export default JournalEntry;