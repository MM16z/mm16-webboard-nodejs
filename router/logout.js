const express = require("express");

const db = require("../db");

const router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.post("/logout", jsonParser, (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwtToken) return res.sendStatus(204);
  const refreshToken = cookies.jwtToken;
  db.query(
    "SELECT * FROM `mm16-webboard`.`users` WHERE refresh_token=?",
    [refreshToken],
    (err, username, field) => {
      if (err) return res.sendStatus(403);
      if (username[0].refresh_token !== refreshToken) {
        res.clearCookie("jwtToken", { httpOnly: true, secure: true });
        return res.sendStatus(204);
      }
      if (username[0].refresh_token === refreshToken) {
        db.query(
          "UPDATE `mm16-webboard`.`users` SET `refresh_token` =? WHERE (`username` =?)",
          [null, username[0].username],
          (err) => {
            if (err) return res.sendStatus(403);
            res.clearCookie("jwtToken", { httpOnly: true, secure: true });
            return res.sendStatus(204);
          }
        );
      }
    }
  );
});

module.exports = router;
