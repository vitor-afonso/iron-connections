//jshint esversion:9
 
const mongoose = require('mongoose');
const router = require("express").Router();

const Post = require('../models/Post.model');
const Comment = require('../models/Comment.model');

const {isAuthenticated} = require("../middleware/jwt.middleware.js");


router.post('/posts/:postId/comment', isAuthenticated, async (req, res, next) => {
    
    try {
        
        const { content, userId } = req.body;

        const {postId} = req.params;

        if(!content || !postId || !userId) {

            res.status(401).json({message: "Missing fields"});
            return;
        }

        let response = await Comment.create({ content, userId });
        await Post.findByIdAndUpdate(postId, { $push: { comments: response._id }}, {new: true} );

        res.status(200).json(response);
          
    } catch (error) {
    
        res.status(500).json({message: error});
    }
});

/************************** DELETE COMMENT *********************************/
router.delete('/posts/:postId/comment', isAuthenticated, async (req, res, next) => {

    try {
        
        const commentId = req.query.commentId;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            res.status(401).json({ message: 'Specified id is not valid' });
            return;
        }

        await Comment.findByIdAndRemove(commentId);

        res.status(200).json({message: `Post with id: ${req.params.commentId} was deleted.`});
        
    } catch (error) {
        res.status(500).json({message: error});
    }
});

module.exports = router;