const mongoose = require("mongoose");
const Tweet = require("../models/tweet");
const seed = require("./seed");
const timestamp = require("time-stamp");

mongoose
  .connect("mongodb://127.0.0.1:27017/twitterClone")
  .then(() => {
    console.log("Connection open!");
  })
  .catch((err) => {
    console.log("Oh no error!");
    console.log(err);
  });

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

const seedDB = async () => {
  await Tweet.deleteMany({});
  for (let i = 0; i <= 50; i++) {
    const random50 = Math.floor(Math.random() * 50);
    const camp = new Tweet({
      user: "66f406cd53f7137126718b10",
      tweet: seed[random50].tweet,
      likes: "66f93d57f5672c1de6810e56",
      date: `${month} ${date}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
