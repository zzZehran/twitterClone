const express = require("express");
const router = express.Router({ mergeParams: true });
const Tweet = require("../models/tweet");
const User = require("../models/user");
const Comment = require("../models/comment");
const AppError = require("../utilities/AppError");
const catchAsync = require("../utilities/catchAsync");
const ObjectID = require("mongoose").Types.ObjectId;
const { tweetSchema, commnetSchema, commentSchema } = require("../schema");
const { validateTweet, isLoggedIn, isAuthor } = require("../middleware");
const tweets = require("../controllers/tweets");
const comments = require("../controllers/comments");

router
  .route("/")
  .get(isLoggedIn, catchAsync(tweets.index))
  .post(isLoggedIn, validateTweet, catchAsync(tweets.makeTweet));

router.get("/new", isLoggedIn, catchAsync(tweets.newTweetForm));

router
  .route("/:id")
  .get(catchAsync(tweets.showTweet))
  .patch(isLoggedIn, isAuthor, validateTweet, catchAsync(tweets.editTweet));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(tweets.showEditForm));

router.post("/:id/like", isLoggedIn, catchAsync(tweets.likeTweet));

router.delete("/:id", isAuthor, catchAsync(tweets.deleteTweet));

router.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  console.log(err.message);
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

module.exports = router;
