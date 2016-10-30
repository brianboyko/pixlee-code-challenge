'use strict';
import nodemailer from 'nodemailer';
import moment from 'moment';

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer
  .createTransport('smtps://whichlang.challenge%40gmail.com:whichlangchallenge@smtp.gmail.com');

const sendMail = (options) => new Promise(function(resolve, reject) {
  transporter.sendMail(options, (err, info) => {
    if(err){
      console.log("ERR", err);
      reject(err);
    } else {
      resolve(info);
    }
  });
});


const sendConfirmationEmail = (tagName, { startDate, endDate }, userEmail) => {
  let mailText = `Hello! We are sending this e-mail to let you know that we are ` +
    `currently processing your query for photos tagged with #${tagName} between ` +
    moment(startDate).format('Do MMMM YYYY, h:mm:ss a') + " and " +
    moment(endDate).format('Do MMMM YYYY, h:mm:ss a') + ". \n\n " +
    "This process may take some time, and we will e-mail you at this address " +
    "to let you know when your query has finished processing.";

  let mailOptions = {
    from: '"Pixlee-code-challenge" <whichlang.challenge@gmail.com>',
    to: userEmail,
    subject: `Confirmation of your query for #${tagName}`,
    text: mailText,
  };
  return sendMail(mailOptions);
};


const sendResultsEmail = (tagName, { startDate, endDate }, userEmail, queryId) => {
  let mailText = `Thanks for waiting! Your query for photos tagged with #${tagName} between ` +
    moment(startDate).format('Do MMMM YYYY, h:mm:ss a') + " and " +
    moment(endDate).format('Do MMMM YYYY, h:mm:ss a') + "has completed. \n\n " +
    `You can access the photos at ` + process.env.ROOT_URL + `/queryresults/${queryId}.`;

  let mailOptions = {
    from: '"Pixlee-code-challenge" <whichlang.challenge@gmail.com>',
    to: userEmail,
    subject: `Your query for #${tagName} has completed`,
    text: mailText,
  };

  return sendMail(mailOptions);
};


export default {
  sendConfirmationEmail,
  sendResultsEmail,
};
