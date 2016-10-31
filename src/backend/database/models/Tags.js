'use strict';
// Tags model

/**
 * Tags - Model for 'tags" table; '
 * @param  {object} knex - database connection
 * @return {object}
 *   @method {function} create
 *   @method {function} read
 *   @method {function} del
 *   @method {function} getOrAdd
 */
export default (knex) => {

  /**
   * create - creates an entry.
   * @param  {string} tag_name - the tag name.
   * @return {Promise}
   *   @resolves {Array Singleton w/ Number} - ID of entry in DB.
   */
  const create = (tag_name) => knex('tags').insert({ tag_name })
    .returning('id');

  // reads from the database
  const read = {
    byName: (tag_name) => knex('tags').where({ tag_name }).select(),
    byId: (id) => knex('tags').where({ id }).select(),
  };

  // deletes from the database.
  const del = {
    byName: (tag_name) => knex('tags').where({ tag_name }).del(),
    byId: (id) => knex('tags').where({ id }).del(),
  };

  /**
   * getOrAdd gets the ID of an entry,
   *   or if it doesn't exist, creates one and returns the ID.
   * @param  {string} tag_name
   * @return {Promise}
   *   @resolves {object}
   *   @property {Number} id - ID of the tag in DB;
   *   @property {string} tag_name - name of the tag.
   */
  const getOrAdd = (tag_name) => new Promise(function(resolve, reject) {
    read.byName(tag_name).then((record) => {
      if(record.length > 0){
        resolve(record[0]);
      } else {
        create(tag_name).then((id) => {
          resolve({ id: id[0], tag_name: tag_name });
        });
      }
    });
  });

  return {
    create,
    read,
    del,
    getOrAdd,
  };
};
