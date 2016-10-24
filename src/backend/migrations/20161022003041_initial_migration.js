const createTable_tags = (knex) => new Promise(function(resolve, reject) {
  knex.schema.createTable('tags', (table) => {
    table.increments();
    table.string("tag_name")
    table.unique(["tag_name"])
  }).then(() => resolve()).catch((e) => reject(e))
});

const createTable_images = (knex) => new Promise(function(resolve, reject) {
  knex.schema.createTable('images', (table) => {
    table.increments();
    table.string("low_url");
    table.string("standard_url");
    table.string("thumb_url");
    table.integer("low_width");
    table.integer("standard_width");
    table.integer("thumb_width");
    table.integer("low_height");
    table.integer("standard_height");
    table.integer("thumb_height");
  }).then(() => resolve()).catch((e) => reject(e))
});

const createTable_ig_users = (knex) => new Promise(function(resolve, reject) {
  knex.schema.createTable('ig_users', (table) => {
    table.increments();
    table.integer("ig_user_id");
    table.string("ig_username");
    table.string("ig_profilepic");
    table.string("ig_fullname");
    table.unique(["ig_user_id"]);
  }).then(() => resolve()).catch((e) => reject(e))
});

const createTable_queries = (knex) => new Promise(function(resolve, reject) {
  knex.schema.createTable('queries', (table) => {
    table.increments();
    table.integer("tag_id").references("id").inTable('tags').onDelete('CASCADE');
    table.timestamp("earliest_date");
    table.timestamp("latest_date");
    table.timestamp("time_requested");
    table.timestamp("time_completed");
    table.boolean("completed");
  }).then(() => resolve()).catch((e) => reject(e))
});

const createTable_media = (knex) => new Promise(function(resolve, reject) {
  knex.schema.createTable('media', (table) => {
    table.increments();
    table.timestamp("created_time");
    table.integer("ig_users_id").references('id').inTable('ig_users').onDelete('CASCADE');
    table.integer("image_id").references('id').inTable('images').onDelete('CASCADE');
    table.timestamp("caption_created_time");
    table.string("type");
    table.string("caption_text");
    table.integer("number_likes");
    table.integer("number_comments");
    table.string("attribution");
    table.string("location");
    table.string("filter");
    table.string("link_url");
  }).then(() => resolve()).catch((e) => reject(e))
});

const createTable_queries_media = (knex) => new Promise(function(resolve, reject) {
  knex.schema.createTable('queries_media', (table) => {
    table.increments();
    table.integer("query_id").references('id').inTable('queries').onDelete('CASCADE');
    table.integer("media_id").references('id').inTable('media').onDelete('CASCADE');
  }).then(() => resolve()).catch((e) => reject(e))
});

const createTable_media_tags = (knex) => new Promise(function(resolve, reject) {
  knex.schema.createTable('media_tags', (table) => {
    table.increments();
    table.integer("tag_id").references('id').inTable('tags').onDelete('CASCADE');
    table.integer("media_id").references('id').inTable('media').onDelete('CASCADE');
  }).then(() => resolve()).catch((e) => reject(e))
});

exports.up = (knex) => Promise.all([
      createTable_tags(knex),
      createTable_images(knex),
      createTable_ig_users(knex),
      createTable_queries(knex),
      createTable_tags_queries(knex),
      createTable_media(knex),
      createTable_media_tags(knex),
      createTable_queries_media(knex)
    ])

exports.down = (knex) => Promise.all([
    'media',
    'tags',
    'queries',
    'tags_queries',
    'queries_media',
    'media_tags',
    'images',
    'ig_users',
    'captions'
  ].map((table) => knex.schema.dropTableIfExists(table)))
