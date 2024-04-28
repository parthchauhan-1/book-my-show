const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const newUser = await User(req.body);
    // console.log(newUser);
    newUser.save();
    console.log("New user named " + req.body.name + " registered!!");
    res.send({
      success: true,
      message: "User registered successfully, please proceed with login!",
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const inputPassword = req.body.password;
      const dbStoredPassword = user.password;
      const validPassword = await bcrypt.compare(
        inputPassword,
        dbStoredPassword
      );
      if (!validPassword) {
        return res.send({
          success: false,
          message: "Incorrect Password! 😥",
        });
      }
      const token = jwt.sign({ userID: user._id }, process.env.secret_key_jwt, {
        expiresIn: "1d",
      });
      res.send({
        success: true,
        message: "Logged in successfully 🤗",
        token: token,
      });
    } else {
      res.send({
        success: false,
        message: "User does not exist!!!",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// router.get("/get-current-user", authMiddleware, async (req, res) => {
//   console.log(req.body);
//   const user = await User.findById(req.body.userId).select("-password");
//   console.log(user);
//   res.send({
//     success: true,
//     message: "You are allowed to go to protected route",
//     data: user,
//   });
// });

router.get("/get-current-user", authMiddleware, async (req, res) => {
  const user = await User.findById(req.body.userId).select("-password");

  res.send({
    success: true,
    message: "You are allowed to go to protected route",
    data: user,
  });
});

module.exports = router;
