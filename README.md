# pixlee-code-challenge

Code challenge for Pixlee, started 20 Oct. 2016.
License: https://creativecommons.org/licenses/by-nc-sa/4.0/

---

## Instructions for deployment/use.

Development:
* A PostgreSQL database at port 5432 with the following databases are required:
  * pixlee_test
  * pixlee_development
  * pixlee_production

Installation and launch:

Type "npm install" at the command prompt to get the required packages.
Type "npm run start" at the command prompt to set up the database, create the distribution package app.bundle.js, and run the server on localhost:3000 or on process.env.PORT;

#### Requirements:

Node & NPM
PostgreSQL database.

#### Required environmental variables:

process.env.NODE_ENV === 'production';
process.env.ROOT_URL === <the URL hosting the application>
process.env.DB_HOST === <the host address for the Postgresql database>
process.env.DB_USER === <the username for the pgdb>
process.env.DB_PASS === <the password for the pgdb>

## API:

* GET /api/getLatest/[tag name] - returns JSON for the last 20 entries with that tag from Instagram.
* POST /api/createcollection/ -
    takes: body: {
      tagName: @string <Name of the tag to be searched>
      startDate: @Number <integer representing earliest date in search (Date.now())>
      endDate: @Number <integer representing latest date in search (Date.now())>
    }
    Upon getting the post request, it will create a query and send back, via the standard "res" callback, data such as the query id, to be displayed on the front end. In the meantime, the query will kick off the process of downloading the required data from instagram. The user is notified when the query has completed via e-mail.
* get /api/getCollection/[query id] -
    Given the ID name of the query in the parameters, this will serve a webpage with the correct date for that query.  

---

Incomplete Features, in order of priority:



* Front End:
  * Front-end is barebones and needs design improvement.
  * Front-end requires unit testing with Enzyme.
  * Actions and reducers are in place to open and close a non-existent 'drawer' which would contain navigation details.  This code has been left in to facilitate further development, but is currently a no-op.
* Backend:
  * Build robust fault tolerance including error handling for when Instagram is unavailable or token has been exhausted.
  * The system should recover from the last point the collection occurred.  
  * Minimize the amount of API hits, and thus minimize the chance of hitting the rate limit on the Instagram token.
  * Ability to throttle requests to Instagram server (though throttling functionality has been partially built.)
  * Ability to browse the database by date or by tag.
  * Handle multiple parallel processing of many collection requests.  

Caveats:

* Due to the limitations of how the data is retrieved, it is inadvisable to use this for more than 1-2 days in the past for relatively popular queries (e.g., "cats", "bacon"), or more than 1 week for relatively unpopular queries(e.g., "yodeling", "snausages").

Completed features:
* ✓ Write readme document explaining the task as set out in the brief
* ✓ Write initial plan of attack, including stack choices and guides
* ✓ Get clarification for any unfamiliar phrasing.  
* ✓ Write backup plan for any unfamiliar technologies that the plan requires.
* ✓ Explain any differences between the suggested technological stack defined in the brief and technology choices.
* ✓ Set up directory structure, define testing tools, and clearly define aims.  
* ✓ Start Changelog.

* ✓ Application should take a hashtag, start-date, and end-date, and collect submissions from the Instagram API.
* ✓ Application should paginate through the endpoint and collect content whose tag time is between the start and end dates.
* ✓ The app should be available as a web service.
  * ✓ Backend: Provide an API that acceps a POST request to create a collection, and GET request to retrieve content.
  * ✓ Frontend: Create a web page that provides users with an interface to create collections and view them.  
* ✓ The data should then be stored in a permanent data store (Postgres recommended);

* Frontend:
  * ✓ Write a web visualization for the collected content in a js framework of your choice.
  * The user should be able to:
    * ✓ view the photos
    * ✓ view the Instagram username associated with those photos
    * ✓ navigate to the native Instagram link of the photo.
    * ✓ play videos.
    * ✓ Paginate or Load more to view further photos.

