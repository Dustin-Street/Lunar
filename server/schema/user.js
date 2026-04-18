import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { profile } from "console";
import { type } from "os";
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
    //select:false
    //could be best to add select false in future improvements to enhance security measures which will require a few refactors for login and signup to implicetly select the password in logic
  },
  active: {
    type: Boolean,
    default: true,
  },
  journals: [{ type: Schema.Types.ObjectId, ref: "Journal" }],
  //object for profile settings and preferences
  profile: {
    profileImage: {
      type: String,
    },
    preferences: {
      theme: {
        type: String,
        default: "Lunar",
      },
      privacySettings: {},
      notificationSettings: {
        emailNotifications: {
          type: Boolean,
          default: true,
        },
        pushNotifications: {
          type: Boolean,
          default: true,
        },
        smsNotifications: {
          type: Boolean,
          default: false,
        },
      },
      UserDataExport: {
        type: Boolean,
        default: false,
      },
    },
  },
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
  statistics: {
    //number of entries this month
    monthlyEntries: {
      type: Number,
      default: 0,
    },
    //most common mood selected
    commonMood: {
      type: String,
      default: null,
    },
    //most common day to journal
    commonDay: {
      type: String,
      default: null,
    },
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  accountErrors: [{ type: mongoose.Schema.Types.ObjectId, ref: "ErrorLog" }],
  verificationCode: { type: String, limit: 2 },
  verificationExperation: { type: Date },
});

//Methods
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
//method to create Verification Codes that are user schema for comparision in event of forgot password
UserSchema.methods.createVerificationCode = function () {
  const newCode = crypto.randomBytes(32).toString("hex");

  this.verificationCode = crypto
    .createHash("sha256")
    .update(newCode)
    .digest("hex");

  this.verificationExperation = Date.now() + 10 * 60 * 1000; // ten minute timer for security

  return newCode;
};

//virtuals
UserSchema.virtual("hasStatistics").get(function () {
  const stats = this.statistics;
  return (
    stats.commonDay !== null ||
    stats.commonMood !== null ||
    stats.monthlyEntries > 0
  );
});

//settings
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

export default mongoose.model("User", UserSchema);
