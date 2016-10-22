export default (knex) => {

  const createTable_tags = () => new Promise(function(resolve, reject) {
    knex.schema.createTable('tags', (table) => {
      table.increments();
      table.string("tag_name");
    }).then(() => resolve()).catch((e) => reject(e))
  });

  const createTable_images = () => new Promise(function(resolve, reject) {
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

  const createTable_ig_users = () => new Promise(function(resolve, reject) {
    knex.schema.createTable('ig_users', (table) => {
      table.increments();
      table.integer("ig_user_id");
      table.string("ig_username");
      table.string("ig_profilepic");
      table.string("ig_fullname");
    }).then(() => resolve()).catch((e) => reject(e))
  });

  const createTable_queries = () => new Promise(function(resolve, reject) {
    knex.schema.createTable('queries', (table) => {
      table.increments();
      table.integer("tag_id").references("id").inTable('tags')
      table.timestamp("earliest_date");
      table.timestamp("latest_date");
    }).then(() => resolve()).catch((e) => reject(e))
  });

  const createTable_media = () => new Promise(function(resolve, reject) {
    knex.schema.createTable('media', (table) => {
      table.increments();
      table.timestamp("created_time");
      table.integer("ig_users_id").references('id').inTable('ig_users');
      table.integer("image_id").references('id').inTable('images');
      table.timestamp("caption_created_time");
      table.string("caption_text");
      table.integer("number_likes");
      table.integer("number_comments");
      table.string("attribution");
      table.string("location");
      table.string("filter");
      table.string("link_url");
    }).then(() => resolve()).catch((e) => reject(e))
  });

  const createTable_tags_queries = () => new Promise(function(resolve, reject) {
    knex.schema.createTable('tags_queries', (table) => {
      table.increments();
      table.integer("tag_id").references('id').inTable('tags');
      table.integer("query_id").references('id').inTable('queries');
    }).then(() => resolve()).catch((e) => reject(e))
  });

  const createTable_queries_media = () => new Promise(function(resolve, reject) {
    knex.schema.createTable('queries_media', (table) => {
      table.increments();
      table.integer("query_id").references('id').inTable('queries');
      table.integer("media_id").references('id').inTable('media');
    }).then(() => resolve()).catch((e) => reject(e))
  });

  const createTable_media_tags = () => new Promise(function(resolve, reject) {
    knex.schema.createTable('media_tags', (table) => {
      table.increments();
      table.integer("tag_id").references('id').inTable('tags');
      table.integer("media_id").references('id').inTable('media');
    }).then(() => resolve()).catch((e) => reject(e))
  });

  return {
    up: () => new Promise(function(resolve, reject) {
      Promise.all([
        createTable_tags(),
        createTable_images(),
        createTable_ig_users(),
        createTable_queries(),
        createTable_tags_queries(),
        createTable_media(),
        createTable_media_tags(),
        createTable_queries_media()
      ])
      .then(() => resolve())
      .catch((e) => reject(e))
    }),
    down: () => Promise.all([
      'media',
      'tags',
      'queries',
      'tags_queries',
      'queries_media',
      'media_tags',
      'images',
      'ig_users',
      'captions'
    ].map((table) => knex.schema.dropTableIfExists(table))),
  }
};
