import {
  validateInput,
  getSubscriptionItem,
} from '../../../../../backend/api/runtime/subscription';

describe('validateInput', () => {
  test('throws an error if formData is missing email', () => {
    expect(() => validateInput({})).toThrow('Missing required fields: email');
  });

  test('throws an error if email is invalid', () => {
    expect(() => validateInput({ email: 'invalid-email' })).toThrow(
      'Invalid email address',
    );
  });

  test('does not throw an error if email is valid', () => {
    expect(() => validateInput({ email: 'valid@example.com' })).not.toThrow();
  });
});

describe('subscriptionItem', () => {
  test('subscriptionItem returns an object with 3 keys', () => {
    const formData = {
      email: 'test@example.com',
    };
    const result = getSubscriptionItem(formData);
    expect(result).toEqual(
      expect.objectContaining({
        email: { S: formData.email },
        id: { S: expect.any(String) },
        subscription_date: { S: expect.any(String) },
      }),
    );
  });

  test('returns an object with email, id and subscription_date properties', () => {
    const formData = {
      email: 'johndoe@example.com',
    };
    const result = getSubscriptionItem(formData);
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('subscription_date');
  });
});

// describe('getResponseHandler', () => {
//   test('should return a response with 200 status code and success message', () => {
//     const expectedResponse = {
//       statusCode: 200,
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': 'https://www.playingaws.com',
//         'Access-Control-Allow-Credentials': false,
//       },
//       body: JSON.stringify({ message: 'Success' }),
//     };
//     const response = getResponseHandler();
//     expect(response).toEqual(expectedResponse);
//   });
// });
