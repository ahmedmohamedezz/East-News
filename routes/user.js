const express = require("express");
const passport = require("passport");
const requireAuth = require("../middleware/requireAuth");
// controller functions
const {
  loginUser,
  signupUser,
  logoutUser,
  testToken,
  googleauth,
  getgoogleresponse,
  predict,
} = require("../controllers/userController");
const { use } = require("passport");

const router = express.Router();
// router.use(requireAuth);

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// logout route
router.post("/logout", logoutUser);

//auth with google

router.get("/login/google", googleauth);

router.get("/signup/google", googleauth);

router.get("/auth/google/callback", getgoogleresponse);

// prediction route
router.post("/predict", predict);

module.exports = router;
