//jshint esversion:9

const mongoose = require('mongoose');
const router = require('express').Router();
const Message = require('../models/Message.model');
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

/************************** GET ALL MESSAGES *********************************/
router.get('/messages', isAuthenticated, async (req, res, next) => {
  try {
    const response = await Message.find().sort('-createdAt').populate('userId');

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

/************************** CREATE NEW MESSAGE *********************************/
router.post('/messages', isAuthenticated, async (req, res, next) => {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      res.status(401).json({ message: 'Missing fields' });
      return;
    }

    let response = await Message.create(req.body);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
