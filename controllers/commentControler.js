const User = require("../models/userModel");
const comments = require("../models/commentsModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ObjectId } = require("mongodb");

const getcomment = async (req, res) => {
  const { articleID } = req.body;
  const query = { articleID: articleID };
  try {
    const comment = await comments.find(query);
    return res.status(200).json({ comment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addcomment = async (req, res) => {
  const publishDate = new Date();
  const { authorization } = req.headers;
  // authorization should be 'Bearer token'
  const token = authorization.split(" ")[1];
  const { text, articleID } = req.body;
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id });
    const userName = user.userName;
    const authorID = _id;
    const comment = await comments.create({
      text,
      publishDate,
      userName,
      authorID,
      articleID,
    });
    res.status(200).json({ comment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editcomment = async (req, res) => {
  const { authorization } = req.headers;
  // authorization should be 'Bearer token'
  const token = authorization.split(" ")[1];
  const { text, commentID } = req.body;
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const comment = await comments.findOne({ _id: commentID });
    if (comment && comment.authorID.equals(new ObjectId(_id))) {
      const filter = { _id: new ObjectId(commentID) };
      const updateDoc = {
        $set: {
          text: text,
        },
      };
      const result = await comments.updateOne(filter, updateDoc);
      res.status(200).json({ result });
    } else {
      res.status(400).json("Can not edit");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletecomment = async (req, res) => {
  const { authorization } = req.headers;
  // authorization should be 'Bearer token'
  const token = authorization.split(" ")[1];
  const { commentID } = req.body;
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const comment = await comments.find({ _id: commentID });
    if (comment && comment[0].authorID.equals(new ObjectId(_id))) {
      const result = await comments.deleteOne(new ObjectId(commentID));
      res.status(200).json({ result });
    } else {
      res.status(400).json("Can not edit");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getcomment,
  addcomment,
  editcomment,
  deletecomment,
};
