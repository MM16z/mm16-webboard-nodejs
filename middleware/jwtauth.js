const express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var jsonParser = bodyParser.json();

const mm16ztoken = "private";

const router = express.Router();

router.post("/jwtauth", jsonParser, (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, mm16ztoken, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    res.json({ status: "ok", decoded });
  });
});

module.exports = router;
