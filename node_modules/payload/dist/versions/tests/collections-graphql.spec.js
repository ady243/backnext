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
let client;
let token;
let postID;
let versionID;
describe('Collections GrahpQL Version Resolvers', () => {
    const title = 'autosave title';
    beforeAll(async (done) => {
        const login = `
      mutation {
        loginAdmin(
          email: "${testCredentials_1.email}",
          password: "${testCredentials_1.password}"
        ) {
          token
        }
      }`;
        const response = await (0, graphql_request_1.request)(url, login);
        token = response.loginAdmin.token;
        client = new graphql_request_1.GraphQLClient(url, { headers: { Authorization: `JWT ${token}` } });
        done();
    });
    describe('Create', () => {
        it('should allow a new autosavePost to be created with draft status', async () => {
            const description = 'autosave description';
            const query = `mutation {
          createAutosavePost(data: {title: "${title}", description: "${description}"}) {
          id
          title
          description
          createdAt
          updatedAt
          _status
        }
      }`;
            const response = await client.request(query);
            const data = response.createAutosavePost;
            postID = data.id;
            expect(data._status).toStrictEqual('draft');
        });
    });
    describe('Read', () => {
        const updatedTitle = 'updated title';
        beforeAll(async (done) => {
            // modify the post to create a new version
            // language=graphQL
            const update = `mutation {
        updateAutosavePost(id: "${postID}", data: {title: "${updatedTitle}"}) {
          title
        }
      }`;
            await client.request(update);
            // language=graphQL
            const query = `query {
          versionsAutosavePosts(where: { parent: { equals: "${postID}" } }) {
          docs {
            id
          }
        }
      }`;
            const response = await client.request(query);
            versionID = response.versionsAutosavePosts.docs[0].id;
            done();
        });
        it('should allow read of versions by version id', async () => {
            const query = `query {
        versionAutosavePost(id: "${versionID}") {
          id
          parent {
            id
          }
          version {
            title
          }
        }
      }`;
            const response = await client.request(query);
            const data = response.versionAutosavePost;
            versionID = data.id;
            expect(data.id).toBeDefined();
            expect(data.parent.id).toStrictEqual(postID);
            expect(data.version.title).toStrictEqual(title);
        });
        it('should allow read of versions by querying version content', async () => {
            // language=graphQL
            const query = `query {
          versionsAutosavePosts(where: { version__title: {equals: "${title}" } }) {
          docs {
            id
            parent {
            id
          }
            version {
              title
            }
          }
        }
      }`;
            const response = await client.request(query);
            const data = response.versionsAutosavePosts;
            const doc = data.docs[0];
            versionID = doc.id;
            expect(doc.id).toBeDefined();
            expect(doc.parent.id).toStrictEqual(postID);
            expect(doc.version.title).toStrictEqual(title);
        });
    });
    describe('Restore', () => {
        it('should allow a version to be restored', async () => {
            // update a versionsPost
            const restore = `mutation {
        restoreVersionAutosavePost(id: "${versionID}") {
          title
        }
      }`;
            await client.request(restore);
            const query = `query {
        AutosavePost(id: "${postID}") {
          title
        }
      }`;
            const response = await client.request(query);
            const data = response.AutosavePost;
            expect(data.title).toStrictEqual(title);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbnMtZ3JhcGhxbC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3ZlcnNpb25zL3Rlc3RzL2NvbGxlY3Rpb25zLWdyYXBocWwuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBOztHQUVHO0FBQ0gscURBQXlEO0FBQ3pELDZEQUEwQztBQUMxQyxvRUFBaUU7QUFFakUsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFNUIsTUFBTSxNQUFNLEdBQUcsSUFBQSxjQUFTLEdBQUUsQ0FBQztBQUUzQixNQUFNLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUU5RSxJQUFJLE1BQU0sQ0FBQztBQUNYLElBQUksS0FBSyxDQUFDO0FBQ1YsSUFBSSxNQUFNLENBQUM7QUFDWCxJQUFJLFNBQVMsQ0FBQztBQUVkLFFBQVEsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7SUFDckQsTUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7SUFFL0IsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUN2QixNQUFNLEtBQUssR0FBRzs7O29CQUdFLHVCQUFLO3VCQUNGLDBCQUFROzs7O1FBSXZCLENBQUM7UUFFTCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEseUJBQU8sRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFM0MsS0FBSyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBRWxDLE1BQU0sR0FBRyxJQUFJLCtCQUFhLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsYUFBYSxFQUFFLE9BQU8sS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFaEYsSUFBSSxFQUFFLENBQUM7SUFDVCxDQUFD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