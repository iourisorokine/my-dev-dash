const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String
      // required: true
    },
    password: {
      type: String
      // required: true
    },
    email: {
      type: String
      // required: true
    },
    city: {
      type: String
      // required: true
    },
    level: {
      type: String,
      enum: ["novice", "beginner", "intermediate", "advanced", "senior"]
      // required: true
    },
    mentorship: {
      type: String,
      enum: ["yes", "no"]
    },
    connections: Array,
    interests: {
      type: Array
      // required: true
    },
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
