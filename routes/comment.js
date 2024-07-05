const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
  getcomment,
  addcomment,
  editcomment,
  deletecomment,
  predict,
} = require("../controllers/commentControler");

//authorized features
const router = express.Router();
router.use(requireAuth);

router.get('/getcomment', getcomment);

// prediction route
router.post("/predict", predict);

router.post('/addcomment', addcomment);

router.put('/editcomment', editcomment);

router.delete('/deletecomment', deletecomment);

module.exports = router;