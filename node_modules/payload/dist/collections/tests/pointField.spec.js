"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const load_1 = __importDefault(require("../../config/load"));
const testCredentials_1 = require("../../mongoose/testCredentials");
require('isomorphic-fetch');
const { serverURL, routes } = (0, load_1.default)();
let token = null;
let headers = null;
describe('GeoJSON', () => {
    beforeAll(async (done) => {
        const response = await fetch(`${serverURL}/api/admins/login`, {
            body: JSON.stringify({
                email: testCredentials_1.email,
                password: testCredentials_1.password,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
        });
        const data = await response.json();
        ({ token } = data);
        headers = {
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json',
        };
        done();
    });
    describe('Point Field - REST', () => {
        let location = [10, 20];
        const localizedPoint = [30, 40];
        const group = { point: [15, 25] };
        let doc;
        beforeAll(async (done) => {
            const create = await fetch(`${serverURL}/api/geolocation`, {
                body: JSON.stringify({ location, localizedPoint, group }),
                headers,
                method: 'post',
            });
            ({ doc } = await create.json());
            done();
        });
        it('should create and read collections with points', async () => {
            expect(doc.id).toBeDefined();
            expect(doc.location).toStrictEqual(location);
            expect(doc.localizedPoint).toStrictEqual(localizedPoint);
        });
        it('should query where near point', async () => {
            const [lng, lat] = location;
            const hitResponse = await fetch(`${serverURL}/api/geolocation?where[location][near]=${lng + 0.01},${lat + 0.01},10000`, {
                headers,
                method: 'get',
            });
            const hitData = await hitResponse.json();
            const hitDocs = hitData.docs;
            const missResponse = await fetch(`${serverURL}/api/geolocation?where[location][near]=-${lng},-${lat},5000`, {
                headers,
                method: 'get',
            });
            const missData = await missResponse.json();
            const missDocs = missData.docs;
            expect(hitDocs).toHaveLength(1);
            expect(missDocs).toHaveLength(0);
        });
        it('should query where near localized point', async () => {
            const [lng, lat] = localizedPoint;
            const hitResponse = await fetch(`${serverURL}/api/geolocation?where[localizedPoint][near]=${lng + 0.01},${lat + 0.01},10000`, {
                headers,
                method: 'get',
            });
            const hitData = await hitResponse.json();
            const hitDocs = hitData.docs;
            const missResponse = await fetch(`${serverURL}/api/geolocation?where[localizedPoint][near]=-${lng},-${lat},5000`, {
                headers,
                method: 'get',
            });
            const missData = await missResponse.json();
            const missDocs = missData.docs;
            expect(hitDocs).toHaveLength(1);
            expect(missDocs).toHaveLength(0);
        });
        it('should query near a nested point', async () => {
            const [x, y] = group.point;
            const hitResponse = await fetch(`${serverURL}/api/geolocation?where[group.point][near]=${x + 0.01},${y + 0.01},10000`, {
                headers,
                method: 'get',
            });
            const hitData = await hitResponse.json();
            const hitDocs = hitData.docs;
            const missResponse = await fetch(`${serverURL}/api/geolocation?where[group.point][near]=-${x},-${y},5000`, {
                headers,
                method: 'get',
            });
            const missData = await missResponse.json();
            const missDocs = missData.docs;
            expect(hitDocs).toHaveLength(1);
            expect(missDocs).toHaveLength(0);
        });
        it('should save with non-required point', async () => {
            location = undefined;
            const create = await fetch(`${serverURL}/api/geolocation`, {
                body: JSON.stringify({ location }),
                headers,
                method: 'post',
            });
            const { doc } = await create.json();
            expect(doc.id).toBeDefined();
            expect(doc.location).toStrictEqual(location);
        });
    });
    describe('Point Field - GraphQL', () => {
        const url = `${serverURL}${routes.api}${routes.graphQL}`;
        let client = null;
        const location = [50, 60];
        const localizedPoint = [70, 80];
        const group = { point: [50.5, 60.5] };
        let doc;
        beforeAll(async (done) => {
            client = new graphql_request_1.GraphQLClient(url, { headers: { Authorization: `JWT ${token}` } });
            // language=graphQL
            const query = `mutation {
        createGeolocation (
          data: {
            location: [${location[0]}, ${location[1]}],
            localizedPoint: [${localizedPoint[0]}, ${localizedPoint[1]}],
            group: {
              point: [${group.point[0]}, ${group.point[1]}]
            }
          }
        ) {
          id
          location
          localizedPoint
        }
      }`;
            const response = await client.request(query);
            const { id } = response.createGeolocation;
            // language=graphQL
            const readQuery = `query {
        Geolocation(id: "${id}") {
          id
          location
          localizedPoint
        }
      }`;
            const readResponse = await client.request(readQuery);
            doc = readResponse.Geolocation;
            done();
        });
        it('should create and read collections with points', async () => {
            expect(doc.id).toBeDefined();
            expect(doc.location).toStrictEqual(location);
            expect(doc.localizedPoint).toStrictEqual(localizedPoint);
        });
        it('should query where near point', async () => {
            const [lng, lat] = location;
            // language=graphQL
            const hitQuery = `query getGeos {
        Geolocations(where: { location: { near: [${lng + 0.01},${lat + 0.01},10000]}}) {
          docs {
            id
            location
            localizedPoint
          }
        }
      }`;
            const hitResponse = await client.request(hitQuery);
            const hitDocs = hitResponse.Geolocations.docs;
            const missQuery = `query getGeos {
        Geolocations(where: { location: { near: [${-lng},${-lat},10000]}}) {
          docs {
            id
            location
            localizedPoint
          }
        }
      }`;
            const missResponse = await client.request(missQuery);
            const missDocs = missResponse.Geolocations.docs;
            expect(hitDocs).toHaveLength(1);
            expect(missDocs).toHaveLength(0);
        });
        it('should query where near a point in a group', async () => {
            const [x, y] = group.point;
            // language=graphQL
            const hitQuery = `query getGeos {
        Geolocations(where: { group__point: { near: [${x + 0.01},${y + 0.01},10000]}}) {
          docs {
            id
            group {
              point
            }
          }
        }
      }`;
            const hitResponse = await client.request(hitQuery);
            const hitDocs = hitResponse.Geolocations.docs;
            const missQuery = `query getGeos {
        Geolocations(where: { group__point: { near: [${-x},${-y},10000]}}) {
          docs {
            id
            group {
              point
            }
          }
        }
      }`;
            const missResponse = await client.request(missQuery);
            const missDocs = missResponse.Geolocations.docs;
            expect(hitDocs).toHaveLength(1);
            expect(missDocs).toHaveLength(0);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnRGaWVsZC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL3Rlc3RzL3BvaW50RmllbGQuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFEQUFnRDtBQUNoRCw2REFBMEM7QUFDMUMsb0VBQWlFO0FBRWpFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxjQUFTLEdBQUUsQ0FBQztBQUUxQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBRW5CLFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0lBQ3ZCLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDdkIsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxTQUFTLG1CQUFtQixFQUFFO1lBQzVELElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNuQixLQUFLLEVBQUwsdUJBQUs7Z0JBQ0wsUUFBUSxFQUFSLDBCQUFRO2FBQ1QsQ0FBQztZQUNGLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1lBQ0QsTUFBTSxFQUFFLE1BQU07U0FDZixDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVuQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDbkIsT0FBTyxHQUFHO1lBQ1IsYUFBYSxFQUFFLE9BQU8sS0FBSyxFQUFFO1lBQzdCLGNBQWMsRUFBRSxrQkFBa0I7U0FDbkMsQ0FBQztRQUVGLElBQUksRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFF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