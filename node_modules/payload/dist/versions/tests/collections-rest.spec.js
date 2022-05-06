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
let postID;
let versionID;
describe('Collection Versions - REST', () => {
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
        const post = await fetch(`${url}/api/autosave-posts`, {
            body: JSON.stringify({
                title: 'Here is an autosave post in EN',
                description: '345j23o4ifj34jf54g',
            }),
            headers,
            method: 'post',
        }).then((res) => res.json());
        postID = post.doc.id;
        done();
    });
    describe('Create', () => {
        it('should allow a new version to be created', async () => {
            const title2 = 'Here is an updated post title in EN';
            const updatedPost = await fetch(`${url}/api/autosave-posts/${postID}`, {
                body: JSON.stringify({
                    title: title2,
                }),
                headers,
                method: 'put',
            }).then((res) => res.json());
            const versions = await fetch(`${url}/api/autosave-posts/versions`, {
                headers,
            }).then((res) => res.json());
            versionID = versions.docs[0].id;
            expect(updatedPost.doc.title).toBe(title2);
            expect(updatedPost.doc._status).toStrictEqual('draft');
            expect(versionID).toBeDefined();
        });
        it('should allow a version to be retrieved by ID', async () => {
            const version = await fetch(`${url}/api/autosave-posts/versions/${versionID}`, {
                headers,
            }).then((res) => res.json());
            expect(version.id).toStrictEqual(versionID);
        });
        it('should allow a version to save locales properly', async () => {
            const englishTitle = 'Title in EN';
            const spanishTitle = 'Title in ES';
            await fetch(`${url}/api/autosave-posts/${postID}`, {
                body: JSON.stringify({
                    title: englishTitle,
                }),
                headers,
                method: 'put',
            }).then((res) => res.json());
            const updatedPostES = await fetch(`${url}/api/autosave-posts/${postID}?locale=es`, {
                body: JSON.stringify({
                    title: spanishTitle,
                }),
                headers,
                method: 'put',
            }).then((res) => res.json());
            expect(updatedPostES.doc.title).toBe(spanishTitle);
            const newEnglishTitle = 'New title in EN';
            await fetch(`${url}/api/autosave-posts/${postID}`, {
                body: JSON.stringify({
                    title: newEnglishTitle,
                }),
                headers,
                method: 'put',
            }).then((res) => res.json());
            const versions = await fetch(`${url}/api/autosave-posts/versions?locale=all`, {
                headers,
            }).then((res) => res.json());
            expect(versions.docs[0].version.title.en).toStrictEqual(englishTitle);
            expect(versions.docs[0].version.title.es).toStrictEqual(spanishTitle);
        });
    });
    describe('Restore', () => {
        it('should allow a version to be restored', async () => {
            const title2 = 'Here is an updated post title in EN';
            const updatedPost = await fetch(`${url}/api/autosave-posts/${postID}`, {
                body: JSON.stringify({
                    title: title2,
                }),
                headers,
                method: 'put',
            }).then((res) => res.json());
            expect(updatedPost.doc.title).toBe(title2);
            const versions = await fetch(`${url}/api/autosave-posts/versions`, {
                headers,
            }).then((res) => res.json());
            versionID = versions.docs[0].id;
            const restore = await fetch(`${url}/api/autosave-posts/versions/${versionID}`, {
                headers,
                method: 'post',
            }).then((res) => res.json());
            expect(restore.message).toBeDefined();
            expect(restore.doc.title).toBeDefined();
            const restoredPost = await fetch(`${url}/api/autosave-posts/${postID}?draft=true`, {
                headers,
            }).then((res) => res.json());
            expect(restoredPost.title).toBe(restore.doc.title);
        });
    });
    describe('Draft Access Control', () => {
        it('should prevent a draft from being publicly readable', async () => {
            const badAttempt = await fetch(`${url}/api/autosave-posts/${postID}`);
            expect(badAttempt.status).toBe(404);
        });
        it('should prevent an authenticated user from retrieving drafts without asking', async () => {
            const badAttempt = await fetch(`${url}/api/autosave-posts/${postID}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            expect(badAttempt.status).toBe(404);
        });
        it('should allow an authenticated user to explicitly retrieve draft', async () => {
            const badAttempt = await fetch(`${url}/api/autosave-posts/${postID}?draft=true`, {
                headers,
            });
            expect(badAttempt.status).toBe(200);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdGlvbnMtcmVzdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3ZlcnNpb25zL3Rlc3RzL2NvbGxlY3Rpb25zLXJlc3Quc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZEQUEwQztBQUMxQyxvRUFBaUU7QUFFakUsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFBLGNBQVMsR0FBRSxDQUFDO0FBRXZDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDbkIsSUFBSSxNQUFNLENBQUM7QUFDWCxJQUFJLFNBQVMsQ0FBQztBQUVkLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7SUFDMUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUN2QixNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEdBQUcsbUJBQW1CLEVBQUU7WUFDdEQsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ25CLEtBQUssRUFBTCx1QkFBSztnQkFDTCxRQUFRLEVBQVIsMEJBQVE7YUFDVCxDQUFDO1lBQ0YsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7WUFDRCxNQUFNLEVBQUUsTUFBTTtTQUNmLENBQUMsQ0FBQztRQUVILE1BQU0sSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRW5DLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUVuQixPQUFPLEdBQUc7WUFDUixhQUFhLEVBQUUsT0FBTyxLQUFLLEVBQUU7WUFDN0IsY0FBYyxFQUFFLGtCQUFrQjtTQUNuQyxDQUFDO1FBRUYsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FB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