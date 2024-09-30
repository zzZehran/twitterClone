const mongoose = require("mongoose");
const { Schema } = mongoose;

const commnetSchema = new Schema({
  body: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Comment = mongoose.model("Comment", commnetSchema);

module.exports = Comment;
