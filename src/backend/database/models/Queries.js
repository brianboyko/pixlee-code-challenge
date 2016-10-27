// Tags model
import moment from 'moment';
import Tags from './Tags';

export default(knex) => {

  const tags = Tags(knex);

  const create = (tag_name, startDate, endDate, userEmail) => tags.getOrAdd(tag_name)
      .then(({ id }) => knex('queries')
        .insert({
          tag_id: id,
          earliest_date: moment.unix(parseInt(startDate)).toISOString(),
          latest_date: moment.unix(parseInt(endDate)).toISOString(),
          completed: false,
          user_email: userEmail,
          time_requested: moment(new Date()).toISOString(),
        })
        .returning('id'));


  const read = {
    byId: (id) => knex('queries').where({ id }).select(),
    byUserEmail: (email) => knex('queries').where({ user_email: email }).select(),
    byTagName: (tag_name) => tags.read.byName(tag_name)
      .then((records) => knex('queries').where({ tag_id: records[0].id }).select()),
    inProgress: () => knex('queries').where({ completed: false }),
    completed: () => knex('queries').where({ completed: true }),
  };

  const countInProgress = () => knex('queries').where({ completed: false }).count()
    .then((c) => parseInt(c));

  const complete = (id) =>
    knex('queries')
      .where({ id })
      .update({ completed: true, time_completed: moment(new Date()).toISOString() });


  return {
    create, read, complete, countInProgress
  };
};
