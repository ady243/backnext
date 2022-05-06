"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @jest-environment node
 */
const graphql_request_1 = require("graphql-request");
const load_1 = __importDefault(require("../../../config/load"));
const testCredentials_1 = require("../../../mongoose/testCredentials");
require('isomorphic-fetch');
const config = (0, load_1.default)();
const url = `${config.serverURL}${config.routes.api}${config.routes.graphQL}`;
let client = null;
let token = null;
describe('GrahpQL Resolvers', () => {
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
    describe('Create', () => {
        it('should allow a localized post to be created', async () => {
            const title = 'gql create';
            const description = 'description';
            // language=graphQL
            const query = `mutation {
          createLocalizedPost(data: {title: "${title}", description: "${description}", priority: 10}) {
          id
          title
          description
          priority
          createdAt
          updatedAt
        }
      }`;
            const response = await client.request(query);
            const data = response.createLocalizedPost;
            expect(data.title).toBe(title);
            expect(data.id).toStrictEqual(expect.any(String));
            // const timestampRegex = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/;
            // expect(data.createdAt).toStrictEqual(expect.stringMatching(timestampRegex));
            // expect(data.updatedAt).toStrictEqual(expect.stringMatching(timestampRegex));
            expect(data.createdAt).toStrictEqual(expect.any(String));
            expect(data.updatedAt).toStrictEqual(expect.any(String));
        });
    });
    describe('Read', () => {
        it('should be able to read localized post', async () => {
            const title = 'gql read 1';
            const description = 'description';
            // language=graphQL
            const query = `mutation {
            createLocalizedPost(data: {title: "${title}", description: "${description}", priority: 10}) {
            id
            title
            description
            priority
            createdAt
            updatedAt
          }
        }`;
            const response = await client.request(query);
            const { id } = response.createLocalizedPost;
            // language=graphQL
            const readQuery = `query {
        LocalizedPost(id: "${id}") {
          id
        }
      }`;
            const readResponse = await client.request(readQuery);
            const retrievedId = readResponse.LocalizedPost.id;
            expect(retrievedId).toStrictEqual(id);
        });
        it('should query exists - true', async () => {
            const title = 'gql read 2';
            const description = 'description';
            const summary = 'summary';
            // language=graphQL
            const query = `mutation {
            createLocalizedPost(data: {title: "${title}", description: "${description}", summary: "${summary}", priority: 10}) {
            id
            title
            description
            priority
            createdAt
            updatedAt
          }
        }`;
            const response = await client.request(query);
            const { id } = response.createLocalizedPost;
            // language=graphQL
            const readQuery = `query {
  LocalizedPosts(where: { summary: { exists: true }}) {
    docs {
      id
      description
      summary
    }
  }
}`;
            const readResponse = await client.request(readQuery);
            const retrievedId = readResponse.LocalizedPosts.docs[0].id;
            expect(readResponse.LocalizedPosts.docs).toHaveLength(1);
            expect(retrievedId).toStrictEqual(id);
        });
        it('should query exists - false', async () => {
            const title = 'gql read 3';
            const description = 'description';
            // language=graphQL
            const query = `mutation {
            createLocalizedPost(data: {title: "${title}", description: "${description}", priority: 10}) {
            id
            title
            description
            priority
            createdAt
            updatedAt
          }
        }`;
            const response = await client.request(query);
            const { id } = response.createLocalizedPost;
            // language=graphQL
            const readQuery = `query {
  LocalizedPosts(where: { summary: { exists: false }}) {
    docs {
      id
      summary
    }
  }
}`;
            const readResponse = await client.request(readQuery);
            const retrievedDoc = readResponse.LocalizedPosts.docs[0];
            expect(readResponse.LocalizedPosts.docs.length).toBeGreaterThan(0);
            expect(retrievedDoc.id).toStrictEqual(id);
            expect(retrievedDoc.summary).toBeNull();
        });
    });
    describe('Update', () => {
        it('should allow updating an existing post', async () => {
            const title = 'gql update';
            const description = 'description';
            // language=graphQL
            const query = `mutation {
          createLocalizedPost(data: { title: "${title}", description: "${description}", priority: 10}) {
          id
          title
          description
          priority
        }
      }`;
            const createResponse = await client.request(query);
            const createData = createResponse.createLocalizedPost;
            const { id } = createData;
            const updatedDesc = 'updated description';
            // language=graphQL
            const update = `
      mutation {
        updateLocalizedPost(id: "${id}" data: {description: "${updatedDesc}"}) {
        description
      }
      }`;
            const response = await client.request(update);
            const data = response.updateLocalizedPost;
            expect(data.description).toBe(updatedDesc);
        });
    });
    describe('Delete', () => {
        it('should be able to delete a localized post', async () => {
            const title = 'gql delete';
            const description = 'description';
            // language=graphQL
            const query = `mutation {
            createLocalizedPost(data: {title: "${title}", description: "${description}", priority: 10}) {
            id
            title
            description
            priority
            createdAt
            updatedAt
          }
        }`;
            const response = await client.request(query);
            const { id } = response.createLocalizedPost;
            // language=graphQL
            const deleteMutation = `mutation {
        deleteLocalizedPost(id: "${id}") {
          id
        }
      }`;
            const deleteResponse = await client.request(deleteMutation);
            const deletedId = deleteResponse.deleteLocalizedPost.id;
            expect(deletedId).toStrictEqual(id);
        });
    });
    describe('Error Handler', () => {
        it('should return have an array of errors when making a bad request', async () => {
            let error;
            // language=graphQL
            const query = `query {
        LocalizedPosts(where: { summary: { exists: true }}) {
          docs {
            badFieldName
          }
        }
      }`;
            await client.request(query).catch((err) => {
                error = err;
            });
            expect(Array.isArray(error.response.errors)).toBe(true);
            expect(typeof error.response.errors[0].message).toBe('string');
        });
        it('should return have an array of errors when failing to pass validation', async () => {
            let error;
            // language=graphQL
            const query = `mutation {
          createLocalizedPost(data: {priority: 10}) {
          id
          priority
          createdAt
          updatedAt
        }
      }`;
            await client.request(query).catch((err) => {
                error = err;
            });
            expect(Array.isArray(error.response.errors)).toBe(true);
            expect(typeof error.response.errors[0].message).toBe('string');
        });
    });
    describe('Custom ID', () => {
        it('should create', async () => {
            const id = 10;
            const query = `mutation {
        createCustomID(data: {
          id: ${id},
          name: "custom"
        }) {
          id,
          name
        }
      }`;
            const response = await client.request(query);
            const data = response.createCustomID;
            expect(data.id).toStrictEqual(id);
        });
        it('should update', async () => {
            const id = 11;
            const name = 'custom name';
            const query = `
      mutation {
        createCustomID(data: {
          id: ${id},
          name: "${name}"
          }) {
          id
          name
        }
      }`;
            await client.request(query);
            const updatedName = 'updated name';
            const update = `
        mutation {
          updateCustomID(id: ${id} data: {name: "${updatedName}"}) {
          name
        }
      }`;
            const response = await client.request(update);
            const data = response.updateCustomID;
            expect(data.name).toStrictEqual(updatedName);
            expect(data.name).not.toStrictEqual(name);
        });
        it('should query on id', async () => {
            const id = 15;
            const name = 'custom name';
            const create = `mutation {
          createCustomID(data: {
          id: ${id},
          name: "${name}"
          }) {
          id
          name
        }
      }`;
            await client.request(create);
            const query = `
      query {
        CustomIDs(where: { id: { equals: ${id} } }) {
          docs {
            id
            name
          }
        }
      }`;
            const response = await client.request(query);
            const [doc] = response.CustomIDs.docs;
            expect(doc.id).toStrictEqual(id);
            expect(doc.name).toStrictEqual(name);
        });
        it('should delete', async () => {
            const id = 12;
            const query = `mutation {
          createCustomID(data: {
          id: ${id},
          name: "delete me"
          }) {
          id
          name
        }
      }`;
            await client.request(query);
            const deleteMutation = `mutation {
        deleteCustomID(id: ${id}) {
          id
        }
      }`;
            const deleteResponse = await client.request(deleteMutation);
            const deletedId = deleteResponse.deleteCustomID.id;
            expect(deletedId).toStrictEqual(id);
        });
        it('should allow relationships', async () => {
            const id = 13;
            const query = `mutation {
          createCustomID(data: {
            id: ${id},
            name: "relate me"
          }) {
            id
            name
        }
      }`;
            await client.request(query);
            const relation = `mutation {
        createRelationshipA(data: {
          customID: [ ${id} ]
        }) {
          customID {
            id
          }
        }
      }`;
            const relationResponse = await client.request(relation);
            const { customID } = relationResponse.createRelationshipA;
            expect(customID).toHaveLength(1);
            expect(customID).toHaveLength(1);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZXJzLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29sbGVjdGlvbnMvZ3JhcGhxbC9yZXNvbHZlcnMvcmVzb2x2ZXJzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7R0FFRztBQUNILHFEQUF5RDtBQUN6RCxnRUFBNkM7QUFDN0MsdUVBQW9FO0FBRXBFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRTVCLE1BQU0sTUFBTSxHQUFHLElBQUEsY0FBUyxHQUFFLENBQUM7QUFFM0IsTUFBTSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFFOUUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUVqQixRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO0lBQ2pDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDdkIsTUFBTSxLQUFLLEdBQUc7OztvQkFHRSx1QkFBSzt1QkFDRiwwQkFBUTs7OztRQUl2QixDQUFDO1FBRUwsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLHlCQUFPLEVBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTNDLEtBQUssR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztRQUVsQyxNQUFNLEdBQUcsSUFBSSwrQkFBYSxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLGFBQWEsRUFBRSxPQUFPLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWhGLElBQUksRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUN0QixF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