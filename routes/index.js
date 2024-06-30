const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  // res.render("index", { title: "Express do Tirso" });
  res.redirect("/catalog");
});

module.exports = router;
