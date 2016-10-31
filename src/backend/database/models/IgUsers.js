'use strict';
// ig_users model

/**
 * IgUsers - Model for 'ig_users" table; '
 * @param  {object} knex - database connection
 * @return {object}
 *   @method {function} create
 *   @method {function} read
 *   @method {function} del
 */
export default (knex) => {

  /**
   * create - creates an entry.
   * @param  {object} user - information about the user from Instagram's API.
   * @return {Promise}
   *   @resolves {Array Singleton w/ Number} - ID of entry in DB.
   */
  const create = (user) =>  knex('ig_users').insert({
      ig_user_id: parseInt(user.id),
      ig_username: user.username,
      ig_profilepic: user.profile_picture,
      ig_fullname: user.full_name,
    }).returning('id');


  /**
   * read - reads from db.
   * @type {Object}
   *   @method byUsername
   *     @params {string} username
   *     @returns {Promise}
   *       @resolves {Array} - entries in the ig_users table where the username equals the parameter.
   *   @method byId
   *     @params {Number} id
   *     @returns {Promise}
   *       @resolves {Array} - entries in the ig_users table which match the ID.
   */
  const read = {
    byUsername: (username) => knex('ig_users').where({ ig_username: username }).select(),
    byId: (id) => knex('ig_users').where({ id }).select(),
  };

  /**
   * del
   * as with read above, only instead of returning a promise that resolves to an Array
   * it deletes it from the database.
   * N.B.: 'delete' is a reserved keyword.
   */
  const del = {
    byUsername: (username) => knex('ig_users').where({ ig_username: username }).del(),
    byId: (id) => knex('ig_users').where({ id }).del(),
  };

  return {
    create,
    read,
    del,
  };
};
