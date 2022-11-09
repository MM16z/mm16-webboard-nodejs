const express = require("express");
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const router = express.Router();

const db = require("../db");

const saltRounds = 10;

router.post("/register", jsonParser, (req, res, next) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    db.query(
      "INSERT INTO `mm16-webboard`.`users` (`username`, `email`, `password`) VALUES(?, ?, ?)",
      [req.body.username, req.body.email, hash],
      (err, result, fields) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        } else {
          res.json({ status: "ok", message: "success" });
        }
      }
    );
  });
});

module.exports = router;
