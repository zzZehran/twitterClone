const Tweet = require("./models/tweet");
const Comment = require("./models/comment");
const { tweetSchema, commnetSchema, commentSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You need to be logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const tweet = await Tweet.findById(id);
  if (!tweet.user.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/tweets/${id}`);
  }
  next();
};
module.exports.validateTweet = (req, res, next) => {
  const { error } = tweetSchema.validate(req.body);
  if (error) {
    console.log(error);
    const msg = error.details.map((el) => el.message).join(", ");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};
