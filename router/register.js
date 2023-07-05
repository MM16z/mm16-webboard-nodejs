const express = require("express");
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const router = express.Router();

const db = require("../db");

const saltRounds = 10;

router.post("/register", jsonParser, (req, res, next) => {
  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    try {
      const query = `INSERT INTO "mm16-webboard".users (username, email, password) VALUES ($1, $2, $3)`;
      const values = [req.body.username, req.body.email, hash];
      await db.none(query, values);
      res.json({ status: "ok", message: "success" });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", message: error });
    }
  });
});

module.exports = router;
