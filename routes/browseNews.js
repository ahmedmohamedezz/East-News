const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all workouts routes
router.use(requireAuth);

router.get("/test", (req, res) => {
  const user = req.user;
  res.status(200).json({ user: user });
});
