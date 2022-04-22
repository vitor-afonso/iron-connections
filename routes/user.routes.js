//jshint esversion:9

const mongoose = require('mongoose');
const router = require('express').Router();

const User = require('../models/User.model');
const Comment = require('../models/Comment.model');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');

router.get('/users', isAuthenticated, async (req, res, next) => {
  try {
    //populates nested arrays
    const response = await User.find().populate({
      path: 'posts',
      populate: [
        {
          path: 'comments',
          model: 'Comment',
        },
        {
          path: 'userId',
          model: 'User',
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** GET ONE USER *********************************/
router.get('/users/:userId', isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;

  try {
    //populates nested arrays
    const response = await User.findById(userId)
      .populate('followers')
      .populate('posts')
      .populate({
        path: 'posts',
        populate: [
          {
            path: 'comments',
            model: 'Comment',
            populate: { path: 'userId' },
          },
          {
            path: 'userId',
            model: 'User',
          },
        ],
      })
      .sort({ createdAt: -1 });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** CREATE NEW USER *********************************/
router.post('/users', isAuthenticated, async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      res.status(401).json({ message: 'Missing fields' });
      return;
    }

    let response = await User.create({ username, password, email, followers: [], posts: [] });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** UPDATE USER *********************************/
router.put('/users/:userId', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }

    if (req.body) {
      let response = await User.findByIdAndUpdate(userId, req.body, { new: true });
      res.status(200).json({ message: `User successfully updated  => ${response}.` });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** ADD USER FOLLOWERS *********************************/
router.put('/add-follower/:userId', isAuthenticated, async (req, res, next) => {
  let followerId = req.query.followerId;

  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }

    let response = await User.findByIdAndUpdate(userId, { $push: { followers: followerId } }, { new: true });

    res.status(200).json({ message: `User successfully updated  => ${response}.` });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
/************************** UPDATE USER FOLLOWERS NOTIFICATION *********************************/
router.put('/users/:userId/notification', isAuthenticated, async (req, res, next) => {
  let notification = req.body.notification;

  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }

    let response = await User.findByIdAndUpdate(userId, { $push: { notifications: notification }, visitedNotifications: false }, { new: true });

    res.status(200).json({ message: `User notifications successfully updated  => ${response}.` });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** REMOVE USER FOLLOWERS *********************************/
router.put('/remove-follower/:userId', isAuthenticated, async (req, res, next) => {
  let followerId = req.query.followerId;

  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }

    let response = await User.findByIdAndUpdate(userId, { $pull: { followers: followerId } }, { new: true });

    res.status(200).json({ message: `User successfully updated  => ${response}.` });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** DELETE USER *********************************/
router.delete('/users/:userId', isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }
    await User.findByIdAndRemove(userId);

    res.status(200).json({ message: `User with id: ${req.params.userId} was deleted.` });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
