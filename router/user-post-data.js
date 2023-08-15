const express = require("express");
const {PrismaClient} = require('@prisma/client')
const db = require("../db/");

const prisma = new PrismaClient()
const router = express.Router();

router.get("/user_posts/:offset", async (req, res) => {
    // let offset = null;
    let offset = parseInt(req.params.offset);
    // const currentQuery = Number(req.query.currentQuery);
    const currentUserId = Number(req.query.currentUserId) || null;
    try {
        // const query = `
        //     SELECT
        //     posts.post_id,
        //     posts.post_from,
        //     posts.post_title,
        //     posts.post_content,
        //     posts.post_createdAt,
        //     EXISTS (
        //       SELECT 1
        //       FROM "mm16-webboard".postliked
        //       WHERE postliked.at_post_id = posts.post_id
        //         AND postliked.user_id = $1
        //     ) AS isLiked,
        //     (
        //       SELECT COUNT(at_post_id)
        //       FROM "mm16-webboard".postliked
        //       WHERE at_post_id = posts.post_id
        //     ) AS post_liked_count,
        //     COALESCE(
        //       (
        //         SELECT json_agg(json_build_object(
        //           'comment_id', comments.comment_id,
        //           'comment_from', comments.comment_from,
        //           'comment_content', comments.comment_content,
        //           'comment_date', comments.comment_createdAt
        //         ))
        //         FROM "mm16-webboard".comments
        //         WHERE comments.at_post_id = posts.post_id
        //       ),
        //       '[]'
        //     ) AS comments
        //   FROM
        //   "mm16-webboard".posts
        //     LEFT JOIN "mm16-webboard".comments ON comments.at_post_id = posts.post_id
        //     GROUP BY post_id
        //     ORDER BY post_id ASC
        //     LIMIT 6
        //     offset $2`;
        //
        // const values = [currentUserId, offset];
        // const allPosts = await db.any(query, values);
        //
        // const countQuery = `SELECT COUNT(post_id) as all_post_count FROM "mm16-webboard".posts`;
        // const postCount = await db.one(countQuery);

        // res.json({
        //   allPosts: allPosts,
        //   postsCount: postCount.all_post_count,
        // });

        console.log("currentUserId", currentUserId);

        const allPosts = await prisma.posts.findMany({
            select: {
                post_id: true,
                post_from: true,
                post_title: true,
                post_content: true,
                post_createdat: true,
                comments: {
                    select: {
                        comment_id: true,
                        comment_from: true,
                        comment_content: true,
                        comment_createdat: true
                    }
                },
                postliked: {
                    select: {
                        user_id: true
                    },
                    where: {
                        user_id: currentUserId ?? undefined
                    }
                }
            },
            orderBy: {
                post_id: 'asc'
            },
            take: 6,
            skip: offset
        });

        const postIds = allPosts.map(post => post.post_id);

        const postLikedCounts = await prisma.postliked.groupBy({
            by: ['at_post_id'],
            where: {
                at_post_id: {
                    in: postIds
                },
            },
            _count: true
        });

        const combinedPosts = allPosts.map(post => {
            const likedCount = postLikedCounts.find(count => count.at_post_id === post.post_id);
            const isLiked = post.postliked.some(like => like.user_id === currentUserId);
            return {
                ...post,
                isLiked,
                post_liked_count: likedCount ? likedCount._count : 0
            };
        });

        const postCount = await prisma.posts.count();

        res.json({
            allPosts: combinedPosts,
            postsCount: postCount
        });

    } catch (error) {
        console.log(error);
        res.json({status: "error", message: error});
    }
});

router.get("/current_user_posts", async (req, res) => {
    const currentUserId = Number(req.query.currentUserId) || null;
    try {
        //if admin get all posts data
        if (currentUserId && currentUserId === 1) {
            const allPosts = await prisma.posts.findMany({
                select: {
                    post_id: true,
                    post_from: true,
                    post_title: true,
                    post_content: true,
                    post_createdat: true,
                },
                orderBy: {
                    post_id: 'asc'
                }
            });
            res.json({
                userPostData: allPosts
            });
            return;
        }
        const userPostData = await prisma.posts.findMany({
            where: {
                post_from_userid: currentUserId ?? undefined
            }
        });

        res.json({userPostData: userPostData});

    } catch (error) {
        console.log(error);
        res.json({error});
    }
});

module.exports = router;
