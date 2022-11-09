const express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var jsonParser = bodyParser.json();

const mm16ztoken = "mm16z-login-token-1616";

const router = express.Router();

router.post("/jwtauth", jsonParser, (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.verify(token, mm16ztoken);
    res.json({ status: "ok", decoded });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

module.exports = router;
