"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("mongodb"));
const load_1 = __importDefault(require("../config/load"));
const testCredentials_1 = require("../mongoose/testCredentials");
require('isomorphic-fetch');
const { url: mongoURL, port: mongoPort, name: mongoDBName } = testCredentials_1.connection;
const { serverURL: url } = (0, load_1.default)();
let token = null;
describe('Users REST API', () => {
    it('should prevent registering a first user', async () => {
        const response = await fetch(`${url}/api/admins/first-register`, {
            body: JSON.stringify({
                email: 'thisuser@shouldbeprevented.com',
                password: 'get-out',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
        });
        expect(response.status).toBe(403);
    });
    it('should login a user successfully', async () => {
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
        expect(response.status).toBe(200);
        expect(data.token).toBeDefined();
        ({ token } = data);
    });
    it('should return a logged in user from /me', async () => {
        const response = await fetch(`${url}/api/admins/me`, {
            headers: {
                Authorization: `JWT ${token}`,
            },
        });
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.user.email).toBeDefined();
    });
    it('should refresh a token and reset its expiration', async () => {
        const response = await fetch(`${url}/api/admins/refresh-token`, {
            method: 'post',
            headers: {
                Authorization: `JWT ${token}`,
            },
        });
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.refreshedToken).toBeDefined();
        token = data.refreshedToken;
    });
    it('should allow forgot-password by email', async () => {
        // TODO: figure out how to spy on payload instance functions
        // const mailSpy = jest.spyOn(payload, 'sendEmail');
        const response = await fetch(`${url}/api/admins/forgot-password`, {
            method: 'post',
            body: JSON.stringify({
                email: testCredentials_1.email,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // is not working
        // expect(mailSpy).toHaveBeenCalled();
        expect(response.status).toBe(200);
    });
    it('should allow a user to be created', async () => {
        const response = await fetch(`${url}/api/admins`, {
            body: JSON.stringify({
                email: 'name@test.com',
                password: testCredentials_1.password,
                roles: ['editor'],
            }),
            headers: {
                Authorization: `JWT ${token}`,
                'Content-Type': 'application/json',
            },
            method: 'post',
        });
        const data = await response.json();
        expect(response.status).toBe(201);
        expect(data).toHaveProperty('message');
        expect(data).toHaveProperty('doc');
        const { doc } = data;
        expect(doc).toHaveProperty('email');
        expect(doc).toHaveProperty('createdAt');
        expect(doc).toHaveProperty('roles');
    });
    it('should allow verification of a user', async () => {
        const emailToVerify = 'verify@me.com';
        const response = await fetch(`${url}/api/public-users`, {
            body: JSON.stringify({
                email: emailToVerify,
                password: testCredentials_1.password,
                roles: ['editor'],
            }),
            headers: {
                Authorization: `JWT ${token}`,
                'Content-Type': 'application/json',
            },
            method: 'post',
        });
        expect(response.status).toBe(201);
        const client = await mongodb_1.default.connect(`${mongoURL}:${mongoPort}`, {
            useUnifiedTopology: true,
        });
        const db = client.db(mongoDBName);
        const userResult = await db.collection('public-users').findOne({ email: emailToVerify });
        const { _verified, _verificationToken } = userResult;
        expect(_verified).toBe(false);
        expect(_verificationToken).toBeDefined();
        const verificationResponse = await fetch(`${url}/api/public-users/verify/${_verificationToken}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
        });
        expect(verificationResponse.status).toBe(200);
        const afterVerifyResult = await db.collection('public-users').findOne({ email: emailToVerify });
        const { _verified: afterVerified, _verificationToken: afterToken } = afterVerifyResult;
        expect(afterVerified).toBe(true);
        expect(afterToken).toBeUndefined();
    });
    describe('Account Locking', () => {
        const userEmail = 'lock@me.com';
        let db;
        beforeAll(async () => {
            const client = await mongodb_1.default.connect(`${mongoURL}:${mongoPort}`);
            db = client.db(mongoDBName);
        });
        it('should lock the user after too many attempts', async () => {
            await fetch(`${url}/api/admins`, {
                body: JSON.stringify({
                    email: userEmail,
                    password: testCredentials_1.password,
                }),
                headers: {
                    Authorization: `JWT ${token}`,
                    'Content-Type': 'application/json',
                },
                method: 'post',
            });
            const tryLogin = () => fetch(`${url}/api/admins/login`, {
                body: JSON.stringify({
                    email: userEmail,
                    password: 'bad',
                }),
                headers: {
                    Authorization: `JWT ${token}`,
                    'Content-Type': 'application/json',
                },
                method: 'post',
            });
            await tryLogin();
            await tryLogin();
            await tryLogin();
            await tryLogin();
            await tryLogin();
            const userResult = await db.collection('admins').findOne({ email: userEmail });
            const { loginAttempts, lockUntil } = userResult;
            expect(loginAttempts).toBe(5);
            expect(lockUntil).toBeDefined();
        });
        it('should unlock account once lockUntil period is over', async () => {
            await db.collection('admins').findOneAndUpdate({ email: userEmail }, { $set: { lockUntil: Date.now() - (605 * 1000) } });
            await fetch(`${url}/api/admins/login`, {
                body: JSON.stringify({
                    email: userEmail,
                    password: testCredentials_1.password,
                }),
                headers: {
                    Authorization: `JWT ${token}`,
                    'Content-Type': 'application/json',
                },
                method: 'post',
            });
            const userResult = await db.collection('admins').findOne({ email: userEmail });
            const { loginAttempts, lockUntil } = userResult;
            expect(loginAttempts).toBe(0);
            expect(lockUntil).toBeUndefined();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2F1dGgvYXV0aC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQWtDO0FBQ2xDLDBEQUF1QztBQUN2QyxpRUFBMEU7QUFFMUUsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsNEJBQVUsQ0FBQztBQUV6RSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUEsY0FBUyxHQUFFLENBQUM7QUFFdkMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBRWpCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsRUFBRSxDQUFDLHlDQUF5QyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3ZELE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLEdBQUcsR0FBRyw0QkFBNEIsRUFBRTtZQUMvRCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDbkIsS0FBSyxFQUFFLGdDQUFnQztnQkFDdkMsUUFBUSxFQUFFLFNBQVM7YUFDcEIsQ0FBQztZQUNGLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1lBQ0QsTUFBTSxFQUFFLE1BQU07U0FDZixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNoRCxNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEdBQUcsbUJBQW1CLEVBQUU7WUFDdEQsSUFBSSxFQUFFLElBQUksQ0FBQyxT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