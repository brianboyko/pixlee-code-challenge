# pixlee-code-challenge

Code challenge for Pixlee, started 20 Oct. 2016.

---

## Instructions for deployment/use.

(To be determined)

---

## Planned deadlines:

##### Pre-production: Evening of 21 Oct. 2016 (Friday):

* ✓ Write readme document explaining the task as set out in the brief
* ✓ Write initial plan of attack, including stack choices and guides
* ✓ Get clarification for any unfamiliar phrasing.  
* ✓ Write backup plan for any unfamiliar technologies that the plan requires.
* ✓ Explain any differences between the suggested technological stack defined in the brief and technology choices.
* ✓ Set up directory structure, define testing tools, and clearly define aims.  
* ✓ Start Changelog.

##### Console-based MVP: Evening of 22 October 2016: (Saturday):

* ✓ Application should take a hashtag, start-date, and end-date, and collect submissions from the Instagram API.
* ✓ Application should paginate(?) through the endpoint and collect content whose tag time is between the start and end dates.
* The photo's "tag time" is defined as the time the hashtag was tagged with the photo, OR the time the submitter of the comment posts a comment on the photo with the desired hashtag.  
* If the caption does not contain the desired hashtag, but the submitter of the photo posts a comment with the desired hashtag afterwards, the photo will be included in the pagination. 
* The app should be available as a web service.
  * Backend: Provide an API that acceps a POST request to create a collection, and GET request to retrieve content.
  * Frontend: Create a web page that provides users with an interface to create collections and view them.  
* The data should then be stored in a permanent data store (Postgres recommended);
  * **Question:** I'm not sure which data is to be stored here: Is it the results of the queries, the queries themselves, etc. Should the service store only the URLs of photo references or download and store the photos themselves (perhaps in an Amazon S3 bucket)?
* The data is stored at the discretion of the applicant (but the tag time should be included).
  * **Question:** Not sure how to interpret this - essentially you're saying that it should be the end user, not the application, that determines whether or not the results should be stored, or that the end-user should determine what data fields should be included?
  * **Answer:** I just realized that *I'm* the applicant, and it is *my* discretion referred to here.

##### Pencils Down: Start of Business, 10am EST, 24 October 2016: (Monday):

Continue to add features until a feature-freeze on the morning of Monday, 24 October.:

*Choose one to focus on before attempting the other.*

* Frontend:
  * write a web visualization for the collected content in a js framework of your choice.
  * The user should be able to:
    * view the photos
    * view the Instagram username associated with those photos
    * navigate to the native Instagram link of the photo.
    * play videos.
    * Paginate or Load more to view further photos.

* Backend:
  * Build robust fault tolerance.
  * The system should recover from the last point the collection occurred.  
  * Minimize the amount of API hits, and thus minimize the chance of hitting the rate limit on the Instagram token.
  * Handle multiple parallel processing of many collection requests.  
  * Elegantly handle the lack of an end-date or the end-date being in the future.

Submission guidelines:

* Code should be on github with a README.md (this document) with clear instructions on how to run the application.

* There should be a live example provided (recommendation: Heroku);

* Write up a summary explaining:
  * What you did.
  * Why you made some choices you made (what features did you add and why)
  * What you would improve next if you had more time, including what you believe to be the most important feature.  

##### Post-production:

Having created a deadline freeze branch, continue working on the project resolving technical debt to continue use in a portfolio and/or training tool for student engineers.

## Minimum Viable Product Specifications:

* Backend: Provide an API that acceps a POST request to create a collection, and GET request to retrieve content.

* Frontend: Create a web page that provides users with an interface to create collections and view them.  

* Data should be stored in a permanent data store, at the discretion of the applicant.

---

## Tech Stack & Decisions (initial)

* Language: ES6/Babel - Javascript.
  * JS is my strongest language.
  * ES6 also allows me to use the native "Promises" library, and with additional babel presets, also use the experimental async/await syntax.
* Backend: Node.js
  * While Rails or Sinatra is perfectly fine here, truth is I've used Express more and am more familiar with it's quirks.  Additionally, keeping the entire application in one language (which happens to be my strongest) makes it a bit easier.
* API: Express.js
  * Express.js is the default choice, with testing via Postman, and database integration via the Knex.js library.
* Front End Server:
  * Express.js also works well to serve the front-end content as well.
* Bundling / Automation: Webpack
  * While less simple than Browserify/Gulp, Webpack's feature list is second to none, and React Hot Loader would allow me to spend less time waiting for refreshes.  
* Test Suite: Mocha/Chai/Enzyme
  * Chai's "chai-as-promised" library makes testing asynchronous code easy; Mocha's a solid tool for JS and can test both front and back-end components. Enzyme works great for React components
* Front-End: React/Redux/ReactRouter
  * My favorite framework - not as lightweight as, say, Mithryl or Vue, but I like how it works and I'm comfortable with it.  Redux seems to be the go-to for state managers as well.  ReactRouter makes sense for managing multiple pages.
* UI Library: Grommet
  * Grommet has a lot of out-of-the-box components that work well together and many of these components are image-based.  
* Deployment: Heroku
  * It's free, fast, and I've used it a lot.
* Database: Postgresql
  * I might be tempted to go with MongoDB here - not sure how relational our dataset is - but Postgresql is supported by Heroku, it's relatively easy to use, and it was requested in the brief.  

## Tech Stack & Decisions (Followup, 21 Oct 2016)

One problem that I'm running into is that searching by tag and date range is a condition of the brief.  However, Instagram does not allow for searches by tag and date. Even professional applications have not been able to offer this feature.

There is one possibility for solving this problem: simply brute force it. That is, given a date and time, step back from the most recent photos *until we get the date range we're looking for.*  This could take hours, especially given the 500 api requests/hr limit of a sandbox account.  But hours is *not impossible.*

Here's one approach:

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

Needless to say, this can present a lot of problems, especially with the 500 request/hr limit on sandbox token accounts with Instagram.  Throttling will almost certainly be needed.

This will be tricky.
