const express = require("express");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const db = require("../db");

const router = express.Router();

router.post("/user_post_create", jsonParser, async (req, res, next) => {
  if (req.body.postcontent.trim().length === 0 || null || undefined) {
    res.json({ status: "error", message: "emtpy content" });
    return;
  }
  try {
    const query = `INSERT INTO "mm16-webboard".posts (post_from, post_from_userId, post_title, post_content) VALUES ($1, $2, $3, $4)`;
    const values = [
      req.body.postfrom,
      req.body.postfromuserid,
      req.body.posttitle,
      req.body.postcontent,
    ];
    await db.none(query, values);
    res.json({ status: "ok", message: "Success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error });
  }
});

router.post("/user_post_edit", jsonParser, async (req, res, next) => {
  if (req.body.editcontent.trim().length === 0 || null || undefined) {
    res.json({ status: "error", message: "emtpy content" });
    return;
  }
  try {
    const query = `UPDATE "mm16-webboard".posts SET post_content = $1 WHERE post_id = $2`;
    const values = [req.body.editcontent, req.body.postid];
    await db.none(query, values);
    res.json({ status: "ok", message: "Success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error });
  }
});

router.post("/user_post_delete", jsonParser, async (req, res, next) => {
  try {
    const query = `DELETE FROM "mm16-webboard".posts WHERE post_id = $1`;
    const values = [req.body.userpostid];
    await db.none(query, values);
    res.json({ status: "ok", message: "Success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error });
  }
});

router.post("/user_post_comment", jsonParser, async (req, res, next) => {
  if (req.body.postcontent.trim().length === 0 || null || undefined) {
    res.json({ status: "error", message: "emtpy content" });
    return;
  }
  try {
    const query = `INSERT INTO "mm16-webboard".comments (comment_from, comment_content, at_post_id) VALUES ($1, $2, $3)`;
    const values = [req.body.postfrom, req.body.postcontent, req.body.postid];
    await db.none(query, values);
    res.json({ status: "ok", message: "Success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error });
  }
});

router.post("/user_post_liked", jsonParser, async (req, res, next) => {
  try {
    const query = `INSERT INTO "mm16-webboard".postliked (user_id, at_post_id) VALUES ($1, $2)`;
    const values = [req.body.userid, req.body.postid];
    await db.none(query, values);
    res.json({ status: "ok", message: "Success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error });
  }
});

router.post("/user_post_unliked", jsonParser, async (req, res, next) => {
  try {
    const query = `DELETE FROM "mm16-webboard".postliked WHERE user_id = $1 AND at_post_id = $2`;
    const values = [req.body.userid, req.body.postid];
    await db.none(query, values);
    res.json({ status: "ok", message: "Success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error });
  }
});

module.exports = router;
