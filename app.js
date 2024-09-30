const express = require("express");
const app = express();

const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const Joi = require("joi");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const tweetRoutes = require("./routes/tweets");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/user");

mongoose
  .connect("mongodb://127.0.0.1:27017/twitterClone")
  .then(() => {
    console.log("Connection open!");
  })
  .catch((err) => {
    console.log("Oh no error!");
    console.log(err);
  });

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));

const sessionOptions = {
  secret: "cookiesecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser("cookiesecret"));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
  res.locals.currentUser = req.user; //run after initializing passport session
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/tweets", tweetRoutes);
app.use("/tweets/:id/comments", commentRoutes);
app.use("/", userRoutes);
app.use("/admin", adminRoutes);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  const flag = true;
  res.render("home", { flag });
});

app.get("/showpage", (req, res) => {
  res.render("showpage");
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, somethign went wrong!";
  console.log(err);
  res.status(statusCode).render("error", { err });
});

app.listen(3000, (req, res) => {
  console.log("On Port 3000!");
});
