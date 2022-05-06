"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
describe('Errors', () => {
    describe('APIError', () => {
        it('should handle an error message', () => {
            const error = new _1.APIError('my message', 400, false);
            expect(error.message).toStrictEqual('my message');
        });
        // it('should handle an array', () => {
        //   const errors = [
        //     {
        //       error: 'some error description',
        //     },
        //     {
        //       error: 'some error description 2',
        //     },
        //   ];
        //   const error = new APIError(errors, 400, false);
        //   expect(error.message).toStrictEqual(JSON.stringify(errors));
        // });
        // it('should handle an object', () => {
        //   const myFancyErrorObject = { someProp: 'someDetail ' };
        //   const error = new APIError(myFancyErrorObject, 400, false);
        //   expect(error.message).toStrictEqual(JSON.stringify(myFancyErrorObject));
        // });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXJyb3JzL2Vycm9ycy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0JBQTZCO0FBRTdCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO1FBQ3hCLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7WUFDeEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILHVDQUF1QztRQUN2QyxxQkFBcUI7UUFDckIsUUFBUTtRQUNSLHlDQUF5QztRQUN6QyxTQUFTO1FBQ1QsUUFBUTtRQUNSLDJDQUEyQztRQUMzQyxTQUFTO1FBQ1QsT0FBTztRQUNQLG9EQUFvRDtRQUNwRCxpRUFBaUU7UUFDakUsTUFBTTtRQUVOLHdDQUF3QztRQUN4Qyw0REFBNEQ7UUFDNUQsZ0VBQWdFO1FBQ2hFLDZFQUE2RTtRQUM3RSxNQUFNO0lBQ1IsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9