const Joi = require("joi");

module.exports.tweetSchema = Joi.object({
  // username: Joi.string().required(),
  tweet: Joi.string().required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required(),
  }).required(),
});
