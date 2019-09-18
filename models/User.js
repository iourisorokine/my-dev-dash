const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String
    },
    password: {
      type: String
    },
    email: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ["novice", "beginner", "intermediate", "advanced", "senior"],
      required: true
    },
    mentorship: {
      type: String,
      enum: ["yes", "no"]
    },
    connections: Array,
    interests: {
      type: [String],
      required: true
    },
    pinnedContent: Array,
    github: String,
    imagePath: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
