// jshint esversion:9

const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      /* required: true */
    },
    password: {
      type: String,
      /* required: true */
    },
    email: {
      type: String,
      unique: true,
      /* required: true */
    },
    imageUrl: {
      type: String,
      default: '/images/default-profile.jpeg',
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    notifications: [
      {
        type: String,
      },
    ],
    visitedNotifications: false,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
