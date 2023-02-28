/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const crypto = require('crypto');
const dbClient = process.env.AWS_SAM_LOCAL
  ? new DynamoDBClient({
      endpoint: 'http://host.docker.internal:8000',
    })
  : new DynamoDBClient();

const TABLE_SUBSCRIPTIONS = process.env.TABLE_SUBSCRIPTIONS;

////////////////////////////////
// Tested methods
////////////////////////////////

function validateInput(formData) {
  if (!formData || !formData.email) {
    throw new Error('Missing required fields: email');
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(formData.email)) {
    throw new Error('Invalid email address');
  }
}

function getSubscriptionItem(formData) {
  return {
    email: { S: formData.email },
    id: { S: crypto.randomUUID() },
    subscription_date: { S: new Date().toISOString() },
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
async function addSubscriptionToDB(formData) {
  console.log('table: ' + TABLE_SUBSCRIPTIONS);
  const params = {
    TableName: TABLE_SUBSCRIPTIONS,
    Item: getSubscriptionItem(formData),
  };
  return dbClient.send(new PutItemCommand(params));
}

handler = async (event) => {
  try {
    const formData = JSON.parse(event.body);
    validateInput(formData);
    await addSubscriptionToDB(formData);
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
  getSubscriptionItem,
  getResponseHandler,
};
