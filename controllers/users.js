const User = require("../models/user");

module.exports.showRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.makeUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username, password });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, function (err) {
      if (err) {
        return next(err);
      }
      console.log(registeredUser);
      req.flash("success", "Welcome to Twitter!");
      res.redirect("/tweets");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.showLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/tweets";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out succesfully.");
    res.redirect("/tweets");
  });
};
