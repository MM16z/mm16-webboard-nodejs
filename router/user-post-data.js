const express = require("express");
const db = require("../db/");

const router = express.Router();

router.get("/user_posts", async (req, res) => {
  let offset = null;
  const currentQuery = Number(req.query.currentQuery);
  const currentUserId = req.query.currentUserId || null;
  console.log(req.headers.Cookie);
  console.log(currentUserId);
  if (currentQuery) {
    offset = (currentQuery - 1) * 6;
  } else {
    offset = 0;
  }
  try {
    db.query(
      `SELECT post_id, post_from, post_title, post_content, post_createdAt,
      IF(postliked.user_id, TRUE,FALSE) as isLiked,
      (
        SELECT COUNT(at_post_id)
        FROM postliked
        WHERE at_post_id = post_id
       ) as post_liked_count,
      
       IF(COUNT(comments.comment_id) = 0, JSON_ARRAY(),
       JSON_ARRAYAGG(JSON_OBJECT(
        "comment_id", comments.comment_id,
        "comment_from", comments.comment_from,
        "comment_content", comments.comment_content,
        "comment_date", comments.comment_createdAt
       ))) as comments
       FROM posts
       LEFT JOIN comments ON comments.at_post_id = post_id
       LEFT JOIN postliked ON postliked.at_post_id = posts.post_id AND postliked.user_id = ${currentUserId}
       GROUP BY post_id
       ORDER BY post_id, "asc"
       LIMIT ${offset},6`,
      function (err, results, fields) {
        if (err) {
          console.log(err);
        } else {
          allPosts = results;
        }
      }
    );
    db.query(
      `SELECT COUNT(post_id) as all_post_count FROM posts`,
      function (err, results, fields) {
        if (err) {
          console.log(err);
        } else {
          postCount = results;
        }
        res.json({
          postsCount: postCount[0],
          allPosts: allPosts,
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

router.get("/current_user_posts", async (req, res) => {
  const currentUserId = req.query.currentUserId || null;

  try {
    db.query(
      `SELECT * FROM posts WHERE post_from_userId = "${currentUserId}"`,
      function (err, results, fields) {
        if (err) {
          res.json({ error: err });
        } else {
          res.json({ userPostData: results });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
