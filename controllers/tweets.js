const Tweet = require("../models/tweet");
const Comment = require("../models/comment");
const AppError = require("../utilities/AppError");
const timestamp = require("time-stamp");

const ObjectID = require("mongoose").Types.ObjectId;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonth = timestamp("MM");
let date = timestamp("DD");
let month = months[getMonth - 1];
if (date.slice(0, 1) == 0) {
  date = date.slice(1);
  console.log("Day:", date);
}
console.log(date);

module.exports.index = async (req, res) => {
  const tweets = await Tweet.find({})
    .sort({ createdAt: -1 })
    .populate("user", "username");
  res.render("tweets/feed", { tweets });
  // res.render("tweets/index", { tweets });
};

module.exports.newTweetForm = (req, res) => {
  res.render("tweets/new");
};

module.exports.showTweet = async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    req.flash("error", "Cannot find that tweet");
    return res.redirect("/tweets");
    // return next(new AppError("Invalid ID", 400));
  }
  const tweet = await Tweet.findById(id)
    .populate("user")
    .populate({
      path: "comments",
      populate: { path: "user" },
    });
  if (!tweet) {
    return next(new AppError("Tweet not found!", 404));
  }

  res.render("tweets/show", { tweet });
};

module.exports.showEditForm = async (req, res, next) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return next(new AppError("Invalid ID", 400));
  }
  const tweet = await Tweet.findById(id).populate("user");

  if (!tweet) {
    return next(new AppError("Tweet not found!", 404));
  }
  res.render("tweets/edit", { tweet });
};

module.exports.makeTweet = async (req, res) => {
  const tweet = new Tweet({
    tweet: req.body.tweet,
    user: req.user._id,
    date: `${month} ${date}`,
  });
  await tweet.save();
  req.flash("success", "Tweeted successfully");
  res.redirect(`/tweets/${tweet.id}`);
};

module.exports.editTweet = async (req, res) => {
  const { id } = req.params;
  // const tweetText = req.body.text;
  const tweet = await Tweet.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  });
  tweet.save();
  req.flash("success", "Successfully updated tweet");
  res.redirect(`/tweets/${id}`);
};

module.exports.deleteTweet = async (req, res) => {
  const { id } = req.params;

  const deleteTweet = await Tweet.findByIdAndDelete(id);
  res.redirect("/tweets");
};

module.exports.likeTweet = async (req, res) => {
  const { id } = req.params;
  const tweet = await Tweet.findById(id);
  console.log("hi");

  if (!tweet.likes) {
    tweet.likes = [];
  }

  if (!tweet.likes.includes(req.user._id)) {
    tweet.likes.push(req.user._id);
    await tweet.save();
    req.flash("success", "You liked the tweet.");
  } else {
    req.flash("error", "You have already liked this tweet.");
  }
  res.redirect(`/tweets/${id}`);
};
