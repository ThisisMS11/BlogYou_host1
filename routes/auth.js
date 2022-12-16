require('dotenv').config();

const express = require('express');
const User = require('../models/User.js');

const { body, validationResult } = require('express-validator');

const router = express.Router();

const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const fetchuser = require('../middlewares/fetchuser')


// ! secret
// const JWT_SECRET = "MohitBlog";
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', [
    body('username', 'Enter a valid name').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter at least a 5 character password').isLength({ min: 5 })
], async (req, res) => {

    const errors = validationResult(req);
    let success = false;

    /* this will come in if there are some errors regarding our user inputs.*/

    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            res.status(404).send("Account with the similar emial id already exists.");
        }

        // !Creating the webtoken from here on.
        // generating the salt to make our password even more stronger
        const salt = await bcrypt.genSalt(10);

        // generating the hash from the password.
        const secPass = await bcrypt.hash(req.body.password, salt);

        // ! this is the part where we are adding user information into database
        user = await User.create({
            userID: req.body.userID,
            username: req.body.username,
            email: req.body.email,
            displayname: req.body.displayname,
            password: secPass
        });

        // !The data to be used in signing our web token is here

        const data = {
            user: {
                id: user.id
            }
        }

        // ! Signing the web token with payload and our secret code.
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authtoken });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Cannot enter a blank password').exists()
], async (req, res) => {

    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        console.log('logged in userinformation :- ', user);


        // if we didn't find any user then user=False; !user=True
        if (!user) {
            return res.status(400).json({ success, error: "please try to login with correct credentials" })
        }

        // !  converting the hash code that is our user.password into normal terms and comparing it with the req.body.password

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "please try to login with correct credentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }


        // generating a fresh auth token.(Auth Token is not saved in the database we create a new one every time user logins)
        console.log('our jwt secret:-', JWT_SECRET);

        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authtoken })

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }

})

// for getting userinfo using the authtoken provided at the time of login and signup

router.get('/userinfo', fetchuser, async (req, res) => {
    // res.json({ success: true, authtoken })
    let success=true;
    
    try {
        const userId = req.user.id;
        // All data except the user password is getting selected here
        const user = await User.findById(userId).select("-password");

        res.json({ success: true, user });

    } catch (error) {
        success=false;
        console.log(error);
        res.json({ success: false, error });
    }
})

module.exports = router