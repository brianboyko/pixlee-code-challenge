// Tags model

const makeIntermediate = (tableName) => (knex) => {
  const create = (obj) => knex(tableName).insert(obj).returning('id');
  const read = {
    byId: (id) => knex(tableName).where({id}).select(),
    by: (selectorObj) => knex(tableName).where(selectorObj).select(),
  }
  const del = (id) => knex(tableName).where({id}).del();
  return { create, read, del }
}

export const QueriesMedia = makeIntermediate('queries_media')
export const MediaTags = makeIntermediate('media_tags')
