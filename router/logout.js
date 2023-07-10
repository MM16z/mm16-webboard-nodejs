const express = require("express");
const { PrismaClient } = require('@prisma/client')

const db = require("../db");
const prisma = new PrismaClient()

const router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.post("/logout", jsonParser, async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwtToken) return res.sendStatus(204);
  const refreshToken = cookies.jwtToken;
  try {
    // const query = `SELECT * FROM "mm16-webboard".users WHERE refresh_token = $1`;
    // const values = [refreshToken];
    // const username = await db.oneOrNone(query, values);
    const user = await prisma.users.findFirst({
      where: {
        refresh_token: refreshToken
      }
    });

    const username = user ? user.username : null;
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
      // const updateQuery = `UPDATE "mm16-webboard".users SET refresh_token = $1 WHERE username = $2`;
      // const updateValues = [null, username.username];
      // await db.none(updateQuery, updateValues);
      await prisma.users.update({
        where: {
          username: username.username
        },
        data: {
          refresh_token: null
        }
      });
      return res.sendStatus(204);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
});

module.exports = router;
