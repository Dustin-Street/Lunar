import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;
const date = new Date();
const JournalSchema = new Schema(
  {
    title: { type: String, required: true },
    entries: [{ type: Schema.Types.ObjectId, ref: 'JournalEntry' }],
    dateCreated: {
      type: String,
      default: date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes()
    },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

  }

);

JournalSchema.plugin(mongoosePaginate);

const Journal = mongoose.model('Journal', JournalSchema);

export default Journal;