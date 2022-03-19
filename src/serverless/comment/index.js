/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const TABLE_COMMENTS = process.env.TABLE_COMMENTS;

exports.handler = async (event, err) => {
  try {
    let formData = JSON.parse(event.body);
    let date = new Date().toISOString();

    let titleChar = formData.title.split('/posts/');
    let title = titleChar[1].replace('/', '');

    let params = {
      TableName: TABLE_COMMENTS,
      Item: {
        nick: formData.nick,
        title: title,
        comment: formData.comment,
        date: date,
      },
    };

    await docClient.put(params).promise();

    let response = {
      //statusCode: err ? 500 : 201,
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
