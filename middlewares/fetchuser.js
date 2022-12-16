require('dotenv').config();
var jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
        res.status(401).send({ error: "Please Authenicate using a valid token" })
    }

    try {
        //! verify will return the payload or the data that we sent while creating our user
        
        const data = jwt.verify(token, JWT_SECRET);

        // 
        req.user = data.user;
        next();

    } catch (error) {
        res.status(401).send({ error: "Please Authenicate using a valid token" })
    }
}
module.exports = fetchuser;

// what is happening in fetchuser?
// it is giving us the id of the user using the web token.
