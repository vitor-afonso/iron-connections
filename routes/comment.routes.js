//jshint esversion:9

const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');

/************************** GET ALL COMMENTS *********************************/
router.get('/comments', isAuthenticated, async (req, res, next) => {
  try {
    const response = await Comment.find().populate('userId');

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong while trying to get comments.' });
  }
});

/************************** CREATE COMMENT *********************************/
router.post('/posts/:postId/comment', isAuthenticated, async (req, res, next) => {
  try {
    const { content, userId } = req.body;

    const { postId } = req.params;

    if (!content || !postId || !userId) {
      res.status(401).json({ message: 'Missing fields' });
      return;
    }

    let response = await Comment.create({ content, userId });
    await Post.findByIdAndUpdate(postId, { $push: { comments: response._id } }, { new: true });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong while trying to create comment.' });
  }
});

/************************** DELETE COMMENT *********************************/
router.delete('/comments/:commentId', isAuthenticated, async (req, res, next) => {
  const { commentId } = req.params;
  /* console.log('commentId to delete =>', commentId); */
  try {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }
    await Comment.findByIdAndRemove(commentId);

    res.status(200).json({ message: `Comment with id: ${commentId} was successfully deleted.` });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong while trying to delete comment.' });
  }
});

module.exports = router;
