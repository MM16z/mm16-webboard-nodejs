const express = require("express");
const { PrismaClient } = require('@prisma/client')

// const db = require("../db");
const prisma = new PrismaClient();

const router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var jwt = require("jsonwebtoken");

const mm16ztoken = "mm16z-login-token-1616";
const mm16zrefreshtoken = "mm16z-login-refresh-token-1616";

router.post("/refreshjwtauth", jsonParser, async (req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://mm16z-webboard-nextjs-fullstack.vercel.app",
      "http://localhost:3000"
  );
  const cookies = req.cookies;
  if (!cookies?.jwtToken) return res.sendStatus(401);
  const refreshToken = cookies.jwtToken;
  try {
    const username = await prisma.users.findMany({
      where: {
        refresh_token: refreshToken
      }
    });
    if (!username[0]) return res.sendStatus(204);
    if (username[0].refresh_token !== refreshToken) return res.sendStatus(403);
    jwt.verify(refreshToken, mm16zrefreshtoken, (err, decoded) => {
      if (err) return res.sendStatus(403);
      // if (err) return res.json({ ERROR: err });
      if (username[0].username !== decoded.username) return res.sendStatus(403);
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
  } catch (error) {
    return res.sendStatus(403);
  }
});

module.exports = router;
