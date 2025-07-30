const express = require("express");
const connectDB = require("./config/database");
const user = require("./models/user");

const app = express();

app.use(express.json());

app.post("/user", async (req, res) => {

  // dynamic signup api to receive data from end user
  const User = new user(req.body);

  try {
    await User.save();
    res.send("Saved");
  } catch (err) {
    res.status(400).send("Can't save" + err);
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
