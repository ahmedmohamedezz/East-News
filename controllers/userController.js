const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id, expiresIn = "3d") => {
  // return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: expiresIn });
};

const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. check email & password != null
    if (!email || !password) {
      throw new Error("All Entries must be filled");
    }

    // 2. validate email & password
    if (!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error("Password is not strong enough");
    }

    // 3. check that email is unique
    const exists = await User.findOne({ email });
    if (exists) {
      throw new Error("Email already in use");
    }

    // 4. bcrypt password & store user in DB
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. check email & password != null
    if (!email || !password) {
      throw new Error("All Entries must be filled");
    }
    // try to login the user (if don't exist through error)
    const user = await User.findOne({ email });

    // match the password with bcrypt (if not a match through error)
    let match = null; // should not be 'const' => reassigned
    if (user) {
      match = await bcrypt.compare(password, user.password);
    }
    if (!user || !match) {
      throw new Error("Incorrect username or password");
    }

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// TODO : logout functinality
const testToken = async (req, res) => {
  const { token } = req.body;

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id });

    res.status(200).json({ _id, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logoutUser = (req, res) => {
  // const token = req.headers.authorization;
  const { token } = req.body;
  const { _id } = jwt.verify(token, process.env.JWT_SECRET);
  createToken(_id, "1s");
  res.status(200).json("Loggedout successfully");
};

module.exports = {
  loginUser,
  signupUser,
  logoutUser,
  testToken,
};
