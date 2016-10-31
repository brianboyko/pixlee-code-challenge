'use strict';
// models for intermediate tables: queries_media and media_tags

/**
 * makeIntermediate - a model generator for those little tables with basic CRD functionality.
 * @param  {string} tableName - name of the table
 * @return {function}         - a model
 *   @params {object}         - knex: the database function
 *   @return {object} - Create, Read, Delete methods.
 */
const makeIntermediate = (tableName) => (knex) => {
  const create = (obj) => knex(tableName).insert(obj).returning('id');
  const read = {
    byId: (id) => knex(tableName).where({ id }).select(),
    by: (selectorObj) => knex(tableName).where(selectorObj).select(),
  };
  const del = (id) => knex(tableName).where({ id }).del();
  return { create, read, del };
};

export const QueriesMedia = makeIntermediate('queries_media');
export const MediaTags = makeIntermediate('media_tags');
