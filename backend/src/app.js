const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/user", async (req, res) => {
  // dynamic signup api to receive data from end user
  const user = new User(req.body);
  try {
    await user.save();
    res.send("Saved");
  } catch (err) {
    res.status(400).send("Can't save" + err);
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

app.patch("/user", async (req, res) => {
  const userMail = req.body.email;
  const userData = req.body;
  try {
    const temp = await User.findOne({ email: userMail });
    if (!temp) {
      res.status(400).send("User not found");
    }
    const result = await User.findOneAndUpdate(
      { email: userMail },
      { $set: userData },
      { runValidators : true }
    );
    console.log(result);
    res.send("Updated Successfully.");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});

//feed
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
