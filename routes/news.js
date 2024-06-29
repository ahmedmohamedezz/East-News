const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { getNews, summarize } = require("../controllers/newsController");

const router = express.Router();

// require auth for all workouts routes
router.use(requireAuth);

// 'news/getNews' + req.body
router.get("/getNews", getNews);

router.post("/summarize", summarize);

module.exports = router;
