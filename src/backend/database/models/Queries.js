// Tags model
import Tags from './Tags';

export default(knex) => {

  const tags = Tags(knex);

  const create = (tag_name, startDate, endDate) => tags
    .getOrAdd(tag_name)
    .then(({id}) => knex('queries')
      .insert({
        tag_id: id,
        earliest_date: startDate,
        latest_date: endDate,
        completed: false,
      })
      .returning('id'));

  const read = {
    byId: (id) => knex('queries').where({id}).select(),
    byTagName: (tag_name) => tags.read.byName(tag_name)
      .then((records) => knex('queries').where({tag_id: records[0].id}).select()),
    inProgress: () => knex('queries').where({completed: false}),
    completed: () => knex('queries').where({completed: true}),
  }

  const complete = (id) => knex('queries').where({id}).update({completed: true});


  return {
    create, read, complete
  }
};
