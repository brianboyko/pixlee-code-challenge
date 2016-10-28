import nodemailer from 'nodemailer';
import moment from 'moment';

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer
  .createTransport('smtps://whichlang.challenge%40gmail.com:whichlangchallenge@smtp.gmail.com');

const sendConfirmationEmail = (tagName, startDate, endDate, userEmail) => new Promise(function(resolve, reject) {
  let mailText = `Hello! We are sending this e-mail to let you know that we are ` +
    `currently processing your query for photos tagged with #${tagName} between ` +
    moment.unix(startDate).format('Do MMMM YYYY, h:mm:ss a') + " and " +
    moment.unix(endDate).format('Do MMMM YYYY, h:mm:ss a') + ". \n\n " +
    "This process may take some time, and we will e-mail you at this address " +
    "to let you know when your query has finished processing.";

  let mailOptions = {
    from: '"Pixlee-code-challenge" <whichlang.challenge@gmail.com>',
    to: userEmail,
    subject: `Confirmation of your query for #${tagName}`,
    text: mailText,
  };

  console.log("sending mail");

  transporter.sendMail(mailOptions, (err, info) => {
    if(err){
      console.log("ERR", err);
      reject(err);
    } else {
      console.log(info);
      resolve(info);
    }
    console.log(`Message set: ${info.response}`);
  });

})


const sendResultsEmail = (tagName, startDate, endDate, userEmail, queryId) => {
  let mailText = `Thanks for waiting! Your query for photos tagged with #${tagName} between ` +
    moment.unix(startDate).format('Do MMMM YYYY, h:mm:ss a') + " and " +
    moment.unix(endDate).format('Do MMMM YYYY, h:mm:ss a') + "has completed. \n\n " +
    `You can access the photos at http://${process.env.ROOT_URL}/queryresults/${queryId}.`;

  let mailOptions = {
    from: '"Pixlee-code-challenge" <whichlang.challenge@gmail.com>',
    to: userEmail,
    subject: `Your query for #${tagName} has completed`,
    text: mailText,
  };

  trapsorter.sendMail(mailOptions, (err, info) => {
    if(err){
      return console.log(err);
    }
    console.log(`Message set: ${info.response}`);
  });

};

export default {
  sendConfirmationEmail,
  sendResultsEmail,
};
