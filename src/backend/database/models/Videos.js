'use strict';
// videos model

/**
 * IgUsers - Model for 'videos' table
 * @param  {object} knex - database connection
 * @return {object}
 *   @method {function} create
 *   @method {function} read
 *   @method {function} del
 */
export default (knex) => {
  const create = (video) => knex('videos').insert({
    low_res: video.low_resolution.url,
    standard_res: video.standard_resolution.url,
    low_band: video.low_bandwidth.url,
  }).returning('id');

  const read = {
    byId: (id) => knex('videos').where({ id }).select(),
  };
  // 'delete' is a reserved keyword.
  const del = {
    byId: (id) => knex('videos').where({ id }).del(),
  };

  return {
    create,
    read,
    del,
  };
};
