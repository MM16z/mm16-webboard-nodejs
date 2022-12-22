const express = require("express");

const db = require("../db");

const router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var jwt = require("jsonwebtoken");

const mm16ztoken = "mm16z-login-token-1616";
const mm16zrefreshtoken = "mm16z-login-refresh-token-1616";

router.post("/refreshjwtauth", jsonParser, (req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://mm16z-webboard-nextjs-fullstack.vercel.app"
  );
  const cookies = req.cookies;
  console.log(cookies?.jwtToken);
  if (!cookies?.jwtToken) return res.sendStatus(401);
  const refreshToken = cookies.jwtToken;
  db.query(
    "SELECT * FROM `mm16-webboard`.`users` WHERE refresh_token=?",
    [refreshToken],
    (err, username, field) => {
      if (err) return res.sendStatus(403);
      // if (!username[0]) res.sendStatus(204);
      // if (username[0]?.refresh_token !== refreshToken)
      //   return res.sendStatus(403);
      if (!username[0]) return res.sendStatus(204);
      if (username[0].refresh_token !== refreshToken)
        return res.sendStatus(403);
      jwt.verify(refreshToken, mm16zrefreshtoken, (err, decoded) => {
        if (err) return res.sendStatus(403);
        // if (err) return res.json({ ERROR: err });
        if (username[0].username !== decoded.username)
          return res.sendStatus(403);
        const accessToken = jwt.sign(
          {
            email: username[0].email,
            username: username[0].username,
            userId: username[0].user_id,
          },
          mm16ztoken,
          {
            expiresIn: "900s",
          }
        );
        res.json({ status: "ok", accessToken });
      });
    }
  );
});

module.exports = router;
