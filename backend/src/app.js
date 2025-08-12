const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//user APIs
app.post("/user", async (req, res) => {
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

app.delete("/user", async (req, res) => {
  const userMail = req.body.email;
  try {
    const userData = await User.find({ email: userMail });

    if (!userData || userData.length === 0) {
      return res.status(400).send("User not found");
    }

    const userId = userData[0]._id;
    await User.findByIdAndDelete(userId);

    res.send("Deleted");
  } catch (err) {
    res.status(500).send("Can't Delete");
  }
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  // console.log(userId);
  try {
    const userData = await User.findOne({ _id: userId });
    if (!userData) {
      res.status(400).send("User not found");
    } else {
      res.send(userData);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.patch("/user/:id", async (req, res) => {
  const userID = req.params.id;
  const userData = req.body;
  try {
    const userCheck = await User.findOne({ _id: userID });
    if (!userCheck) {
      res.status(400).send("User not found");
    }
    const UPDATE_ALLOWED = [
      "gender",
      "age",
      "photoURL",
      "about",
      "skills",
      "firstName",
      "lastName",
    ];
    const isUpdateAllowed = Object.keys(userData).every((k) =>
      UPDATE_ALLOWED.includes(k)
    );
    if (!isUpdateAllowed) {
      res.status(400).send("Field not allowed for modification");
    }
    const result = await User.findOneAndUpdate(
      { _id: userID },
      { $set: userData },
      { runValidators: true }
    );
    // console.log(result);
    res.send("Updated Successfully.");
  } catch (err) {
    res.status(400).send("Error: " + err);
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
      const token = await jwt.sign({ _id: hashPw._id }, "mypracticedev");

      //Add the token back to cookie and send the response back to the server
      res.cookie("token", token);

      res.send("Login Successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Login Unssuccessful. " + err);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decodedJWT = jwt.verify(token, "mypracticedev");

    const { _id } = decodedJWT;
    const userData = await User.findById(_id);

    if(!userData){
      throw new Error("User Doesn't exist.");
    }

    res.send(userData);
  } catch (err) {
      res.status(400).send("Error: " + err.message);
  }
});

//feed APIs
app.get("/feed", async (req, res) => {
  const userData = await User.find({});
  try {
    if (userData.length == 0) {
      res.status(400).send("Data not found");
    } else {
      res.send(userData);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
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
