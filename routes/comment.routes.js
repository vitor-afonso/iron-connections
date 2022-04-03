//jshint esversion:9
 
const mongoose = require('mongoose');
const router = require("express").Router();
 
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');

router.post('/posts/:id/comment', async (req, res, next) => {
    
    try {

        /* const { title, body, userId, imageUrl } = req.body;
    
        if(!title || !body) {

            res.status(401).json({message: "Missing fields"});
            return;
        }

        let response = await Post.create({ title, body, userId: userId, likes: []}); */

        res.status(200).json(response);
          
    } catch (error) {
    
        res.status(500).json({message: error});
    }
});


module.exports = router;