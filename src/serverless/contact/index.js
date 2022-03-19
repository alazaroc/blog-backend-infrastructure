/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const AWS = require('aws-sdk');
const SES = new AWS.SES();

const EMAIL = process.env.EMAIL;

function sendEmail(formData, callback) {
  const emailParams = {
    Source: EMAIL, // SES SENDING EMAIL
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: [EMAIL], // SES RECEIVING EMAIL
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Name: ${formData.name}\nEmail: ${formData.reply_to}\nMessage: ${formData.message}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New contact message from playingaws.com',
      },
    },
  };

  SES.sendEmail(emailParams, callback);
}

exports.handler = (event, context, callback) => {
  const formData = JSON.parse(event.body);

  sendEmail(formData, function (err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Content-Type': 'application/json',
        // Only will be used by MY DOMAIN
        'Access-Control-Allow-Origin': 'https://www.playingaws.com', // Required for CORS support to work
        'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };
    console.log(response);
    callback(null, response);
  });
};
