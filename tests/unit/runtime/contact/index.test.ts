import {
  validateInput,
  getContactItem,
  getEmailMessageItem,
  getResponseHandler,
} from '../../../../backend/api/runtime/contact';

const mockFormData = {
  name: 'John Doe',
  reply_to: 'johndoe@example.com',
  message: 'Hello, world!',
};

// Test for valid form data
describe('validateInput', () => {
  test('throws error if name is not provided', () => {
    expect(() => {
      validateInput({
        reply_to: 'test@example.com',
        message: 'test message',
      });
    }).toThrowError('Name is required');
  });

  test('throws error if reply_to is not provided', () => {
    expect(() => {
      validateInput({ name: 'Test', message: 'test message' });
    }).toThrowError('Email is required');
  });

  test('throws an error if email is invalid', () => {
    expect(() =>
      validateInput({
        name: 'Test',
        reply_to: 'invalid-email',
        message: 'test message',
      }),
    ).toThrow('Invalid email address');
  });

  test('throws error if message is not provided', () => {
    expect(() => {
      validateInput({ name: 'Test', reply_to: 'test@example.com' });
    }).toThrowError('Message is required');
  });

  test('does not throw error if form data is valid', () => {
    expect(() => {
      validateInput(mockFormData);
    }).not.toThrowError();
  });
});

describe('contactItem', () => {
  const formData = {
    name: 'test',
    reply_to: 'test@example.com',
    message: 'test message',
  };

  test('contactItem returns an object with 4 keys', () => {
    const result = getContactItem(formData);
    expect(result).toEqual(
      expect.objectContaining({
        name: { S: formData.name },
        date: { S: expect.any(String) },
        mail: { S: formData.reply_to },
        message: { S: formData.message },
      }),
    );
  });

  test('returns an object with name, date, mail and message properties', () => {
    const result = getContactItem(formData);
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('mail');
    expect(result).toHaveProperty('message');
  });
});

describe('getEmailMessageItem', () => {
  test('returns an email message item with correct properties', () => {
    const type = 'contact';
    const result = getEmailMessageItem(mockFormData, type);
    // expect(result).toHaveProperty('Source', process.env.EMAIL);
    expect(result).toHaveProperty('ReplyToAddresses', [mockFormData.reply_to]);
    // expect(result).toHaveProperty('Destination.ToAddresses', [
    //   process.env.EMAIL,
    // ]);
    expect(result).toHaveProperty(
      'Message.Body.Text.Data',
      `Name: ${mockFormData.name}\nEmail: ${mockFormData.reply_to}\nMessage: ${mockFormData.message}`,
    );
    expect(result).toHaveProperty(
      'Message.Subject.Data',
      `BLOG message: New ${type} message from my web playingaws`,
    );
  });
});

describe('getResponseHandler', () => {
  test('should return a response with 200 status code and success message', () => {
    const expectedResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://www.playingaws.com',
        'Access-Control-Allow-Credentials': false,
      },
      body: JSON.stringify({ message: 'Success' }),
    };
    const response = getResponseHandler();
    expect(response).toEqual(expectedResponse);
  });
});
