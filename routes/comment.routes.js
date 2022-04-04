//jshint esversion:9
 
const mongoose = require('mongoose');
const router = require("express").Router();

const Posts = require('../models/Post.model');
const Users = require('../models/User.model');
const Comments = require('../models/Comment.model');


router.post('/posts/:postId/comment', async (req, res, next) => {
    
    try {
        
        const { content, userId } = req.body;

        const {postId} = req.params;

        if(!content || !postId || !userId) {

            res.status(401).json({message: "Missing fields"});
            return;
        }

        let response = await Comments.create({ content, userId });
        let userResponse = await Posts.findByIdAndUpdate(postId, { $push: { comments: response._id }}, {new: true} );

        res.status(200).json(response);
          
    } catch (error) {
    
        res.status(500).json({message: error});
    }
});


module.exports = router;