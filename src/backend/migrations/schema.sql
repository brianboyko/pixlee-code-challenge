CREATE TABLE "media"
  (
     "id"                   SERIAL,
     "number_likes"         INTEGER,
     "number_comments"      INTEGER,
     "type"                 TEXT(100),
     "attribution"          TEXT,
     "location"             TEXT,
     "filter"               TEXT,
     "link_url"             TEXT,
     "created_time"         TIMESTAMP,
     "caption_text"         TEXT,
     "caption_created_time" TIMESTAMP,
     "image_id"             INTEGER,
     "ig_users_id"          INTEGER,
     "video_id"             INTEGER,
     PRIMARY KEY ("id")
  );

CREATE TABLE "tags"
  (
     "id"       SERIAL,
     "tag_name" VARCHAR(100),
     PRIMARY KEY ("id")
  );

CREATE TABLE "queries"
  (
     "id"             SERIAL,
     "tag_id"         INTEGER,
     "earliest_date"  TIMESTAMP,
     "latest_date"    TIMESTAMP,
     "completed"      BOOLEAN,
     "time_requested" TIMESTAMP,
     "time_completed" TIMESTAMP,
     "user_email"     TEXT,
     PRIMARY KEY ("id")
  );

CREATE TABLE "queries_media"
  (
     "id"       SERIAL,
     "query_id" INTEGER,
     "media_id" INTEGER,
     PRIMARY KEY ("id")
  );

CREATE TABLE "media_tags"
  (
     "id"        SERIAL,
     "tag_id"    INTEGER,
     "media_id" INTEGER,
     PRIMARY KEY ("id")
  );

CREATE TABLE "images"
  (
     "id"              SERIAL,
     "low_url"         TEXT,
     "thumb_url"       TEXT,
     "standard_url"    TEXT,
     "low_width"       INTEGER,
     "low_height"      INTEGER,
     "thumb_width"     INTEGER,
     "thumb_height"    INTEGER,
     "standard_width"  INTEGER,
     "standard_height" INTEGER,
     PRIMARY KEY ("id")
  );

CREATE TABLE "ig_users"
  (
     "id"            SERIAL,
     "ig_user_id"    BIGINT,
     "ig_username"   TEXT,
     "ig_profilepic" TEXT,
     "ig_fullname"   TEXT,
     PRIMARY KEY ("id")
  );

CREATE TABLE "videos"
  (
     "id"           SERIAL,
     "low_res"      TEXT,
     "standard_res" TEXT,
     "low_band"     TEXT,
     PRIMARY KEY ("id")
  );

ALTER TABLE "media"
  ADD FOREIGN KEY ("image_id") REFERENCES "images" ("id");

ALTER TABLE "media"
  ADD FOREIGN KEY ("ig_users_id") REFERENCES "ig_users" ("id");

ALTER TABLE "media"
  ADD FOREIGN KEY ("video_id") REFERENCES "videos" ("id");

ALTER TABLE "queries"
  ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("id");

ALTER TABLE "queries_media"
  ADD FOREIGN KEY ("query_id") REFERENCES "queries" ("id");

ALTER TABLE "queries_media"
  ADD FOREIGN KEY ("media_id") REFERENCES "media" ("id");

ALTER TABLE "media_tags"
  ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("id");

ALTER TABLE "media_tags"
  ADD FOREIGN KEY ("media_id") REFERENCES "media" ("id"); 
