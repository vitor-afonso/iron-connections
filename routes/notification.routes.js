//jshint esversion:9

const mongoose = require('mongoose');
const router = require('express').Router();

const User = require('../models/User.model');
const Notification = require('../models/Notification.model');

const { isAuthenticated } = require('../middleware/jwt.middleware.js');

/************************** CREATE NOTIFICATION *********************************/
router.post('/notifications', isAuthenticated, async (req, res, next) => {
  try {
    let response = await Notification.create(req.body);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** UPDATE USER NOTIFICATIONS *********************************/
router.put('/notifications/:userId', isAuthenticated, async (req, res, next) => {
  let notificationId = req.body.notificationId;

  try {
    const { userId } = req.params; // <= id of user that will receive notification

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({ message: 'Specified id is not valid' });
      return;
    }

    let response = await User.findByIdAndUpdate(userId, { $push: { notifications: notificationId } }, { new: true });

    res.status(200).json({ message: `User notifications successfully updated  => ${response}.` });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
