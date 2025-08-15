const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//sign-up APIs
app.post("/signup", async (req, res) => {
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

//sign-in APIs
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashPw = await User.findOne({ email: email }, "password");

    if (!hashPw) {
      throw new Error("Invalid Credentials");
    }
    const checkPw = await bcrypt.compare(password, hashPw.password);
    if (checkPw) {
      //Create a JWT Token
      const token = await jwt.sign({ _id: hashPw._id }, "mypracticedev", {expiresIn:'7d'});

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

app.get("/profile", userAuth, async (req, res, next) => {
  try {
    res.send(req.userData);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database Connected...");
    app.listen(3000, () => {
      console.log("Successfully connected to 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
