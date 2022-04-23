// jshint esversion:9

const { Schema, model } = require('mongoose');

const likeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

module.exports = model('Like', likeSchema);
