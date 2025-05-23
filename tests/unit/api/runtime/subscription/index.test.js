"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subscription_1 = require("../../../../../backend/api/runtime/subscription");
describe('validateInput', () => {
    test('throws an error if formData is missing email', () => {
        expect(() => (0, subscription_1.validateInput)({})).toThrow('Missing required fields: email');
    });
    test('throws an error if email is invalid', () => {
        expect(() => (0, subscription_1.validateInput)({ email: 'invalid-email' })).toThrow('Invalid email address');
    });
    test('does not throw an error if email is valid', () => {
        expect(() => (0, subscription_1.validateInput)({ email: 'valid@example.com' })).not.toThrow();
    });
});
describe('subscriptionItem', () => {
    test('subscriptionItem returns an object with 3 keys', () => {
        const formData = {
            email: 'test@example.com',
        };
        const result = (0, subscription_1.getSubscriptionItem)(formData);
        expect(result).toEqual(expect.objectContaining({
            email: { S: formData.email },
            id: { S: expect.any(String) },
            subscription_date: { S: expect.any(String) },
        }));
    });
    test('returns an object with email, id and subscription_date properties', () => {
        const formData = {
            email: 'johndoe@example.com',
        };
        const result = (0, subscription_1.getSubscriptionItem)(formData);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrRkFHeUQ7QUFFekQsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7SUFDN0IsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtRQUN4RCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSw0QkFBYSxFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQy9DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLDRCQUFhLEVBQUMsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDN0QsdUJBQXVCLENBQ3hCLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7UUFDckQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsNEJBQWEsRUFBQyxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDNUUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtRQUMxRCxNQUFNLFFBQVEsR0FBRztZQUNmLEtBQUssRUFBRSxrQkFBa0I7U0FDMUIsQ0FBQztRQUNGLE1BQU0sTUFBTSxHQUFHLElBQUEsa0NBQW1CLEVBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FDcEIsTUFBTSxDQUFDLGdCQUFnQixDQUFDO1lBQ3RCLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQzVCLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzdCLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7U0FDN0MsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7UUFDN0UsTUFBTSxRQUFRLEdBQUc7WUFDZixLQUFLLEVBQUUscUJBQXFCO1NBQzdCLENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxJQUFBLGtDQUFtQixFQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILHlDQUF5QztBQUN6QyxzRkFBc0Y7QUFDdEYsaUNBQWlDO0FBQ2pDLHlCQUF5QjtBQUN6QixtQkFBbUI7QUFDbkIsOENBQThDO0FBQzlDLHVFQUF1RTtBQUN2RSxxREFBcUQ7QUFDckQsV0FBVztBQUNYLHNEQUFzRDtBQUN0RCxTQUFTO0FBQ1QsNkNBQTZDO0FBQzdDLGtEQUFrRDtBQUNsRCxRQUFRO0FBQ1IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIHZhbGlkYXRlSW5wdXQsXG4gIGdldFN1YnNjcmlwdGlvbkl0ZW0sXG59IGZyb20gJy4uLy4uLy4uLy4uLy4uL2JhY2tlbmQvYXBpL3J1bnRpbWUvc3Vic2NyaXB0aW9uJztcblxuZGVzY3JpYmUoJ3ZhbGlkYXRlSW5wdXQnLCAoKSA9PiB7XG4gIHRlc3QoJ3Rocm93cyBhbiBlcnJvciBpZiBmb3JtRGF0YSBpcyBtaXNzaW5nIGVtYWlsJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB2YWxpZGF0ZUlucHV0KHt9KSkudG9UaHJvdygnTWlzc2luZyByZXF1aXJlZCBmaWVsZHM6IGVtYWlsJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBhbiBlcnJvciBpZiBlbWFpbCBpcyBpbnZhbGlkJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB2YWxpZGF0ZUlucHV0KHsgZW1haWw6ICdpbnZhbGlkLWVtYWlsJyB9KSkudG9UaHJvdyhcbiAgICAgICdJbnZhbGlkIGVtYWlsIGFkZHJlc3MnLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IHRocm93IGFuIGVycm9yIGlmIGVtYWlsIGlzIHZhbGlkJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB2YWxpZGF0ZUlucHV0KHsgZW1haWw6ICd2YWxpZEBleGFtcGxlLmNvbScgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdzdWJzY3JpcHRpb25JdGVtJywgKCkgPT4ge1xuICB0ZXN0KCdzdWJzY3JpcHRpb25JdGVtIHJldHVybnMgYW4gb2JqZWN0IHdpdGggMyBrZXlzJywgKCkgPT4ge1xuICAgIGNvbnN0IGZvcm1EYXRhID0ge1xuICAgICAgZW1haWw6ICd0ZXN0QGV4YW1wbGUuY29tJyxcbiAgICB9O1xuICAgIGNvbnN0IHJlc3VsdCA9IGdldFN1YnNjcmlwdGlvbkl0ZW0oZm9ybURhdGEpO1xuICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXG4gICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgIGVtYWlsOiB7IFM6IGZvcm1EYXRhLmVtYWlsIH0sXG4gICAgICAgIGlkOiB7IFM6IGV4cGVjdC5hbnkoU3RyaW5nKSB9LFxuICAgICAgICBzdWJzY3JpcHRpb25fZGF0ZTogeyBTOiBleHBlY3QuYW55KFN0cmluZykgfSxcbiAgICAgIH0pLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JldHVybnMgYW4gb2JqZWN0IHdpdGggZW1haWwsIGlkIGFuZCBzdWJzY3JpcHRpb25fZGF0ZSBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IGZvcm1EYXRhID0ge1xuICAgICAgZW1haWw6ICdqb2huZG9lQGV4YW1wbGUuY29tJyxcbiAgICB9O1xuICAgIGNvbnN0IHJlc3VsdCA9IGdldFN1YnNjcmlwdGlvbkl0ZW0oZm9ybURhdGEpO1xuICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZVByb3BlcnR5KCdlbWFpbCcpO1xuICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZVByb3BlcnR5KCdpZCcpO1xuICAgIGV4cGVjdChyZXN1bHQpLnRvSGF2ZVByb3BlcnR5KCdzdWJzY3JpcHRpb25fZGF0ZScpO1xuICB9KTtcbn0pO1xuXG4vLyBkZXNjcmliZSgnZ2V0UmVzcG9uc2VIYW5kbGVyJywgKCkgPT4ge1xuLy8gICB0ZXN0KCdzaG91bGQgcmV0dXJuIGEgcmVzcG9uc2Ugd2l0aCAyMDAgc3RhdHVzIGNvZGUgYW5kIHN1Y2Nlc3MgbWVzc2FnZScsICgpID0+IHtcbi8vICAgICBjb25zdCBleHBlY3RlZFJlc3BvbnNlID0ge1xuLy8gICAgICAgc3RhdHVzQ29kZTogMjAwLFxuLy8gICAgICAgaGVhZGVyczoge1xuLy8gICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuLy8gICAgICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJ2h0dHBzOi8vd3d3LnBsYXlpbmdhd3MuY29tJyxcbi8vICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogZmFsc2UsXG4vLyAgICAgICB9LFxuLy8gICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiAnU3VjY2VzcycgfSksXG4vLyAgICAgfTtcbi8vICAgICBjb25zdCByZXNwb25zZSA9IGdldFJlc3BvbnNlSGFuZGxlcigpO1xuLy8gICAgIGV4cGVjdChyZXNwb25zZSkudG9FcXVhbChleHBlY3RlZFJlc3BvbnNlKTtcbi8vICAgfSk7XG4vLyB9KTtcbiJdfQ==