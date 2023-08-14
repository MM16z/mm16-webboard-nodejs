const express = require("express");
const { PrismaClient } = require('@prisma/client')
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const router = express.Router();

const db = require("../db");
const prisma = new PrismaClient()

const saltRounds = 10;

router.post("/register", jsonParser, (req, res, next) => {
  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    try {
      // const query = `INSERT INTO "mm16-webboard".users (username, email, password) VALUES ($1, $2, $3)`;
      // const values = [req.body.username, req.body.email, hash];
      // await db.none(query, values);
      // res.json({ status: "ok", message: "success" });
      const userData = {
        username: req.body.username,
        email: req.body.email,
        password: hash,
        create_time: new Date()
      };

      await prisma.users.create({
        data: userData
      });

      res.json({ status: "ok", message: "Success" });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", message: error });
    }
  });
});

module.exports = router;
