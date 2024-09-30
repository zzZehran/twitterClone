const Tweet = require("../models/tweet");
const Comment = require("../models/comment");

const ObjectID = require("mongoose").Types.ObjectId;

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  Tweet.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  res.redirect(`/tweets/${id}`);
};

module.exports.postComment = async (req, res) => {
  const { id } = req.params;
  const tweet = await Tweet.findById(id);
  const comment = new Comment(req.body.comment);
  comment.user = req.user._id;
  tweet.comments.push(comment);
  await comment.save();
  await tweet.save();
  res.redirect(`/tweets/${tweet._id}`);
};
