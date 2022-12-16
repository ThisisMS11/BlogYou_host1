require('dotenv').config();

const express = require('express');
const Document = require('../models/Document.js');
const blogcard = require('../models/Blogcard.js');

const router = express.Router();
const fetchuser = require('../middlewares/fetchuser')

const JWT_SECRET = process.env.JWT_SECRET;

/*untied/unchained API calls (not user specific)*/
router.get('/fetchAllCards',async (req, res) => {
    // our middleware fetchuser has put req.user=data.user
    try {

        // this will give all the items corresponding tothe user.id
        const blogcards = await blogcard.find()
        res.json(blogcards)

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})




/* User Specific API Calls for entire blogs or cards*/
router.get('/fetchUserBlogs', fetchuser, async (req, res) => {
    // our middleware fetchuser has put req.user=data.user
    try {

        // this will give all the items corresponding tothe user.id
        const documents = await Document.find({ userID: req.user.id })
        res.json(documents)

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})

router.get('/fetchUserBlogsCards', fetchuser, async (req, res) => {
    // our middleware fetchuser has put req.user=data.user
    try {

        // this will give all the items corresponding tothe user.id
        const UserBlogCards = await blogcard.find({ userID: req.user.id })
        res.json(UserBlogCards)

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})



// to save the blog card of the newly added blog.
router.post('/saveblogcard', async (req, res) => {
    try {
        let BlogCard = await blogcard.findOne({ blogID: req.body.blogID });
        if (BlogCard) {
            res.status(404).send("try with another id blog with this id already exists.");
        }

        BlogCard = await blogcard.create({
            userID:req.body.userID,
            blogID: req.body.blogID,
            title: req.body.title,
            description: req.body.description,
            thumbnailurl: req.body.thumbnailurl,
            tag: req.body.tag
        }); 

        res.json({success:true,BlogCardID:BlogCard.id});

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})

/* To fetch id specific blog */
router.post('/fetchBlogwithID', async (req, res) => {
    try {

        const blogwithID = await Document.find({_id:req.body.blogID })
        res.json(blogwithID)

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})





module.exports = router