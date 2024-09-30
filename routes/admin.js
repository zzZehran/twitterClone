const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (req.query.isAdmin) {
    return next();
  }
  res.send("SORRY NOT AN ADMIN!");
});

router.get("/", (req, res) => {
  res.send("THIS IS TOP SECRET!");
});

module.exports = router;
