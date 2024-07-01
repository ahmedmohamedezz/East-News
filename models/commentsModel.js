const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentsSchema = new Schema({
  text: {
    type: String,

    },
  publishDate: {
    type: String,

    },
  authorID: {
    type: Schema.Types.ObjectId,
    ref: 'User',

    },
  articleID: {
    type: Schema.Types.ObjectId,
    ref: 'Article',

    },
});

module.exports = mongoose.model("Comments", commentsSchema);
