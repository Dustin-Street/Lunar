import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
const Schema = mongoose.Schema;

const date = new Date();

const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  journals: [{ type: Schema.Types.ObjectId, ref: "Journal" }],
  refreshToken: [Session],
  dateCreated: {
    type: String,
    default:
      date.getMonth() +
      "/" +
      date.getDate() +
      "/" +
      date.getFullYear() +
      " - " +
      date.getHours() +
      ":" +
      date.getMinutes(),
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  accountErrors: [{ type: mongoose.Schema.Types.ObjectId, ref: "ErrorLog" }],
  verificationCode:{ type: String, limit: 2 },
  verificationExperation: {type: Date}
});

// Hash password before saving
UserSchema.pre("save", async function () {
  // Only hash if password is modified
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

UserSchema.methods.createVerificationCode = function () {
  const newCode = crypto.randomBytes(32).toString("hex");

  this.verificationCode = crypto
    .createHash("sha256")
    .update(newCode)
    .digest("hex");

  this.verificationExperation = Date.now() + 10 * 60 * 1000; // ten minute timer for security

  return newCode;
};

export default mongoose.model("User", UserSchema);
