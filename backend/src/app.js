const express = require("express");
const connectDB = require("./config/database");
const user = require("./models/user");

const app = express();

app.post("/user", async (req, res) => {
  // const userObj = {
  //   firstName: "Prachurya",
  //   lastName: "Ray",
  //   email: "prachuryaray@gmail.com",
  //   password: "Tinder123",
  //   age: 25,
  //   gender: "Male",
  // };
  // const User = new user(userObj);

  // try {
  //   await User.save();
  //   res.send("Saved");
  // } catch (err) {
  //   res.status(400).send("Can't save" + err);
  // }
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
