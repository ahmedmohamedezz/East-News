const express = require("express");

// controller functions
const {
  loginUser,
  signupUser,
  logoutUser,
  testToken,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// logout route
router.post("/logout", logoutUser);

router.post("/test", testToken);

module.exports = router;
