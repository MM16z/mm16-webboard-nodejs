const express = require("express");
const router = express.Router();
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const mm16ztoken = "mm16z-login-token-1616";

const db = require("../db");

router.post("/login", jsonParser, (req, res, next) => {
  db.query(
    "SELECT * FROM `mm16-webboard`.`users` WHERE email=?",
    [req.body.email],
    (err, email, fields) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (email.length == 0) {
        res.json({ status: "error", message: "user not found" });
        return;
      }
      bcrypt.compare(req.body.password, email[0].password, (err, isLogin) => {
        if (isLogin) {
          let token = jwt.sign(
            {
              email: email[0].email,
              username: email[0].username,
              userId: email[0].user_id,
            },
            mm16ztoken,
            {
              expiresIn: "1h",
            }
          );
          res.json({ status: "ok", message: "login success", token });
        } else {
          res.json({ status: "error", message: "login failed" });
        }
      });
    }
  );
});

module.exports = router;
