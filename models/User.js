const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    password: String,
    email: String,
    city: {
      type: String
      // required: true
    },
    level: {
      type: String,
      enum: ["novice", "beginner", "intermediate", "advanced", "senior"]
      // required: true
    },
    connections: Array,
    interests: {
      type: [String]
      // required: true
    },
    pinnedContent: Array,
    githubUrl: String,
    githubId: String,
    imagePath: {
      type: String,
      default:
        "https://res.cloudinary.com/itstheandre/image/upload/v1568893824/my-dev-dash/rgzdiyqhlazdnlanjjyt.png"
    }
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
