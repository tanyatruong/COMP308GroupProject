const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HelpRequestPostSchema = new Schema(
  {
    authorid: {
      type: Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "HelpRequestComment",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HelpRequestPost", HelpRequestPostSchema);
