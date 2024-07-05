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



const predict = async (req, res) => {
  try {
    const comment = req.body.comment;

    if (!comment) {
      return res.status(400).send("Comment is required");
    }

    const pythonScriptPath = path.join(__dirname, "../python/predict.py");

    // Execute the Python script
    const pythonProcess = exec(
      `python ${pythonScriptPath}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).json({ error: "Error in prediction" });
        }

        try {
          // Extract output and send message
          const message = stdout;

          // Extract the number from the message
          const match = message.match(/\d+/);

          if (match) {
            const predictedLabel = parseInt(match[0], 10);
            let classification;

            // Classify based on the predicted label
            if (predictedLabel === 0) {
              
              classification = "This comment is classified as hate speech.";
            } else if (predictedLabel === 1) {
              classification =
                "This comment is classified as offensive language.";
            } else {
              classification =
                "This comment is classified as neither offensive nor hate.";
            }

            res.json({ classification });
          } else {
            res
              .status(500)
              .json({ error: "No valid prediction found in the message." });
          }
        } catch (parseError) {
          console.error(`parse error: ${parseError}`);
          res.status(500).json({ error: "Error parsing prediction result" });
        }
      }
    );

    pythonProcess.stdin.write(JSON.stringify(comment));
    pythonProcess.stdin.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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
    const predictionResult = await predict({ comment: text })
    if(predictionResult.classification == "This comment is classified as neither offensive nor hate.")
    {
      
      const comment = await comments.create({
        text,
        publishDate,
        userName,
        authorID,
        articleID,
      });
        res.status(200).json({ comment });
      
    }
    else
    {
      res.status(400).json(" this comment violated our policy!your comment cannot be added  ");
    }
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
