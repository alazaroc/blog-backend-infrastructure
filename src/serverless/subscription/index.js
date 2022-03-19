/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const AWS = require('aws-sdk');
const crypto = require('crypto');
const docClient = new AWS.DynamoDB.DocumentClient();

const TABLE_SUBSCRIPTIONS = process.env.TABLE_SUBSCRIPTIONS;

exports.handler = async (event, err) => {
  try {
    let formData = JSON.parse(event.body);
    let date = new Date().toISOString();

    let params = {
      TableName: TABLE_SUBSCRIPTIONS,
      Item: {
        email: formData.email,
        id: crypto.randomUUID(),
        subscription_date: date,
      },
    };

    await docClient.put(params).promise();

    let response = {
      //statusCode: err ? 500 : 200,
      statusCode: 200,
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
    console.log('response', JSON.stringify(response));
    return response;
  } catch (err) {
    console.log('error', err);
    return { error: err.message };
  }
};
