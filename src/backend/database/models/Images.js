'use strict';
// images model


/**
 * Images - model for 'images' table.
 * @param  {object} knex - database connection
 * @return {object}
 *   @method {function} create
 *   @method {function} read
 *   @method {function} del
 */
export default (knex) => {
  /**
   * create - creates an entry.
   * @param  {object} image - information about the image.
   * @return {Promise}
   *   @resolves {Array Singleton w/ Number} - ID of entry in DB.
   */
  const create = (image) => knex('images').insert({
    low_url: image.low_resolution.url,
    low_width: image.low_resolution.width,
    low_height: image.low_resolution.height,
    standard_url: image.standard_resolution.url,
    standard_width: image.standard_resolution.width,
    standard_height: image.standard_resolution.height,
    thumb_url: image.thumbnail.url,
    thumb_width: image.thumbnail.width,
    thumb_height: image.thumbnail.height,
  }).returning('id');

  /**
   * read - reads from db.
   * @type {Object}
   *   @method byId
   *     @params {Number} id
   *     @returns {Promise}
   *       @resolves {Array} - entries in the ig_users table which match the ID.
   */
  const read = {
    byId: (id) => knex('images').where({ id }).select(),
  };
  // 'delete' is a reserved keyword.
  const del = {
    byId: (id) => knex('images').where({ id }).del(),
  };

  return {
    create,
    read,
    del,
  };
};
