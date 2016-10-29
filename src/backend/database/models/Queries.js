// Tags model
import moment from 'moment';
import Tags from './Tags';

export default(knex) => {

  const tags = Tags(knex);

  const create = (tagName, { startDate, endDate }, userEmail) => {
    console.log("inside creates in the model")

    console.log("tagName", tagName);
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    console.log("getting here")
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
        console.log("insertable", insertable)
        return knex('queries')
          .insert(insertable)
          .returning('id');
        });
  };



  const read = {
    byId: (id) => knex('queries').where({ id }).select(),
    byUserEmail: (email) => knex('queries').where({ user_email: email }).select(),
    byTagName: (tag_name) => tags.read.byName(tag_name)
      .then((records) => knex('queries').where({ tag_id: records[0].id }).select()),
    inProgress: () => knex('queries').where({ completed: false }),
    completed: () => knex('queries').where({ completed: true }),
  };

  const countInProgress = () => new Promise(function(resolve, reject) {
    knex('queries').where({ completed: false }).count()
      .then((count) => resolve(count))
    });

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
