const mongoose = require("mongoose");
const Comment = require("./comment");

const tweetSchema = new mongoose.Schema({
  tweet: {
    type: String,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

tweetSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id: {
        $in: doc.comments,
      },
    });
  }
});

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
