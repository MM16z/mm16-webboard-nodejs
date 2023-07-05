const express = require("express");

const db = require("../db");

const router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.post("/logout", jsonParser, async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwtToken) return res.sendStatus(204);
  const refreshToken = cookies.jwtToken;
  try {
    const query = `SELECT * FROM "mm16-webboard".users WHERE refresh_token = $`;
    const values = [refreshToken];
    const username = await db.oneOrNone(query, values);
    if (!username) {
      res.clearCookie("jwtToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.sendStatus(204);
    }
    if (username.refresh_token !== refreshToken) {
      res.clearCookie("jwtToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.sendStatus(204);
    }
    if (username.refresh_token === refreshToken) {
      res.clearCookie("jwtToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      const updateQuery = `UPDATE "mm16-webboard".users SET refresh_token = $1 WHERE username = $2`;
      const updateValues = [null, username.username];
      await db.none(updateQuery, updateValues);
      return res.sendStatus(204);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
});

module.exports = router;
