const express = require("express");
const router = express.Router();
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const mm16ztoken = "mm16z-login-token-1616";
const mm16zrefreshtoken = "mm16z-login-refresh-token-1616";

const db = require("../db");

router.post("/login", jsonParser, (req, res, next) => {
  db.query(
    "SELECT * FROM `mm16-webboard`.`users` WHERE email=?",
    [req.body.email],
    (err, email, fields) => {
      if (err) return res.json({ status: "error", message: err });
      if (email.length == 0)
        return res.json({ status: "error", message: "user not found" });
      bcrypt.compare(req.body.password, email[0].password, (err, isLogin) => {
        if (isLogin) {
          const accessToken = jwt.sign(
            {
              email: email[0].email,
              username: email[0].username,
              userId: email[0].user_id,
            },
            mm16ztoken,
            {
              expiresIn: "10s",
            }
          );
          const refreshToken = jwt.sign(
            {
              email: email[0].email,
              username: email[0].username,
              userId: email[0].user_id,
            },
            mm16zrefreshtoken,
            {
              expiresIn: "1d",
            }
          );
          db.query(
            "UPDATE `mm16-webboard`.`users` SET `refresh_token` =? WHERE (`email` =?)",
            [refreshToken, email[0].email],
            (err, result) => {
              if (err) return res.json({ err: err });
            }
          );
          res.cookie("jwtToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
          });
          res.cookie("userId", email[0].user_id, {
            // httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          res.json({
            status: "ok",
            message: "login success",
            accessToken,
          });
        } else {
          res.json({ status: "error", message: err });
        }
      });
    }
  );
});

module.exports = router;
