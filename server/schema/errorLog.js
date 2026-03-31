import mongoose from "mongoose";

const { Schema } = mongoose;

const ErrorLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    route: { type: String, required: true },
    method: { type: String, required: true },
    status: { type: Number, default: 500 },
    message: { type: String, required: true },
    stack: { type: String },
    context: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

// Auto expire error logs after 90 days for retention
ErrorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.model("ErrorLog", ErrorLogSchema);
