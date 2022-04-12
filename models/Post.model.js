// jshint esversion:9

const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    body: {
      type: String,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    imageUrl: {
      type: String
    },
    likes:  [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments:  [{ type: Schema.Types.ObjectId, ref: "Comment" }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

module.exports = model("Post", postSchema);