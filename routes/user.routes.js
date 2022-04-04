//jshint esversion:9
 
const mongoose = require('mongoose');
const router = require("express").Router();
 
const Posts = require('../models/Post.model');
const Users = require('../models/User.model');
const Comments = require('../models/Comment.model');


/************************** GET ONE USER *********************************/
router.get('/users/:userId', async (req, res, next) => {

    const {userId} = req.params;

    try {
        //populates nested arrays
        const response = await Users.findById(userId).populate("followers").populate({path: "posts", populate: {path: "comments", populate: {path: "userId"}}});
        
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({message: error});
    }
});


/************************** CREATE NEW USER *********************************/
router.post('/users', async (req, res, next) => {
    
    try {

        const { username, password, email } = req.body;
    
        if(!username || !password || !email) {

            res.status(401).json({message: "Missing fields"});
            return;
        }

        let response = await Users.create({ username, password, email, followers: [], posts: [] });
    

        res.status(200).json(response);
          
    } catch (error) {
    
        res.status(500).json({message: error});
    }
});


/************************** UPDATE USER *********************************/
router.put('/users/:userId', async (req, res, next) => {

    try {

        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(401).json({ message: 'Specified id is not valid' });
            return;
        }

        let response = await Users.findByIdAndUpdate(userId, req.body, { new: true });
        res.status(200).json({message: `User successfully updated  => ${response}.`});

        
    } catch (error) {
        res.status(500).json({message: error});
    }
});


/************************** DELETE USER *********************************/
router.delete('/users/:userId', async (req, res, next) => {

    try {
        
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(401).json({ message: 'Specified id is not valid' });
            return;
        }
        await Users.findByIdAndRemove(userId);

        res.status(200).json({message: `User with id: ${req.params.userId} was deleted.`});
        
    } catch (error) {
        res.status(500).json({message: error});
    }
});


module.exports = router;