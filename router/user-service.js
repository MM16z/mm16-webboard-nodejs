const express = require("express");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const db = require("../db");

const router = express.Router();

router.post("/user_post_create", jsonParser, (req, res, next) => {
  if (req.body.postcontent.trim().length === 0 || null || undefined) {
    res.json({ status: "error", message: "emtpy content" });
    return;
  }
  db.query(
    "INSERT INTO `mm16-webboard`.`posts` (`post_from`, `post_title`, `post_content`) VALUES (?, ?, ?)",
    [req.body.postfrom, req.body.posttitle, req.body.postcontent],
    (err, results, fields) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.json({ status: "ok", message: "Success" });
      }
    }
  );
});

router.post("/user_post_edit", jsonParser, (req, res, next) => {
  if (req.body.editcontent.trim().length === 0 || null || undefined) {
    res.json({ status: "error", message: "emtpy content" });
    return;
  }
  db.query(
    "UPDATE `mm16-webboard`.`posts` SET `post_content` =? WHERE (`post_id` =?)",
    [req.body.editcontent, req.body.postid],
    (err, results, fields) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.json({ status: "ok", message: "Success" });
      }
    }
  );
});

router.post("/user_post_delete", jsonParser, (req, res, next) => {
  db.query(
    "DELETE FROM `mm16-webboard`.`posts` WHERE (`post_id` =?)",
    [req.body.userpostid],
    (err, results, fields) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.json({ status: "ok", message: "Success" });
      }
    }
  );
});

router.post("/user_post_comment", jsonParser, (req, res, next) => {
  if (req.body.postcontent.trim().length === 0 || null || undefined) {
    res.json({ status: "error", message: "emtpy content" });
    return;
  }
  db.query(
    "INSERT INTO `mm16-webboard`.`comments` (`comment_from`, `comment_content`, `at_post_id`) VALUES (?, ?, ?)",
    [req.body.postfrom, req.body.postcontent, req.body.postid],
    (err, results, fields) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.json({ status: "ok", message: "Success" });
      }
    }
  );
});

router.post("/user_post_liked", jsonParser, (req, res, next) => {
  db.query(
    "INSERT INTO `mm16-webboard`.`postliked` (`user_id`, `at_post_id`) VALUES (?, ?)",
    [req.body.userId, req.body.postid],
    (err, results, fields) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.json({ status: "ok", message: "Success" });
      }
    }
  );
});

router.post("/user_post_unliked", jsonParser, (req, res, next) => {
  db.query(
    "DELETE FROM `mm16-webboard`.`postliked` WHERE (`user_id`=? AND `at_post_id`=?)",
    [req.body.userId, req.body.postId],
    (err, results, fields) => {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      } else {
        res.json({ status: "ok", message: "Success" });
      }
    }
  );
});

module.exports = router;
