"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const load_1 = __importDefault(require("../../config/load"));
const testCredentials_1 = require("../../mongoose/testCredentials");
require('isomorphic-fetch');
const { serverURL: url } = (0, load_1.default)();
let token = null;
let headers = null;
describe('Collections - REST', () => {
    beforeAll(async (done) => {
        const response = await fetch(`${url}/api/admins/login`, {
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
    describe('Relationships', () => {
        let documentA;
        let documentB;
        let strictAccessDoc;
        beforeAll(async (done) => {
            const strictAccessRes = await fetch(`${url}/api/strict-access`, {
                body: JSON.stringify({
                    address: '123 Test Lane',
                    city: 'Grand Rapids',
                    state: 'MI',
                    zip: 49504,
                }),
                headers,
                method: 'post',
            });
            const strictAccessJSON = await strictAccessRes.json();
            strictAccessDoc = strictAccessJSON.doc;
            // create document a
            const createA = await fetch(`${url}/api/relationship-a`, {
                body: JSON.stringify({}),
                headers,
                method: 'post',
            });
            const createAData = await createA.json();
            // create document b, related to a
            const createB = await fetch(`${url}/api/relationship-b`, {
                body: JSON.stringify({
                    post: [createAData.doc.id],
                    strictAccess: strictAccessDoc.id,
                }),
                headers,
                method: 'post',
            });
            // update a to relate to b
            const createBData = await createB.json();
            documentB = createBData.doc;
            const updateA = await fetch(`${url}/api/relationship-a/${createAData.doc.id}`, {
                body: JSON.stringify({
                    post: documentB.id,
                    postMaxDepth: documentB.id,
                }),
                headers,
                method: 'put',
            });
            const updateAData = await updateA.json();
            documentA = updateAData.doc;
            done();
        });
        it('should create and read collections with relationships', async () => {
            expect(documentA.post).toBeDefined();
            expect(documentB.post).toHaveLength(1);
        });
        it('should prevent an unauthorized population of strict access', async () => {
            const response = await fetch(`${url}/api/relationship-b/${documentB.id}`);
            const data = await response.json();
            expect(data.strictAccess).toBeNull();
        });
        it('should populate strict access when authorized', async () => {
            const response = await fetch(`${url}/api/relationship-b/${documentB.id}`, {
                headers,
            });
            const data = await response.json();
            expect(typeof data.strictAccess).toBe('object');
        });
        it('should use depth to limit the number of relationships returned', async () => {
            const response = await fetch(`${url}/api/relationship-a?depth=3`, {
                headers,
                method: 'get',
            });
            const data = await response.json();
            const [doc] = data.docs;
            expect(doc.id).toBe(documentA.id);
            let nested = doc.post;
            expect(nested.id).toBe(documentB.id);
            [nested] = nested.post;
            expect(nested.id).toBe(documentA.id);
            nested = nested.post;
            expect(nested.id).toBe(documentB.id);
            [nested] = nested.post;
            expect(nested).not.toHaveProperty('post');
            expect(nested).toBe(documentA.id);
        });
        it('should respect max depth at the field level', async () => {
            const response = await fetch(`${url}/api/relationship-a?depth=1`, {
                headers,
                method: 'get',
            });
            const data = await response.json();
            const [doc] = data.docs;
            // asserts postMaxDepth is not populated
            expect(doc.postMaxDepth).toBe(documentB.id);
            expect(doc.postMaxDepth).not.toHaveProperty('post');
        });
        it('should allow a custom id relation', async () => {
            const customID = {
                id: 30,
                name: 'custom',
            };
            const newCustomID = await fetch(`${url}/api/custom-id`, {
                headers,
                body: JSON.stringify(customID),
                method: 'post',
            });
            const custom = await newCustomID.json();
            const response = await fetch(`${url}/api/relationship-a/${documentA.id}`, {
                headers,
                body: JSON.stringify({
                    ...documentA,
                    post: documentB.id,
                    customID: [custom.doc.id],
                }),
                method: 'put',
            });
            const { doc } = await response.json();
            expect(doc.customID[0].id).toBe(customID.id);
        });
        it('should allow a custom id relation and parse the id type', async () => {
            const customID = {
                id: '40',
                name: 'custom',
            };
            const newCustomID = await fetch(`${url}/api/custom-id`, {
                headers,
                body: JSON.stringify(customID),
                method: 'post',
            });
            const custom = await newCustomID.json();
            const response = await fetch(`${url}/api/relationship-a/${documentA.id}`, {
                headers,
                body: JSON.stringify({
                    ...documentA,
                    post: documentB.id,
                    customID: [custom.doc.id],
                }),
                method: 'put',
            });
            const { doc } = await response.json();
            expect(custom.doc.id).toBe(parseFloat(customID.id));
            expect(doc.customID[0].id).toBe(parseFloat(customID.id));
        });
        it('should use filterOptions to limit relationship options', async () => {
            // update documentB to disable relations
            await fetch(`${url}/api/relationship-b/${documentB.id}`, {
                headers,
                body: JSON.stringify({
                    disableRelation: true,
                }),
                method: 'put',
            });
            // attempt to save relationship to documentB
            const response = await fetch(`${url}/api/relationship-a/${documentA.id}`, {
                headers,
                body: JSON.stringify({
                    filterRelationship: documentB.id,
                }),
                method: 'put',
            });
            const result = await response.json();
            expect(result.errors).toBeDefined();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsYXRpb25zaGlwcy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbGxlY3Rpb25zL3Rlc3RzL3JlbGF0aW9uc2hpcHMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZEQUEwQztBQUMxQyxvRUFBaUU7QUFFakUsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGNBQVMsR0FBRSxDQUFDO0FBRXZDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFFbkIsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtJQUNsQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3ZCLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsR0FBRyxtQkFBbUIsRUFBRTtZQUN0RCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDbkIsS0FBSyxFQUFMLHVCQUFLO2dCQUNMLFFBQVEsRUFBUiwwQkFBUTthQUNULENBQUM7WUFDRixPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFFLGtCQUFrQjthQUNuQztZQUNELE1BQU0sRUFBRSxNQUFNO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFbkMsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ25CLE9BQU8sR0FBRztZQUNSLGFBQWEsRUFBRSxPQUFPLEtBQUssRUFBRTtZQUM3QixjQUFjLEVBQUUsa0JBQWtCO1NBQ25DLENBQUM7UUFFRixJQUFJLEVBQUUsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7UUFDN0Is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