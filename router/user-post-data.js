const express = require("express");
const db = require("../db/");

const router = express.Router();

router.get("/user_posts/:offset", async (req, res) => {
  // let offset = null;
  let offset = parseInt(req.params.offset);
  // const currentQuery = Number(req.query.currentQuery);
  const currentUserId = req.query.currentUserId || null;
  try {
    const query = `
      SELECT
        posts.post_id,
        posts.post_from,
        posts.post_title,
        posts.post_content,
        posts.post_createdAt,
        (postliked.user_id IS NOT NULL) AS isLiked,
        (
          SELECT COUNT(at_post_id)
          FROM "mm16-webboard".postliked
          WHERE at_post_id = posts.post_id
        ) AS post_liked_count,
        COALESCE(
          (
            SELECT json_agg(json_build_object(
              'comment_id', comments.comment_id,
              'comment_from', comments.comment_from,
              'comment_content', comments.comment_content,
              'comment_date', comments.comment_createdAt
            ))
            FROM "mm16-webboard".comments
            WHERE comments.at_post_id = posts.post_id
          ),
          '[]'
        ) AS comments
      FROM
      "mm16-webboard".posts
        LEFT JOIN postliked ON postliked.at_post_id = posts.post_id AND postliked.user_id = $1
      GROUP BY
        posts.post_id , postliked.user_id ASC
      ORDER BY
        posts.post_id
      LIMIT
        6,
      OFFSET
        $2`;

    const values = [currentUserId, offset];
    const allPosts = await db.any(query, values);

    const countQuery = `SELECT COUNT(post_id) as all_post_count FROM "mm16-webboard".posts`;
    const postCount = await db.one(countQuery);

    res.json({
      postsCount: postCount.all_post_count,
      allPosts: allPosts,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error });
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
