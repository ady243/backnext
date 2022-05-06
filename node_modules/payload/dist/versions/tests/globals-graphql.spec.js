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
let versionID;
describe('Global Versions - GraphQL', () => {
    const title = 'Global Blocks Title';
    beforeAll(async (done) => {
        // language=graphql
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
        // language=graphql
        const query = `mutation {
      updateBlocksGlobal(data: {
        title: "${title}"
        blocks: [{ quote: "Test quote", color: "red", blockName: "Some block title", blockType: "quote"}]
      }) {
        _status
        title
        blocks {
          __typename
          ... on Quote {
            quote
            color
          }
        }
      }
    }`;
        await client.request(query);
        done();
    });
    describe('Create', () => {
        it('should allow a new BlocksGlobal to be created with draft status', async () => {
            const updatedTitle = 'updated global title';
            // language=graphql
            const query = `mutation {
        updateBlocksGlobal(data: {
          title: "${updatedTitle}"
        }) {
          _status
          title
        }
      }`;
            await client.request(query);
            const response = await client.request(query);
            const data = response.updateBlocksGlobal;
            expect(data._status).toStrictEqual('draft');
            expect(data.title).toStrictEqual(updatedTitle);
        });
    });
    describe('should allow a version to be retrieved', () => {
        beforeAll(async (done) => {
            const updatedTitle = 'updated global title';
            // language=graphql
            const update = `mutation {
        updateBlocksGlobal(draft: true, data: {
          title: "${updatedTitle}"
        }) {
          _status
          title
        }
      }`;
            await client.request(update);
            // language=graphQL
            const query = `query {
        versionsBlocksGlobal(where: { version__title: { equals: "${title}" } }) {
          docs {
            id
            version {
              title
            }
          }
        }
      }`;
            const response = await client.request(query);
            versionID = response.versionsBlocksGlobal.docs[0].id;
            done();
        });
        it('should allow read of versions by version id', async () => {
            // language=graphql
            const query = `query {
        versionBlocksGlobal(id: "${versionID}") {
          id
          version {
            title
          }
        }
      }`;
            const response = await client.request(query);
            const data = response.versionBlocksGlobal;
            versionID = data.id;
            expect(data.id).toBeDefined();
            expect(data.version.title).toStrictEqual(title);
        });
        it('should allow read of versions by querying version content', async () => {
            // language=graphQL
            const query = `query {
        versionsBlocksGlobal(where: { version__title: {equals: "${title}" } }) {
          docs {
            id
            version {
              title
            }
          }
        }
      }`;
            const response = await client.request(query);
            const data = response.versionsBlocksGlobal;
            const doc = data.docs[0];
            versionID = doc.id;
            expect(doc.id).toBeDefined();
            expect(doc.version.title).toStrictEqual(title);
        });
    });
    describe('Restore', () => {
        it('should allow a version to be restored', async () => {
            // language=graphql
            const restore = `mutation {
        restoreVersionBlocksGlobal(id: "${versionID}") {
          title
        }
      }`;
            await client.request(restore);
            const query = `query {
        BlocksGlobal {
          title
        }
      }`;
            const response = await client.request(query);
            const data = response.BlocksGlobal;
            expect(data.title).toStrictEqual(title);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFscy1ncmFwaHFsLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdmVyc2lvbnMvdGVzdHMvZ2xvYmFscy1ncmFwaHFsLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7R0FFRztBQUNILHFEQUF5RDtBQUN6RCw2REFBMEM7QUFDMUMsb0VBQWlFO0FBRWpFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRTVCLE1BQU0sTUFBTSxHQUFHLElBQUEsY0FBUyxHQUFFLENBQUM7QUFFM0IsTUFBTSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFFOUUsSUFBSSxNQUFNLENBQUM7QUFDWCxJQUFJLEtBQUssQ0FBQztBQUNWLElBQUksU0FBUyxDQUFDO0FBRWQsUUFBUSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxNQUFNLEtBQUssR0FBRyxxQkFBcUIsQ0FBQztJQUNwQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3ZCLG1CQUFtQjtRQUNuQixNQUFNLEtBQUssR0FBRzs7O29CQUdFLHVCQUFLO3VCQUNGLDBCQUFROzs7O1FBSXZCLENBQUM7UUFFTCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEseUJBQU8sRUFBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFM0MsS0FBSyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBRWxDLE1BQU0sR0FBRyxJQUFJLCtCQUFhLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsYUFBYSxFQUFFLE9BQU8sS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFaEYsbUJBQW1CO1FBQ25CLE1BQU0sS0FBSyxHQUFHOztrQkFFQSxLQUFL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