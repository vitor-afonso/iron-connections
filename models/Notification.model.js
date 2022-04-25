// jshint esversion:9

const { Schema, model } = require('mongoose');

const notificationSchema = new Schema(
  {
    content: {
      type: String,
    },
    commentMessage: {
      type: String,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

module.exports = model('Notification', notificationSchema);
