const express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var jsonParser = bodyParser.json();

const mm16ztoken = "mm16z-login-token-1616";

const router = express.Router();

router.post("/jwtauth", jsonParser, (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, mm16ztoken, (err, decoded) => {
    if (err) return res.json({ status: "error", message: err.message });
    res.json({ status: "ok", decoded });
  });
});

module.exports = router;
