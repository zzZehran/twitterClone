const mongoose = require("mongoose");
const Tweet = require("./tweet");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // tweets: { type: mongoose.Schema.Types.ObjectID, ref: "Tweet" },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;
