const User = require("../models/userModel");
const comments = require("../models/commentsModel");
const { ObjectId } = require('mongodb');

const getcomment = async (req, res) => {
  const { articleID } = req.body;
  const query = { articleID: articleID };
  try {
    const comment = await comments.find(query);
    return res.status(200).json(comment);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addcomment = async (req, res) => {
  const publishDate = new Date();
  const { text,authorID,articleID } = req.body;
  try {
    const comment = await comments.create({ text, publishDate , authorID, articleID});
    res.status(200).json({comment});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editcomment = async (req, res) => {
  const { text, authorID, commentID } = req.body;
  try {
    const comment = await comments.find({ _id: commentID });
    if (comment&&comment[0].authorID.equals(new ObjectId(authorID))) {
      const filter = { _id: new ObjectId(commentID) };
      const updateDoc = {
        $set: {
        text: text
        },
      };
      const result = await comments.updateOne(filter, updateDoc);
      res.status(200).json({result});
    }
    else {
      res.status(400).json("Can not edit");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletecomment = async(req, res) => {
  const { authorID, commentID } = req.body;
  try {
    const comment = await comments.find({ _id: commentID });
    if (comment&&comment[0].authorID.equals(new ObjectId(authorID))) {
      const result = await comments.deleteOne(new ObjectId(commentID));
      res.status(200).json({result});
    }
    else {
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

