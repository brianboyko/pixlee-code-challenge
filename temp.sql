-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'tags'
--
-- ---

DROP TABLE IF EXISTS `tags`;

CREATE TABLE `tags` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `tag_name` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `queries` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `tag` VARCHAR(100) NULL DEFAULT NULL,
  `start_date` DATETIME NULL DEFAULT NULL,
  `end_date` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `tag_queries` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `tag` INTEGER NULL DEFAULT NULL,
  `queries` INTEGER NULL DEFAULT NULL,
)


CREATE TABLE `media_tags` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `tag` INTEGER NULL DEFAULT NULL,
  `media` INTEGER NULL DEFAULT NULL,
)

CREATE TABLE image (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `low_url` MEDIUMTEXT NULL DEFAULT NULL,
  `low_width` INTEGER NULL DEFAULT NULL,
  `low_height` INTEGER NULL DEFAULT NULL,
  `thumb_url` MEDIUMTEXT NULL DEFAULT NULL,
  `thumb_width` INTEGER NULL DEFAULT NULL,
  `thumb_height` INTEGER NULL DEFAULT NULL,
  `standard_url` MEDIUMTEXT NULL DEFAULT NULL,
  `standard_width` INTEGER NULL DEFAULT NULL,
  `standard_height` INTEGER NULL DEFAULT NULL,
)
CREATE TABLE `media` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `type` MEDIUMTEXT NULL DEFAULT NULL,
  `attribution` MEDIUMTEXT NULL DEFAULT NULL,
  `location` MEDIUMTEXT NULL DEFAULT NULL,
  `number_comments` INTEGER NULL DEFAULT NULL,
  `filter` MEDIUMTEXT NULL DEFAULT NULL,
  `created_time` DATETIME NULL DEFAULT NULL,
  `link` MEDIUMTEXT NULL DEFAULT NULL,
  `number_likes` INTEGER NULL DEFAULT NULL,
  `image` INTEGER NULL DEFAULT NULL

       "images": {
         "low_resolution": {
           "url": "https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/14718075_1069600626472339_8637521682883411968_n.jpg?ig_cache_key=MTM2NTg4NDY1MDQ0NjUxMjMzOA%3D%3D.2",
           "width": 320,
           "height": 320
         },
         "thumbnail": {
           "url": "https://scontent.cdninstagram.com/t51.2885-15/s150x150/e35/14718075_1069600626472339_8637521682883411968_n.jpg?ig_cache_key=MTM2NTg4NDY1MDQ0NjUxMjMzOA%3D%3D.2",
           "width": 150,
           "height": 150
         },
         "standard_resolution": {
           "url": "https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/14718075_1069600626472339_8637521682883411968_n.jpg?ig_cache_key=MTM2NTg4NDY1MDQ0NjUxMjMzOA%3D%3D.2",
           "width": 640,
           "height": 640
         }
       },
       "users_in_photo": [],
       "caption": {
         "created_time": "1477046160",
         "text": "Here's another from our yodeling duet!! #Yodel #jodel #yodeling #thearnienewmanbandftfrancelle #theranchsaloon #copelandentertainment #love #passion #singing #yodelers #happy #livemusic #countrymusic #classiccountry #stage #countrygirl #western #cowboys #country #picoftheday #instagram #instadaily",
         "from": {
           "username": "francellemusic",
           "profile_picture": "https://scontent.cdninstagram.com/t51.2885-19/s150x150/14156546_111154102677422_56629811_a.jpg",
           "id": "23471235",
           "full_name": "Francelle"
         },
         "id": "17853973246120582"
       },
       "user_has_liked": false,
       "id": "1365884650446512338_23471235",
       "user": {
         "username": "francellemusic",
         "profile_picture": "https://scontent.cdninstagram.com/t51.2885-19/s150x150/14156546_111154102677422_56629811_a.jpg",
         "id": "23471235",
         "full_name": "Francelle"
       }
     },
)


-- ---
-- Table 'record'
--
-- ---

DROP TABLE IF EXISTS `record`;

CREATE TABLE `record` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `type` VARCHAR(10) NULL DEFAULT NULL COMMENT '"Image or video"',
  `attribution` MEDIUMTEXT NULL DEFAULT NULL,
  `tags` MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys
-- ---


-- ---
-- Table Properties
-- ---

-- ALTER TABLE `tags` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `record` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `tags` (`id`,`tag`,`new field`) VALUES
-- ('','','');
-- INSERT INTO `record` (`id`,`type`,`attribution`,`tags`) VALUES
-- ('','','','');
