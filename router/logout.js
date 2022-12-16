const express = require("express");

const db = require("../db");

const router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.post("/logout", jsonParser, (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwtToken) return res.sendStatus(203);
  const refreshToken = cookies.jwtToken;
  db.query(
    "SELECT * FROM `mm16-webboard`.`users` WHERE email=?",
    [req.body.email],
    (err, email, field) => {
      if (err) return res.sendStatus(403);
      if (email[0].refresh_token !== refreshToken) return res.sendStatus(403);
      db.query(
        "DELETE FROM `mm16-webboard`.`users` WHERE (`refresh_token` =?)",
        [refreshToken],
        (err) => {
          if (err) return res.sendStatus(403);
          res.clearCookie("jwtToken", { httpOnly: true });
        }
      );
    }
  );
});

module.exports = router;
