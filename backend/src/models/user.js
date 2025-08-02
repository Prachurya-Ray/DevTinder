const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Firstname is required"],
      minLength: [3, "Name should be greater than 3 characters"],
      maxLength: [50, "Name should be smaller than 50 characters"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email address already exists"],
      lowercase: true,
      trim: true,
      match: [/^.+@.+\..+$/, "Please enter a valid email address"],
      immutable: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value))
          throw new Error("Invalid Gender - Please insert male/female/others");
      },
    },
    age: {
      type: Number,
      min: [14, "You must be above 14 years old to create an account"],
    },
    photoURL: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR81iX4Mo49Z3oCPSx-GtgiMAkdDop2uVmVvw&s",
    },
    about: {
      type: String,
      default: "This is the about section.",
    },
    skills: {
      type: [String],
      validate(value){
        if(value.length>3)
          throw new Error("Skills not more than 3");
      }
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
