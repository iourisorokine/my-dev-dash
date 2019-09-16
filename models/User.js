const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    password: String,
    email: String,
    city: String,
    level: {
      type: String,
      enum: ["novice", "beginner", "intermediate", "advanced", "senior"]
    },
    mentorship: {
      type: String,
      enum: ["Yes", "No"]
    },
    connections: Array,
    interests: Array,
    pinnedContent: Array,
    githubLink: String
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
