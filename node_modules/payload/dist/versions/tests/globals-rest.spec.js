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
let versionID;
describe('Global Versions - REST', () => {
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
        await fetch(`${url}/api/globals/blocks-global`, {
            body: JSON.stringify({
                title: 'Test Global',
                blocks: [
                    {
                        blockType: 'quote',
                        quote: 'This is a global that will be published',
                        color: 'red',
                    },
                ],
            }),
            headers,
            method: 'post',
        }).then((res) => res.json());
        done();
    });
    describe('Create', () => {
        it('should allow a new version to be created', async () => {
            const title2 = 'Here is an updated global title in EN';
            const updatedPost = await fetch(`${url}/api/globals/blocks-global`, {
                body: JSON.stringify({
                    title: title2,
                }),
                headers,
                method: 'post',
            }).then((res) => res.json());
            expect(updatedPost.result.title).toBe(title2);
            expect(updatedPost.result._status).toStrictEqual('draft');
            const versions = await fetch(`${url}/api/globals/blocks-global/versions`, {
                headers,
            }).then((res) => res.json());
            versionID = versions.docs[0].id;
        });
        it('should allow a version to be retrieved by ID', async () => {
            const version = await fetch(`${url}/api/globals/blocks-global/versions/${versionID}`, {
                headers,
            }).then((res) => res.json());
            expect(version.id).toStrictEqual(versionID);
        });
        it('should allow a version to save locales properly', async () => {
            const englishTitle = 'Title in EN';
            const spanishTitle = 'Title in ES';
            await fetch(`${url}/api/globals/blocks-global`, {
                body: JSON.stringify({
                    title: englishTitle,
                }),
                headers,
                method: 'post',
            }).then((res) => res.json());
            const updatedPostES = await fetch(`${url}/api/globals/blocks-global?locale=es`, {
                body: JSON.stringify({
                    title: spanishTitle,
                }),
                headers,
                method: 'post',
            }).then((res) => res.json());
            expect(updatedPostES.result.title).toBe(spanishTitle);
            const newEnglishTitle = 'New title in EN';
            await fetch(`${url}/api/globals/blocks-global`, {
                body: JSON.stringify({
                    title: newEnglishTitle,
                }),
                headers,
                method: 'post',
            }).then((res) => res.json());
            const versions = await fetch(`${url}/api/globals/blocks-global/versions?locale=all`, {
                headers,
            }).then((res) => res.json());
            expect(versions.docs[0].version.title.en).toStrictEqual(newEnglishTitle);
            expect(versions.docs[0].version.title.es).toStrictEqual(spanishTitle);
        });
    });
    describe('Restore', () => {
        it('should allow a version to be restored', async () => {
            const title2 = 'Here is an updated post title in EN';
            const updatedPost = await fetch(`${url}/api/globals/blocks-global`, {
                body: JSON.stringify({
                    title: title2,
                }),
                headers,
                method: 'post',
            }).then((res) => res.json());
            expect(updatedPost.result.title).toBe(title2);
            const versions = await fetch(`${url}/api/globals/blocks-global/versions`, {
                headers,
            }).then((res) => res.json());
            versionID = versions.docs[0].id;
            const restore = await fetch(`${url}/api/globals/blocks-global/versions/${versionID}`, {
                headers,
                method: 'post',
            }).then((res) => res.json());
            expect(restore.message).toBeDefined();
            expect(restore.doc.title).toBeDefined();
            const restoredPost = await fetch(`${url}/api/globals/blocks-global?draft=true`, {
                headers,
            }).then((res) => res.json());
            expect(restoredPost.title).toBe(restore.doc.title);
        });
    });
    // describe('Draft Access Control', () => {
    //   it('should prevent a draft from being publicly readable', async () => {
    //     const badAttempt = await fetch(`${url}/api/autosave-posts/${postID}`);
    //     expect(badAttempt.status).toBe(404);
    //   });
    //   it('should prevent an authenticated user from retrieving drafts without asking', async () => {
    //     const badAttempt = await fetch(`${url}/api/autosave-posts/${postID}`, {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });
    //     expect(badAttempt.status).toBe(404);
    //   });
    //   it('should allow an authenticated user to explicitly retrieve draft', async () => {
    //     const badAttempt = await fetch(`${url}/api/autosave-posts/${postID}?draft=true`, {
    //       headers,
    //     });
    //     expect(badAttempt.status).toBe(200);
    //   });
    // });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFscy1yZXN0LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdmVyc2lvbnMvdGVzdHMvZ2xvYmFscy1yZXN0LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2REFBMEM7QUFDMUMsb0VBQWlFO0FBRWpFLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBQSxjQUFTLEdBQUUsQ0FBQztBQUV2QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ25CLElBQUksU0FBUyxDQUFDO0FBRWQsUUFBUSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtJQUN0QyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3ZCLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsR0FBRyxtQkFBbUIsRUFBRTtZQUN0RCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDbkIsS0FBSyxFQUFMLHVCQUFLO2dCQUNMLFFBQVEsRUFBUiwwQkFBUTthQUNULENBQUM7WUFDRixPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFFLGtCQUFrQjthQUNuQztZQUNELE1BQU0sRUFBRSxNQUFNO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFbkMsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRW5CLE9BQU8sR0FBRztZQUNSLGFBQWEsRUFBRSxPQUFPLEtBQUssRUFBRTtZQUM3QixjQUFjLEVBQUUsa0JBQWtCO1NBQ25DLENBQUM7UUFFRixNQUFNLEtBQUssQ0FBQyxHQUFHLEdBQUcsNEJBQTRCLEVBQUU7WUFDOUMsSUFBSSxFQUFFLElBQUksQ0FB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