const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HelpRequestCommentSchema = new Schema(
  {
    authorid: {
      type: Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },
    postid: {
      type: Schema.Types.ObjectId,
      ref: "HelpRequestPost",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HelpRequestComment", HelpRequestCommentSchema);
