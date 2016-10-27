import knex from '../db';

import Tags from '../models/Tags';
import Queries from '../models/Queries';
import Interface from '../instagram/Interface';

const tags = Tags(knex);
const queries = Queries(knex);
const { getPhotosInDateRange } = Interface;

// the statefulCallback is a callback function that
// allows for communication along the entire process.
// essentially, it can be called multiple times, and
// depending on the parameter, execute different functions.
// much like Flux Dispatch.



const query = (tagName, { startDate, endDate }, dispatcher) => new Promise(function(resolve, reject) {
  tags.getOrAdd(tag_name)
    .then((data) => queries.read.byID(data.id))
    .then((records) => {
      if(!records.length){
        dispatcher({
          type: "NO_RECORDS_FOUND",
          message: `We don't have any queries associated with ${tagName}, however, we will create a new query for you.`,
        });
        queries.create(tagName, startDate, endDate)
          .then((ids) => ids[0])
          .then((id) => {
            dispatch({
              type: "STARTING_QUERY",
              queryID: id,
              message: `We are starting a query for your request. Please be advised that this may take anywhere from a few minutes to a few hours. We will send you an e-mail when the query completes.`
            })
           return queries.read.inProgress()
              .then()
            getPhotosInDateRange(tagName, startDate, endDate)
              .then()
      }
    })
});
