const express = require("express");
const db = require("../db/");

const router = express.Router();

router.get("/user_posts/:offset", async (req, res) => {
  // let offset = null;
  let offset = parseInt(req.params.offset);
  // const currentQuery = Number(req.query.currentQuery);
  const currentUserId = req.query.currentUserId || null;
  try {
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
    GROUP BY post_id , postliked.user_id
    ORDER BY post_id ASC
    LIMIT $2
    offset $3`;
    const postcountQuery = `SELECT COUNT(post_id) as all_post_count FROM "mm16-webboard".posts`;
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
