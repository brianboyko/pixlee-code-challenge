# pixlee-code-challenge

Code challenge for Pixlee, started 20 Oct. 2016.

---

## Instructions for deployment/use.

(To be determined)

---

## Planned deadlines:

##### Pre-production: Evening of 21 Oct. 2016 (Friday):

* Write readme document explaining the task as set out in the brief
* Write initial plan of attack, including stack choices and guides
* Get clarification for any unfamiliar phrasing.  
* Write backup plan for any unfamiliar technologies that the plan requires.
  * i.e.: This looks like it might be a job for Docker, but I've yet to use it. If Docker takes too much time to learn/configure and I start slipping past schedule, I should have a default backup plan.
* Explain any differences between the suggested technological stack defined in the brief and technology choices.
* Set up directory structure, define testing tools, and clearly define aims.  
* Start Changelog.

##### Console-based MVP: Evening of 22 October 2016: (Saturday):

* Application should take a hashtag, start-date, and end-date, and collect submissions from the Instagram API.
* Application should paginate(?) through the endpoint and collect content whose tag time is between the start and end dates.
  * **Question:** Paginate, as a verb, seems strange to use in this context. I'm assuming that it simply means that the application should, if needed, make multiple connections to get all the data.
* The photo's "tag time" is defined as the time the hashtag was tagged with the photo, OR the time the submitter of the comment posts a comment on the photo with the desired hashtag.  
* If the caption does not contain the desired hashtag, but the submitter of the photo posts a comment with the desired hashtag afterwards, the photo will be included in the pagination.
  * **Question:** I'm not sure what the pagination refers to here. It could be interpreted two ways: that Instagram's API will automatically add photos who have been tagged in the comments, or that the application should also be sure to include photos whose have been tagged in the comments, even if that means making a second request.  
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
