const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

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

app.get("/user", async (req, res) => {
  const userMail = req.body.email;
  const userData = await User.find({ email: userMail });

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
    console.log(result);
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
    if (!checkPw) {
      throw new Error("Invalid Credentials");
    }
    res.send("Login Successful");
  } catch (err) {
    res.status(400).send("Login Unssuccessful. " + err);
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
