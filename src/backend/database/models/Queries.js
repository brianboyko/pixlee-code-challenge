'use strict';
// Tags model
import moment from 'moment';
import Tags from './Tags';

/**
 * Queries - Model for 'queries" table; '
 * @param  {object} knex - database connection
 * @return {object}
 *   @method {function} create
 *   @method {function} read
 *   @method {function} completed
 *   @method {function} countInProgress
 */
export default(knex) => {

  const tags = Tags(knex);

  /**
   * create - creates a query
   * @param  {string} tagName   - name of the hashtag.
   * @param  {Number/Date.now()} startDate
   * @param  {Number/Date.now()} endDate
   * @param  {string} userEmail
   * @return {Promise}
   *   @resolves {Number} - ID number in 'queries' table.
   */
  const create = (tagName, { startDate, endDate }, userEmail) => {
    return tags.getOrAdd(tagName)
      .then(({ id }) => {
        let insertable = {
          tag_id: id,
          earliest_date: moment(startDate).toISOString(),
          latest_date: moment(endDate).toISOString(),
          completed: false,
          user_email: userEmail,
          time_requested: moment(new Date()).toISOString(),
        };
        return knex('queries')
          .insert(insertable)
          .returning('id');
        });
  };


  // methods to read from DB.
  const read = {
    byId: (id) => knex('queries').where({ id }).select(),
    byUserEmail: (email) => knex('queries').where({ user_email: email }).select(),
    byTagName: (tag_name) => tags.read.byName(tag_name)
      .then((records) => knex('queries').where({ tag_id: records[0].id }).select()),
    inProgress: () => knex('queries').where({ completed: false }),
    completed: () => knex('queries').where({ completed: true }),
  };

  // counts the number of unresolved queries
  const countInProgress = () => new Promise(function(resolve, reject) {
    knex('queries').where({ completed: false }).count()
      .then((count) => resolve(count))
    });

  // updates a query to notify that it has been completed.
  const complete = (id) => {
    let updatedata = { completed: true, time_completed: moment(new Date()).toISOString() }
    return knex('queries')
      .where({ id: id })
      .update(updatedata);
  }


  return {
    create, read, complete, countInProgress
  };
};
