//jshint esversion:9
 
const mongoose = require('mongoose');
const router = require("express").Router();
 
const Post = require('../models/Post.model');
const User = require('../models/User.model');

const {isAuthenticated} = require("../middleware/jwt.middleware.js");


/************************** GET ALL POSTS *********************************/
router.get('/posts', isAuthenticated,  async (req, res, next) => {
    try {
        
        const response = await Post.find()
        .populate("likes")
        .populate({path: "comments", populate: {path: "userId"}});
        
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({message: error});
    }
});

/************************** GET ONE POST *********************************/
router.get('/posts/:postId',isAuthenticated, async (req, res, next) => {

    const { postId } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(401).json({ message: 'Specified id is not valid' });
            return;
        }

        let response = await Post.findById(postId)
        .populate("likes")
        .populate({path: "comments", populate: {path: "userId"}});
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({message: error});
    }
});


/************************** CREATE NEW POST *********************************/
router.post('/posts', isAuthenticated, async (req, res, next) => {
    
    try {

        const { title, body, userId, imageUrl } = req.body;
    
        if(!title || !body) {

            res.status(401).json({message: "Missing fields"});
            return;
        }

        let response = await Post.create({ title, body, likes: []});
        await User.findByIdAndUpdate(userId, { $push: { posts: response._id }}, {new: true} );

        res.status(200).json(response);
          
    } catch (error) {
    
        res.status(500).json({message: error});
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
        res.status(200).json({message: `Post successfully updated  => ${response}.`});

        
    } catch (error) {
        res.status(500).json({message: error});
    }
});

/************************** DELETE POST *********************************/
router.delete('/posts/:postId', isAuthenticated, async (req, res, next) => {

    try {
        
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(401).json({ message: 'Specified id is not valid' });
            return;
        }

        await Post.findByIdAndRemove(postId);

        res.status(200).json({message: `Post with id: ${req.params.postId} was deleted.`});
        
    } catch (error) {
        res.status(500).json({message: error});
    }
});


module.exports = router;