* Backend:
  * ✓ Elegantly handle the lack of an end-date or the end-date being in the future.

Submission guidelines:

* Code should be on github with a README.md (this document) with clear instructions on how to run the application.

* There should be a live example provided (recommendation: Heroku);

* Write up a summary explaining:
  * What you did.
  * Why you made some choices you made (what features did you add and why)
  * What you would improve next if you had more time, including what you believe to be the most important feature.  

---

## Tech Stack

* Language: ES6/Babel - Javascript.
  * JS is my strongest language.
  * ES6 also allows me to use the native "Promises" library, and with additional babel presets, also use the experimental async/await syntax.
  * The data from instagram is already in JSON format.
* Backend: Node.js
  * While Rails or Sinatra is perfectly fine here, truth is I've used Express more and am more familiar with it's quirks.  Additionally, keeping the entire application in one language (which happens to be my strongest) makes it a bit easier.
* API: Express.js
  * Express.js is the default choice, with testing via Postman, and database integration via the Knex.js library.
* Front End Server:
  * Express.js also works well to serve the front-end content as well.
* Bundling / Automation: Webpack
  * While less simple than Browserify/Gulp, Webpack's feature list is second to none, and React Hot Loader would allow me to spend less time waiting for refreshes.  
* Test Suite: Mocha/Chai
  * Chai's "chai-as-promised" library makes testing asynchronous code easy; Mocha's a solid tool for JS and can test both front and back-end components.
* Front-End: React/Redux/ReactRouter
  * My favorite framework - not as lightweight as, say, Mithryl or Vue, but I like how it works and I'm comfortable with it.  Redux seems to be the go-to for state managers as well.  ReactRouter makes sense for managing multiple pages.
* UI Library: Material-UI
  * While alternatives such as Grommet were considered, Grommet in particular was a bit too opinionated to be a quick install. Material-UI is probably the best bet.
* Mail: Nodemailer
* Deployment: Heroku
  * It's free, fast, and I've used it a lot.
* Database: Postgresql
  * I might be tempted to go with MongoDB here - not sure how relational our dataset is - but Postgresql is supported by Heroku, it's relatively easy to use, and it was requested in the brief.  

## Tech Decisions

One problem that I'm running into is that searching by tag and date range is a condition of the brief.  However, Instagram does not allow for searches by tag and date. Even professional applications have not been able to offer this feature.

There is one possibility for solving this problem: simply brute force it. That is, given a date and time, step back from the most recent photos *until we get the date range we're looking for.*  This could take hours, especially given the 500 api requests/hr limit of a sandbox account.  But hours is *not impossible.*

This is the approach I have attempted during this project.

* We require the user's email with the submission.
* We then step backwards from the most recent Instagram matches using the API's built-in pagination until we get a picture with a date earlier than the start date.
* We filter out all results that are after the end date or before the start date, and serve them to the user.

This is a much more involved approach to aim for in revisions:

* Upon getting a date/time/tag query, first search for results in the application's database.  
* If the appropriate tag is *not* in the database:
  * Estimate the amount of time it would take to get the information.
  * Get the user's email.
  * Run the query in the backend until we have the correct date time.
    * Save the date-time range, as well as the last "next_url" from pagination in the database, so that future queries can search from that point, instead of having to do the search all over again.  
    * Email the user and tell them that their query has completed, sending them a link.
* If the appropriate tag is in the database:
  * If we have the data for that date-time range, immediately serve that date/time range.
  * If we do not have the date for that date-time range:
    * If date/time range start is *earlier* than the earliest date we have*
      * Start querying the API *from the latest next_url* stored in the database.
    * if date/time range end is *later* than the latest date we have:
      * Start querying the API from the beginning, and stop querying when we either reach the target end time, or we start to overlap with items we have in the database.
    * This may leave gaps in our record, and they must be handled.
    * It is also possible that a date-time range is *later* than our latest query and *earlier* than our earliest query.  That needs to be handled.  
