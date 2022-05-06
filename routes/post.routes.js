//jshint esversion:9

const mongoose = require('mongoose');
const router = require('express').Router();
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const fileUploader = require('./../config/cloudinary.config');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');

/************************** GET ALL POSTS *********************************/
router.get('/posts', isAuthenticated, async (req, res, next) => {
  try {
    const response = await Post.find()
      .sort('-createdAt')
      .populate('userId')
      .populate({ path: 'comments', populate: { path: 'userId' } });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** GET ONE POST *********************************/
router.get('/posts/:postId', isAuthenticated, async (req, res, next) => {
  const { postId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }

    let response = await Post.findById(postId)
      .populate('likes')
      .populate({ path: 'comments', populate: { path: 'userId' } });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post('/upload', isAuthenticated, fileUploader.single('imageUrl'), (req, res, next) => {
  try {
    // Get the URL of the uploaded file and send it as a response.
    // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

    res.status(200).json({ fileUrl: req.file.path });
  } catch (error) {
    res.status(500).status({ message: `Could not upload file! =>`, error });
  }
});

/************************** CREATE NEW POST *********************************/
router.post('/posts', isAuthenticated, async (req, res, next) => {
  try {
    const { body, userId, imageUrl } = req.body;

    if ((!userId && body) || (!userId && imageUrl)) {
      res.status(401).json({ message: 'Missing fields of post.' });
      return;
    }

    let response = await Post.create({ body, userId, imageUrl, likes: [], comments: [] });
    await User.findByIdAndUpdate(userId, { $push: { posts: response._id } }, { new: true });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** UPDATE POST *********************************/
router.put('/posts/:postId', isAuthenticated, async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }

    let response = await Post.findByIdAndUpdate(postId, req.body, { new: true });
    res.status(200).json({ message: `Post successfully updated  => ${response}.` });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** UPDATE POST LIKES ADD *********************************/
router.put('/posts/:postId/add-like', isAuthenticated, async (req, res, next) => {
  let userId = req.body.userId;

  try {
    const { postId } = req.params; // <= id of post that will receive userId in the likes array

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }

    let response = await Post.findByIdAndUpdate(postId, { $push: { likes: userId } }, { new: true });

    res.status(200).json({ message: `User likes successfully updated  => ${response}.` });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** UPDATE POST LIKES REMOVE *********************************/
router.put('/posts/:postId/remove-like', isAuthenticated, async (req, res, next) => {
  let userId = req.body.userId;

  try {
    const { postId } = req.params; // <= id of post that will remove userId of the likes array

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }

    let response = await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });

    res.status(200).json({ message: `Post likes successfully updated  => ${response}.` });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** DELETE POST *********************************/
router.delete('/posts/:postId', isAuthenticated, async (req, res, next) => {
  try {
    //need userID to remove postId from array of postsId

    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }

    let postToDelete = await Post.findById(postId);

    await Post.findByIdAndRemove(postId);

    let postAuthor = await User.findById(postToDelete.userId);

    await User.findByIdAndUpdate(postAuthor._id, {
      posts: postAuthor.posts.filter((onePost) => {
        return onePost.toString() != postId;
      }),
    });

    res.status(200).json({ message: `Post with id: ${req.params.postId} was deleted.` });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
