const bcrypt = require("bcrypt");
const express = require("express");
const { userAuth } = require("../middleware/auth");
const {
  validateProfileEditData,
  validPassword,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.userData);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValid = validateProfileEditData(req.body);

    if (!isValid) {
      throw new Error("Field Not allowed to Edit");
    }

    const data = req.userData;
    Object.keys(req.body).forEach((key) => (data[key] = req.body[key]));
    await data.save();

    res.send({
      message: `${data.firstName}, Your Profile has been Updated`,
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/passwordChange", userAuth, async (req, res) => {
  try {
    const { newPassword, newPasswordRepeat } = req.body;

    if (!validPassword(newPassword)) {
      throw new Error(
        "Password not strong - minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1"
      );
    }

    if (newPassword != newPasswordRepeat) {
      throw new Error("New Password do not matches ");
    }

    const data = req.userData;

    const hashPassword = await bcrypt.hash(newPassword, 10);
    data.password = hashPassword;

    await data.save();

    res.clearCookie("token");
    res.send("Password Updated Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
