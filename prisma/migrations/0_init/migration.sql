-- CreateTable
CREATE TABLE "comments" (
    "comment_id" SERIAL NOT NULL,
    "comment_from" VARCHAR NOT NULL,
    "comment_content" TEXT NOT NULL,
    "comment_createdat" TIMESTAMPTZ(2) NOT NULL,
    "at_post_id" INTEGER NOT NULL,
    CONSTRAINT "comments_pk" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "postliked" (
    "at_post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,
    CONSTRAINT "postliked_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "post_id" SERIAL NOT NULL,
    "post_from" VARCHAR NOT NULL,
    "post_title" VARCHAR NOT NULL,
    "post_content" TEXT NOT NULL,
    "post_createdat" TIMESTAMPTZ(2) NOT NULL,
    "post_from_userid" INTEGER NOT NULL,
    CONSTRAINT "posts_pk" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "create_time" TIMESTAMPTZ(2) NOT NULL,
    "refresh_token" VARCHAR,
    CONSTRAINT "users_pk" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "postliked_un" ON "postliked"("user_id", "at_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_postliked_ids" ON "postliked"("post_liked_id", "at_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_un" ON "users"("refresh_token", "username", "email");

-- AddForeignKey
ALTER TABLE
    "comments"
ADD
    CONSTRAINT "comments_fk" FOREIGN KEY ("at_post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "postliked"
ADD
    CONSTRAINT "postliked_fk" FOREIGN KEY ("at_post_id") REFERENCES "posts"("post_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "postliked"
ADD
    CONSTRAINT "postliked_fk_1" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE
    "posts"
ADD
    CONSTRAINT "posts_fk" FOREIGN KEY ("post_from_userid") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;