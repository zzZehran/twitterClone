const express = require("express");
const router = express.Router({ mergeParams: true });
const Tweet = require("../models/tweet");
const Comment = require("../models/comment");
const { tweetSchema, commentSchema } = require("../schema");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/AppError");
const { isLoggedIn } = require("../middleware");
const comments = require("../controllers/comments");

const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    console.log(error);
    const msg = error.details.map((el) => el.message).join(", ");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

router.post("/", isLoggedIn, validateComment, catchAsync(comments.postComment));

router.delete("/:commentId", catchAsync(comments.deleteComment));

router.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  console.log(err.message);
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});
module.exports = router;
