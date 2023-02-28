/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const dbClient = process.env.AWS_SAM_LOCAL
  ? new DynamoDBClient({
      endpoint: 'http://docker.for.mac.localhost:8000/',
    })
  : new DynamoDBClient();
const ses = new SESClient();

const EMAIL = process.env.EMAIL;
const TABLE_CONTACT = process.env.TABLE_CONTACT;

////////////////////////////////
// Tested methods
////////////////////////////////

function validateInput(formData) {
  if (!formData.name) {
    throw new Error('Name is required');
  }
  if (!formData.reply_to) {
    throw new Error('Email is required');
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(formData.reply_to)) {
    throw new Error('Invalid email address');
  }
  if (!formData.message) {
    throw new Error('Message is required');
  }
}

function getContactItem(formData) {
  return {
    name: { S: formData.name },
    date: { S: new Date().toISOString() },
    mail: { S: formData.reply_to },
    message: { S: formData.message },
  };
}

function getEmailMessageItem(formData, type) {
  return {
    Source: EMAIL,
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: [EMAIL],
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
        Data: `BLOG message: New ${type} message from my web playingaws`,
      },
    },
  };
}

// TODO: duplicated method in other lambda
function getResponseHandler() {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      // Only will be used by MY DOMAIN
      'Access-Control-Allow-Origin': 'https://www.playingaws.com',
      'Access-Control-Allow-Credentials': false, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({ message: 'Success' }),
  };
}

////////////////////////////////
// AWS methods (without tests)
////////////////////////////////

// TODO: duplicated method in other lambda
async function addContactToDB(formData) {
  console.log('table: ' + TABLE_CONTACT);
  let params = {
    TableName: TABLE_CONTACT,
    Item: getContactItem(formData),
  };
  await dbClient.send(new PutItemCommand(params));
}

async function sendEmailUsingSES(formData) {
  const emailParams = getEmailMessageItem(formData, 'contact');
  try {
    let sendCommand = new SendEmailCommand(emailParams);
    await ses.send(sendCommand);
  } catch (err) {
    console.error(err);
  }
}

handler = async (event) => {
  console.log('request: ', event.body);
  try {
    let formData = JSON.parse(event.body);
    validateInput(formData);
    await addContactToDB(formData);
    await sendEmailUsingSES(formData);
    return getResponseHandler();
  } catch (err) {
    console.log('error', err);
    return { statusCode: 400, body: JSON.stringify({ message: err.message }) };
  }
};

////////////////////////////////
// Exports to be able to test it
////////////////////////////////

module.exports = {
  handler,
  validateInput,
  getContactItem,
  getEmailMessageItem,
  getResponseHandler,
};
