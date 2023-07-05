const express = require("express");
const db = require("../db/");

const router = express.Router();

router.get("/user_posts/:offset", async (req, res) => {
  // let offset = null;
  let offset = parseInt(req.params.offset);
  // const currentQuery = Number(req.query.currentQuery);
  const currentUserId = req.query.currentUserId || null;
  // if (currentQuery) {
  //   offset = (currentQuery - 1) * 6;
  // } else {
  //   offset = 0;
  // }
  try {
    // db.query(
    //   `SELECT post_id, post_from, post_title, post_content, post_createdAt,
    //   IF(postliked.user_id, TRUE,FALSE) as isLiked,
    //   (
    //     SELECT COUNT(at_post_id)
    //     FROM postliked
    //     WHERE at_post_id = post_id
    //    ) as post_liked_count,

    //    IF(COUNT(comments.comment_id) = 0, JSON_ARRAY(),
    //    JSON_ARRAYAGG(JSON_OBJECT(
    //     "comment_id", comments.comment_id,
    //     "comment_from", comments.comment_from,
    //     "comment_content", comments.comment_content,
    //     "comment_date", comments.comment_createdAt
    //    ))) as comments
    //    FROM posts
    //    LEFT JOIN comments ON comments.at_post_id = post_id
    //    LEFT JOIN postliked ON postliked.at_post_id = posts.post_id AND postliked.user_id = ${currentUserId}
    //    GROUP BY post_id
    //    ORDER BY post_id, "asc"
    //    LIMIT ${offset},6`,
    //   function (err, results, fields) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       allPosts = results;
    //     }
    //   }
    // );
    // db.query(
    //   `SELECT COUNT(post_id) as all_post_count FROM posts`,
    //   function (err, results, fields) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       postCount = results;
    //     }
    //     res.json({
    //       postsCount: postCount[0],
    //       allPosts: allPosts,
    //     });
    //   }
    // );
    const allpostQuery = `
    SELECT post_id, post_from, post_title, post_content, post_createdAt,
    CASE WHEN postliked.user_id IS NOT NULL THEN TRUE ELSE FALSE END as isLiked,
    (
      SELECT COUNT(at_post_id)
      FROM "mm16-webboard".postliked
      WHERE at_post_id = post_id
    ) as post_liked_count,
    COALESCE(
      json_agg(
        json_build_object(
          'comment_id', comments.comment_id,
          'comment_from', comments.comment_from,
          'comment_content', comments.comment_content,
          'comment_date', comments.comment_createdAt
        )
      ),
      '[]'::json
    ) as comments
    FROM "mm16-webboard".posts
    LEFT JOIN "mm16-webboard".comments ON comments.at_post_id = post_id
    LEFT JOIN "mm16-webboard".postliked ON postliked.at_post_id = posts.post_id AND postliked.user_id = $1
    GROUP BY post_id 
    ORDER BY post_id ASC
    LIMIT $2
    offset $3`;
    const postcountQuery = `SELECT COUNT(post_id) as all_post_count FROM posts`;
    const allPost = await db.any(allpostQuery, [currentUserId, 6, offset]);
    const postCount = await db.any(postcountQuery);
    if (allPost && postCount) {
      res.json({
        postsCount: postCount[0],
        allPosts: allPost,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/current_user_posts", async (req, res) => {
  const currentUserId = req.query.currentUserId || null;
  try {
    const query = `SELECT * FROM "mm16-webboard".posts WHERE post_from_userId = $1`;
    const results = await db.query(query, [currentUserId]);
    res.json({ userPostData: results });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

module.exports = router;
