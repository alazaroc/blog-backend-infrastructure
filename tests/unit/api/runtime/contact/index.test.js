"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_1 = require("../../../../../backend/api/runtime/contact");
const mockFormData = {
    name: 'John Doe',
    reply_to: 'johndoe@example.com',
    message: 'Hello, world!',
};
// Test for valid form data
describe('validateInput', () => {
    test('throws error if name is not provided', () => {
        expect(() => {
            (0, contact_1.validateInput)({
                reply_to: 'test@example.com',
                message: 'test message',
            });
        }).toThrow('Name is required');
    });
    test('throws error if reply_to is not provided', () => {
        expect(() => {
            (0, contact_1.validateInput)({ name: 'Test', message: 'test message' });
        }).toThrow('Email is required');
    });
    test('throws an error if email is invalid', () => {
        expect(() => (0, contact_1.validateInput)({
            name: 'Test',
            reply_to: 'invalid-email',
            message: 'test message',
        })).toThrow('Invalid email address');
    });
    test('throws error if message is not provided', () => {
        expect(() => {
            (0, contact_1.validateInput)({ name: 'Test', reply_to: 'test@example.com' });
        }).toThrow('Message is required');
    });
    test('does not throw error if form data is valid', () => {
        expect(() => {
            (0, contact_1.validateInput)(mockFormData);
        }).not.toThrow();
    });
});
describe('contactItem', () => {
    const formData = {
        name: 'test',
        reply_to: 'test@example.com',
        message: 'test message',
    };
    test('contactItem returns an object with 4 keys', () => {
        const result = (0, contact_1.getContactItem)(formData);
        expect(result).toEqual(expect.objectContaining({
            name: { S: formData.name },
            date: { S: expect.any(String) },
            mail: { S: formData.reply_to },
            message: { S: formData.message },
        }));
    });
    test('returns an object with name, date, mail and message properties', () => {
        const result = (0, contact_1.getContactItem)(formData);
        expect(result).toHaveProperty('name');
        expect(result).toHaveProperty('date');
        expect(result).toHaveProperty('mail');
        expect(result).toHaveProperty('message');
    });
});
describe('getEmailMessageItem', () => {
    test('returns an email message item with correct properties', () => {
        const type = 'contact';
        const result = (0, contact_1.getEmailMessageItem)(mockFormData, type);
        // expect(result).toHaveProperty('Source', process.env.EMAIL);
        expect(result).toHaveProperty('ReplyToAddresses', [mockFormData.reply_to]);
        // expect(result).toHaveProperty('Destination.ToAddresses', [
        //   process.env.EMAIL,
        // ]);
        expect(result).toHaveProperty('Message.Body.Text.Data', `Name: ${mockFormData.name}\nEmail: ${mockFormData.reply_to}\nMessage: ${mockFormData.message}`);
        expect(result).toHaveProperty('Message.Subject.Data', `BLOG message: New ${type} message from my web playingaws`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3RUFJb0Q7QUFFcEQsTUFBTSxZQUFZLEdBQUc7SUFDbkIsSUFBSSxFQUFFLFVBQVU7SUFDaEIsUUFBUSxFQUFFLHFCQUFxQjtJQUMvQixPQUFPLEVBQUUsZUFBZTtDQUN6QixDQUFDO0FBRUYsMkJBQTJCO0FBQzNCLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBQzdCLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDaEQsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUEsdUJBQWEsRUFBQztnQkFDWixRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixPQUFPLEVBQUUsY0FBYzthQUN4QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDcEQsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUEsdUJBQWEsRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQy9DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FDVixJQUFBLHVCQUFhLEVBQUM7WUFDWixJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLE9BQU8sRUFBRSxjQUFjO1NBQ3hCLENBQUMsQ0FDSCxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lB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LENBQzNELENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgseUNBQXlDO0FBQ3pDLHNGQUFzRjtBQUN0RixpQ0FBaUM7QUFDakMseUJBQXlCO0FBQ3pCLG1CQUFtQjtBQUNuQiw4Q0FBOEM7QUFDOUMsdUVBQXVFO0FBQ3ZFLHFEQUFxRDtBQUNyRCxXQUFXO0FBQ1gsc0RBQXNEO0FBQ3RELFNBQVM7QUFDVCw2Q0FBNkM7QUFDN0Msa0RBQWtEO0FBQ2xELFFBQVE7QUFDUixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgdmFsaWRhdGVJbnB1dCxcbiAgZ2V0Q29udGFjdEl0ZW0sXG4gIGdldEVtYWlsTWVzc2FnZUl0ZW0sXG59IGZyb20gJy4uLy4uLy4uLy4uLy4uL2JhY2tlbmQvYXBpL3J1bnRpbWUvY29udGFjdCc7XG5cbmNvbnN0IG1vY2tGb3JtRGF0YSA9IHtcbiAgbmFtZTogJ0pvaG4gRG9lJyxcbiAgcmVwbHlfdG86ICdqb2huZG9lQGV4YW1wbGUuY29tJyxcbiAgbWVzc2FnZTogJ0hlbGxvLCB3b3JsZCEnLFxufTtcblxuLy8gVGVzdCBmb3IgdmFsaWQgZm9ybSBkYXRhXG5kZXNjcmliZSgndmFsaWRhdGVJbnB1dCcsICgpID0+IHtcbiAgdGVzdCgndGhyb3dzIGVycm9yIGlmIG5hbWUgaXMgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICB2YWxpZGF0ZUlucHV0KHtcbiAgICAgICAgcmVwbHlfdG86ICd0ZXN0QGV4YW1wbGUuY29tJyxcbiAgICAgICAgbWVzc2FnZTogJ3Rlc3QgbWVzc2FnZScsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCdOYW1lIGlzIHJlcXVpcmVkJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBlcnJvciBpZiByZXBseV90byBpcyBub3QgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHZhbGlkYXRlSW5wdXQoeyBuYW1lOiAnVGVzdCcsIG1lc3NhZ2U6ICd0ZXN0IG1lc3NhZ2UnIH0pO1xuICAgIH0pLnRvVGhyb3coJ0VtYWlsIGlzIHJlcXVpcmVkJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBhbiBlcnJvciBpZiBlbWFpbCBpcyBpbnZhbGlkJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PlxuICAgICAgdmFsaWRhdGVJbnB1dCh7XG4gICAgICAgIG5hbWU6ICdUZXN0JyxcbiAgICAgICAgcmVwbHlfdG86ICdpbnZhbGlkLWVtYWlsJyxcbiAgICAgICAgbWVzc2FnZTogJ3Rlc3QgbWVzc2FnZScsXG4gICAgICB9KSxcbiAgICApLnRvVGhyb3coJ0ludmFsaWQgZW1haWwgYWRkcmVzcycpO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgZXJyb3IgaWYgbWVzc2FnZSBpcyBub3QgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHZhbGlkYXRlSW5wdXQoeyBuYW1lOiAnVGVzdCcsIHJlcGx5X3RvOiAndGVzdEBleGFtcGxlLmNvbScgfSk7XG4gICAgfSkudG9UaHJvdygnTWVzc2FnZSBpcyByZXF1aXJlZCcpO1xuICB9KTtcblxuICB0ZXN0KCdkb2VzIG5vdCB0aHJvdyBlcnJvciBpZiBmb3JtIGRhdGEgaXMgdmFsaWQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHZhbGlkYXRlSW5wdXQobW9ja0Zvcm1EYXRhKTtcbiAgICB9KS5ub3QudG9UaHJvdygpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnY29udGFjdEl0ZW0nLCAoKSA9PiB7XG4gIGNvbnN0IGZvcm1EYXRhID0ge1xuICAgIG5hbWU6ICd0ZXN0JyxcbiAgICByZXBseV90bzogJ3Rlc3RAZXhhbXBsZS5jb20nLFxuICAgIG1lc3NhZ2U6ICd0ZXN0IG1lc3NhZ2UnLFxuICB9O1xuXG4gIHRlc3QoJ2NvbnRhY3RJdGVtIHJldHVybnMgYW4gb2JqZWN0IHdpdGggNCBrZXlzJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGdldENvbnRhY3RJdGVtKGZvcm1EYXRhKTtcbiAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFxuICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICBuYW1lOiB7IFM6IGZvcm1EYXRhLm5hbWUgfSxcbiAgICAgICAgZGF0ZTogeyBTOiBleHBlY3QuYW55KFN0cmluZykgfSxcbiAgICAgICAgbWFpbDogeyBTOiBmb3JtRGF0YS5yZXBseV90byB9LFxuICAgICAgICBtZXNzYWdlOiB7IFM6IGZvcm1EYXRhLm1lc3NhZ2UgfSxcbiAgICAgIH0pLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JldHVybnMgYW4gb2JqZWN0IHdpdGggbmFtZSwgZGF0ZSwgbWFpbCBhbmQgbWVzc2FnZSBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGdldENvbnRhY3RJdGVtKGZvcm1EYXRhKTtcbiAgICBleHBlY3QocmVzdWx0KS50b0hhdmVQcm9wZXJ0eSgnbmFtZScpO1xuICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZVByb3BlcnR5KCdkYXRlJyk7XG4gICAgZXhwZWN0KHJlc3VsdCkudG9IYXZlUHJvcGVydHkoJ21haWwnKTtcbiAgICBleHBlY3QocmVzdWx0KS50b0hhdmVQcm9wZXJ0eSgnbWVzc2FnZScpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnZ2V0RW1haWxNZXNzYWdlSXRlbScsICgpID0+IHtcbiAgdGVzdCgncmV0dXJucyBhbiBlbWFpbCBtZXNzYWdlIGl0ZW0gd2l0aCBjb3JyZWN0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgdHlwZSA9ICdjb250YWN0JztcbiAgICBjb25zdCByZXN1bHQgPSBnZXRFbWFpbE1lc3NhZ2VJdGVtKG1vY2tGb3JtRGF0YSwgdHlwZSk7XG4gICAgLy8gZXhwZWN0KHJlc3VsdCkudG9IYXZlUHJvcGVydHkoJ1NvdXJjZScsIHByb2Nlc3MuZW52LkVNQUlMKTtcbiAgICBleHBlY3QocmVzdWx0KS50b0hhdmVQcm9wZXJ0eSgnUmVwbHlUb0FkZHJlc3NlcycsIFttb2NrRm9ybURhdGEucmVwbHlfdG9dKTtcbiAgICAvLyBleHBlY3QocmVzdWx0KS50b0hhdmVQcm9wZXJ0eSgnRGVzdGluYXRpb24uVG9BZGRyZXNzZXMnLCBbXG4gICAgLy8gICBwcm9jZXNzLmVudi5FTUFJTCxcbiAgICAvLyBdKTtcbiAgICBleHBlY3QocmVzdWx0KS50b0hhdmVQcm9wZXJ0eShcbiAgICAgICdNZXNzYWdlLkJvZHkuVGV4dC5EYXRhJyxcbiAgICAgIGBOYW1lOiAke21vY2tGb3JtRGF0YS5uYW1lfVxcbkVtYWlsOiAke21vY2tGb3JtRGF0YS5yZXBseV90b31cXG5NZXNzYWdlOiAke21vY2tGb3JtRGF0YS5tZXNzYWdlfWAsXG4gICAgKTtcbiAgICBleHBlY3QocmVzdWx0KS50b0hhdmVQcm9wZXJ0eShcbiAgICAgICdNZXNzYWdlLlN1YmplY3QuRGF0YScsXG4gICAgICBgQkxPRyBtZXNzYWdlOiBOZXcgJHt0eXBlfSBtZXNzYWdlIGZyb20gbXkgd2ViIHBsYXlpbmdhd3NgLFxuICAgICk7XG4gIH0pO1xufSk7XG5cbi8vIGRlc2NyaWJlKCdnZXRSZXNwb25zZUhhbmRsZXInLCAoKSA9PiB7XG4vLyAgIHRlc3QoJ3Nob3VsZCByZXR1cm4gYSByZXNwb25zZSB3aXRoIDIwMCBzdGF0dXMgY29kZSBhbmQgc3VjY2VzcyBtZXNzYWdlJywgKCkgPT4ge1xuLy8gICAgIGNvbnN0IGV4cGVjdGVkUmVzcG9uc2UgPSB7XG4vLyAgICAgICBzdGF0dXNDb2RlOiAyMDAsXG4vLyAgICAgICBoZWFkZXJzOiB7XG4vLyAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4vLyAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnaHR0cHM6Ly93d3cucGxheWluZ2F3cy5jb20nLFxuLy8gICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnOiBmYWxzZSxcbi8vICAgICAgIH0sXG4vLyAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6ICdTdWNjZXNzJyB9KSxcbi8vICAgICB9O1xuLy8gICAgIGNvbnN0IHJlc3BvbnNlID0gZ2V0UmVzcG9uc2VIYW5kbGVyKCk7XG4vLyAgICAgZXhwZWN0KHJlc3BvbnNlKS50b0VxdWFsKGV4cGVjdGVkUmVzcG9uc2UpO1xuLy8gICB9KTtcbi8vIH0pO1xuIl19