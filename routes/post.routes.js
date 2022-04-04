//jshint esversion:9
 
const mongoose = require('mongoose');
const router = require("express").Router();
 
const Posts = require('../models/Post.model');
const Users = require('../models/User.model');
const Comments = require('../models/Comment.model');


/************************** GET ALL POSTS *********************************/
router.get('/posts', async (req, res, next) => {
    try {
        
        const response = await Posts.find().populate("comments").populate("userId").populate("likes");
        
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({message: error});
    }
});

/************************** GET ONE POST *********************************/
router.get('/posts/:postId', async (req, res, next) => {

    const { postId } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(401).json({ message: 'Specified id is not valid' });
            return;
        }

        let response = await Posts.findById(postId).populate("likes").populate("comments");
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({message: error});
    }
});


/************************** CREATE NEW POST *********************************/
router.post('/posts', async (req, res, next) => {
    
    try {

        const { title, body, userId, imageUrl } = req.body;
    
        if(!title || !body) {

            res.status(401).json({message: "Missing fields"});
            return;
        }

        let response = await Posts.create({ title, body, likes: []});
        let userResponse = await Users.findByIdAndUpdate(userId, { $push: { posts: response._id }}, {new: true} );

        res.status(200).json(response);
          
    } catch (error) {
    
        res.status(500).json({message: error});
    }
});

/************************** UPDATE POST *********************************/
router.put('/posts/:postId', async (req, res, next) => {

    try {

        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(401).json({ message: 'Specified id is not valid' });
            return;
        }

        let response = await Posts.findByIdAndUpdate(postId, req.body, { new: true });
        res.status(200).json({message: `Post successfully updated  => ${response}.`});

        
    } catch (error) {
        res.status(500).json({message: error});
    }
});

/************************** DELETE POST *********************************/
router.delete('/posts/:postId', async (req, res, next) => {

    try {
        
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(401).json({ message: 'Specified id is not valid' });
            return;
        }
        await Posts.findByIdAndRemove(postId);

        res.status(200).json({message: `Post with id: ${req.params.postId} was deleted.`});
        
    } catch (error) {
        res.status(500).json({message: error});
    }
});


module.exports = router;