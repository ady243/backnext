"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const method_override_1 = __importDefault(require("method-override"));
const qs_middleware_1 = __importDefault(require("qs-middleware"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const middleware_1 = __importDefault(require("../../localization/middleware"));
const authenticate_1 = __importDefault(require("./authenticate"));
const identifyAPI_1 = __importDefault(require("./identifyAPI"));
const corsHeaders_1 = __importDefault(require("./corsHeaders"));
const convertPayload_1 = __importDefault(require("./convertPayload"));
const middleware = (payload) => {
    const rateLimitOptions = {
        windowMs: payload.config.rateLimit.window,
        max: payload.config.rateLimit.max,
    };
    if (typeof payload.config.rateLimit.skip === 'function')
        rateLimitOptions.skip = payload.config.rateLimit.skip;
    return [
        (0, express_rate_limit_1.default)(rateLimitOptions),
        passport_1.default.initialize(),
        (0, identifyAPI_1.default)('REST'),
        (0, method_override_1.default)('X-HTTP-Method-Override'),
        (0, qs_middleware_1.default)({ depth: 10, arrayLimit: 1000 }),
        body_parser_1.default.urlencoded({ extended: true }),
        (0, compression_1.default)(payload.config.express.compression),
        (0, middleware_1.default)(payload.config.localization),
        express_1.default.json(payload.config.express.json),
        (0, express_fileupload_1.default)({
            parseNested: true,
            ...payload.config.upload,
        }),
        convertPayload_1.default,
        (0, corsHeaders_1.default)(payload.config),
        (0, authenticate_1.default)(payload.config),
        ...(payload.config.express.middleware || []),
    ];
};
exports.default = middleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZXhwcmVzcy9taWRkbGV3YXJlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLHdEQUFnQztBQUNoQyw4REFBc0M7QUFDdEMsOERBQXFDO0FBQ3JDLHNFQUE2QztBQUM3QyxrRUFBeUM7QUFDekMsNEVBQTRDO0FBQzVDLDRFQUEyQztBQUMzQywrRUFBbUU7QUFDbkUsa0VBQTBDO0FBQzFDLGdFQUF3QztBQUd4QyxnRUFBd0M7QUFDeEMsc0VBQThDO0FBRTlDLE1BQU0sVUFBVSxHQUFHLENBQUMsT0FBZ0IsRUFBTyxFQUFFO0lBQzNDLE1BQU0sZ0JBQWdCLEdBSWxCO1FBQ0YsUUFBUSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU07UUFDekMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUc7S0FDbEMsQ0FBQztJQUVGLElBQUksT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssVUFBVTtRQUFFLGdCQUFnQixDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7SUFFL0csT0FBTztRQUNMLElBQUEsNEJBQVMsRUFBQyxnQkFBZ0IsQ0FBQztRQUMzQixrQkFBUSxDQUFDLFVBQVUsRUFBRTtRQUNyQixJQUFBLHFCQUFXLEVBQUMsTUFBTSxDQUFDO1FBQ25CLElBQUEseUJBQWMsRUFBQyx3QkFBd0IsQ0FBQztRQUN4QyxJQUFBLHVCQUFZLEVBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUM3QyxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUN6QyxJQUFBLHFCQUFXLEVBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQy9DLElBQUEsb0JBQXNCLEVBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDbkQsaUJBQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3pDLElBQUEsNEJBQVUsRUFBQztZQUNULFdBQVcsRUFBRSxJQUFJO1lBQ2pCLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNO1NBQ3pCLENBQUM7UUFDRix3QkFBYztRQUNkLElBQUEscUJBQVcsRUFBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUEsc0JBQVksRUFBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO0tBQzdDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixrQkFBZSxVQUFVLENBQUMifQ==