const mongoose = require("mongoose");
const Tweet = require("../models/tweet");
const seed = require("./seed");

mongoose
  .connect("mongodb://127.0.0.1:27017/twitterClone")
  .then(() => {
    console.log("Connection open!");
  })
  .catch((err) => {
    console.log("Oh no error!");
    console.log(err);
  });

const seedDB = async () => {
  await Tweet.deleteMany({});
  for (let i = 0; i <= 50; i++) {
    const random50 = Math.floor(Math.random() * 50);
    const camp = new Tweet({
      user: "66f406cd53f7137126718b10",
      tweet: seed[random50].tweet,
      likes: seed[random50].likes,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

// console.log(seed[0].tweet)
