"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utilities/logger"));
const errorHandler_1 = __importDefault(require("./errorHandler"));
const errors_1 = require("../../errors");
const logger = (0, logger_1.default)('payload');
const testError = new errors_1.APIError('test error', 503);
describe('errorHandler', () => {
    const res = generateResponse();
    const next = jest.fn();
    const req = generateRequest();
    it('should send the response with the error', async () => {
        const handler = (0, errorHandler_1.default)(generateConfig({ debug: true }), logger);
        await handler(testError, req, res, next);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ errors: [{ message: 'test error' }] }));
    });
    it('should include stack trace when config debug is on', async () => {
        const handler = (0, errorHandler_1.default)(generateConfig({ debug: true }), logger);
        await handler(testError, req, res, next);
        expect(res.send).toHaveBeenCalledWith(expect.objectContaining({ stack: expect.any(String) }));
    });
    it('should not include stack trace when config debug is not set', async () => {
        const handler = (0, errorHandler_1.default)(generateConfig({ debug: undefined }), logger);
        await handler(testError, req, res, next);
        expect(res.send).toHaveBeenCalledWith(expect.not.objectContaining({ stack: expect.any(String) }));
    });
    it('should not include stack trace when config debug is false', async () => {
        const handler = (0, errorHandler_1.default)(generateConfig({ debug: false }), logger);
        await handler(testError, req, res, next);
        expect(res.send).toHaveBeenCalledWith(expect.not.objectContaining({ stack: expect.any(String) }));
    });
    it('should show the status code when given an error with a code', async () => {
        const handler = (0, errorHandler_1.default)(generateConfig(), logger);
        await handler(testError, req, res, next);
        expect(res.status).toHaveBeenCalledWith(503);
    });
    it('should default to 500 when an error does not have a status code', async () => {
        const handler = (0, errorHandler_1.default)(generateConfig(), logger);
        testError.status = undefined;
        await handler(testError, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
    });
    it('should call payload config afterError hook', async () => {
        const afterError = jest.fn();
        const handler = (0, errorHandler_1.default)(generateConfig({
            hooks: { afterError },
        }), logger);
        await handler(testError, req, res, next);
        expect(afterError)
            // eslint-disable-next-line jest/prefer-called-with
            .toHaveBeenCalled();
    });
    it('should call collection config afterError hook', async () => {
        const handler = (0, errorHandler_1.default)(generateConfig(), logger);
        await handler(testError, req, res, next);
        expect(req.collection.config.hooks.afterError)
            // eslint-disable-next-line jest/prefer-called-with
            .toHaveBeenCalled();
    });
});
function generateResponse() {
    const res = {
        status: jest.fn(),
        send: jest.fn(),
    };
    jest.spyOn(res, 'status').mockImplementation().mockReturnValue(res);
    jest.spyOn(res, 'send').mockImplementation().mockReturnValue(res);
    return res;
}
function generateRequest() {
    return {
        collection: {
            config: {
                hooks: {
                    afterError: jest.fn(),
                },
            },
        },
    };
}
function generateConfig(overrides) {
    return {
        debug: false,
        hooks: { afterError: jest.fn() },
        ...overrides,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JIYW5kbGVyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXhwcmVzcy9taWRkbGV3YXJlL2Vycm9ySGFuZGxlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esb0VBQTRDO0FBQzVDLGtFQUEwQztBQUMxQyx5Q0FBd0M7QUFJeEMsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxFQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRWpDLE1BQU0sU0FBUyxHQUFHLElBQUksaUJBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFFbEQsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQztJQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDdkIsTUFBTSxHQUFHLEdBQUcsZUFBZSxFQUFvQixDQUFDO0lBRWhELEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN2RCxNQUFNLE9BQU8sR0FBRyxJQUFBLHNCQUFZLEVBQUMsY0FBYyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEUsTUFBTSxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxvQkFBb0IsQ0FDbkMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQ2pFLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsRSxNQUFNLE9BQU8sR0FBRyxJ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