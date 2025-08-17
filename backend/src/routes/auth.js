const express = require('express');

const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");

const authRouter = express.Router();

//sign-up APIs
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  // dynamic signup api to receive data from end user
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashPassword,
  });
  try {
    await user.save();
    res.send("Saved");
  } catch (err) {
    res.status(400).send("Can't save. Error: " + err);
  }
});

//log-in APIs
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const checkPw = await user.validatePassword(password);

    if (checkPw) {
      //Create a JWT Token
      const token = await user.getJWT();

      //Add the token back to cookie and send the response back to the server
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000 * 7), // cookie will be removed after 8 hours
      });

      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Login Unssuccessful. " + err);
  }
});

//log-out APIs
authRouter.post("/logout", userAuth, async (req, res) => {
  res.clearCookie("token");
  res.send("User Loged Out");
});

module.exports = authRouter;