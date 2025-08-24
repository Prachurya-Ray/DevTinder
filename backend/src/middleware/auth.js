const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async(req, res, next) => {
  try{
    //read the token from req cookies
    const { token } = req.cookies;
    if(!token){
      throw new Error("Token not Valid");
    }

    //validate the cookies
    const { _id } = jwt.verify(token, "mypracticedev");

    //find the user
    const userData = await User.findById(_id);
    if(!userData){
      throw new Error("User not found");
    }

    req.userData = userData;

    next();
  }
  catch(err){
    res.status(400).send("Error: " + err.message);
  }
};

module.exports ={
    userAuth
}