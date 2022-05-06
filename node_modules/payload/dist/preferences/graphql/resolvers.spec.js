"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment node
 */
const graphql_request_1 = require("graphql-request");
const load_1 = __importDefault(require("../../config/load"));
const testCredentials_1 = require("../../mongoose/testCredentials");
require('isomorphic-fetch');
const config = (0, load_1.default)();
const url = `${config.serverURL}${config.routes.api}${config.routes.graphQL}`;
let client = null;
let token = null;
describe('GrahpQL Preferences', () => {
    beforeAll(async (done) => {
        const query = `
      mutation {
        loginAdmin(
          email: "${testCredentials_1.email}",
          password: "${testCredentials_1.password}"
        ) {
          token
        }
      }`;
        const response = await (0, graphql_request_1.request)(url, query);
        token = response.loginAdmin.token;
        client = new graphql_request_1.GraphQLClient(url, { headers: { Authorization: `JWT ${token}` } });
        done();
    });
    describe('Update', () => {
        it('should allow a preference to be saved', async () => {
            const key = 'preference-key';
            const value = 'preference-value';
            // language=graphQL
            const query = `mutation {
          updatePreference(key: "${key}", value: "${value}") {
          key
          value
        }
      }`;
            const response = await client.request(query);
            const data = response.updatePreference;
            expect(data.key).toBe(key);
            expect(data.value).toBe(value);
        });
    });
    describe('Read', () => {
        it('should be able to read user preference', async () => {
            const key = 'preference-key';
            const value = 'preference-value';
            // language=graphQL
            const query = `mutation {
          updatePreference(key: "${key}", value: "${value}") {
          key
          value
        }
      }`;
            const response = await client.request(query);
            const { key: responseKey, value: responseValue } = response.updatePreference;
            // language=graphQL
            const readQuery = `query {
        Preference(key: "${responseKey}") {
          key
          value
        }
      }`;
            const readResponse = await client.request(readQuery);
            expect(responseKey).toStrictEqual(key);
            expect(readResponse.Preference.key).toStrictEqual(key);
            expect(responseValue).toStrictEqual(value);
            expect(readResponse.Preference.value).toStrictEqual(value);
        });
    });
    describe('Delete', () => {
        it('should be able to delete a preference', async () => {
            const key = 'gql-delete';
            const value = 'description';
            // language=graphQL
            const query = `mutation {
            updatePreference(key: "${key}" value: "${value}") {
            key
            value
          }
        }`;
            const response = await client.request(query);
            const { key: responseKey } = response.updatePreference;
            // language=graphQL
            const deleteMutation = `mutation {
        deletePreference(key: "${key}") {
          key
          value
        }
      }`;
            const deleteResponse = await client.request(deleteMutation);
            const deleteKey = deleteResponse.deletePreference.key;
            expect(responseKey).toStrictEqual(key);
            expect(deleteKey).toStrictEqual(key);
        });
    });
    it('should return null when query key is not found', async () => {
        const key = 'bad-key';
        const readQuery = `query {
        Preference(key: "${key}") {
          key
          value
        }
      }`;
        const response = await client.request(readQuery);
        expect(response.Preference).toBeNull();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZXJzLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJlZmVyZW5jZXMvZ3JhcGhxbC9yZXNvbHZlcnMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBOztHQUVHO0FBQ0gscURBQXlEO0FBQ3pELDZEQUEwQztBQUMxQyxvRUFBaUU7QUFFakUsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFNUIsTUFBTSxNQUFNLEdBQUcsSUFBQSxjQUFTLEdBQUUsQ0FBQztBQUUzQixNQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUU5RSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBRWpCLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUN2QixNQUFNLEtBQUssR0FBRzs7O29CQUdFLHVCQUFLO3VCQUNGLDBCQUFROzs7O1FBSXZCLENBQUM7UUFFTCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEseUJBQU8sRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFM0MsS0FBSyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBRWxDLE1BQU0sR0FBRyxJQUFJLCtCQUFhLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsYUFBYSxFQUFFLE9BQU8sS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFaEYsSUFBSSxFQUFFLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNyRCxNQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQztZQUM3QixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQztZQUVqQyxtQkFBbUI7WUFDbkIsTUFBTSxLQUFLLEdBQUc7bUNBQ2UsR0FBRyxjQUFjLEtBQUs7Ozs7UUFJakQsQ0FBQztZQUVILE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU3QyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUM7WUFFdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN0RCxNQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQztZQUM3QixNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQztZQUVqQyxtQkFBbUI7WUFDbkIsTUFBTSxLQUFLLEdBQUc7bUNBQ2UsR0FBRyxjQUFjLEtBQUs7Ozs7UUFJakQsQ0FBQztZQUVILE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU3QyxNQUFNLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1lBQzdFLG1CQUFtQjtZQUNuQixNQUFNLFNBQVMsR0FBRzsyQkFDRyxXQUFXOzs7O1FBSTlCLENBQUM7WUFDSCxNQUFNLFlBQVksR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFckQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNyRCxNQUFNLEdBQUcsR0FBRyxZQUFZLENBQUM7WUFDekIsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDO1lBRTVCLG1CQUFtQjtZQUNuQixNQUFNLEtBQUssR0FBRztxQ0FDaUIsR0FBRyxhQUFhLEtBQUs7Ozs7VUFJaEQsQ0FBQztZQUVMLE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU3QyxNQUFNLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztZQUN2RCxtQkFBbUI7WUFDbkIsTUFBTSxjQUFjLEdBQUc7aUNBQ0ksR0FBRzs7OztRQUk1QixDQUFDO1lBQ0gsTUFBTSxjQUFjLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzVELE1BQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7WUFFdEQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0RBQWdELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDOUQsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLE1BQU0sU0FBUyxHQUFHOzJCQUNLLEdBQUc7Ozs7UUFJdEIsQ0FBQztRQUNMLE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVqRCxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==