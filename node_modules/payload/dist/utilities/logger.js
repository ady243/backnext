"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const falsey_1 = __importDefault(require("falsey"));
const pino_1 = __importDefault(require("pino"));
const micro_memoize_1 = __importDefault(require("micro-memoize"));
exports.default = (0, micro_memoize_1.default)((name = 'payload', options) => (0, pino_1.default)({
    name,
    enabled: (0, falsey_1.default)(process.env.DISABLE_LOGGING),
    ...(options
        ? { options }
        : {
            prettyPrint: {
                ignore: 'pid,hostname',
                translateTime: 'HH:MM:ss',
            },
        }),
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdGllcy9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsZ0RBQXdCO0FBQ3hCLGtFQUFvQztBQUlwQyxrQkFBZSxJQUFBLHVCQUFPLEVBQ3BCLENBQUMsSUFBSSxHQUFHLFNBQVMsRUFBRSxPQUE0QixFQUFFLEVBQUUsQ0FBQyxJQUFBLGNBQUksRUFBQztJQUN2RCxJQUFJO0lBQ0osT0FBTyxFQUFFLElBQUEsZ0JBQU0sRUFBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztJQUM1QyxHQUFHLENBQUMsT0FBTztRQUNULENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRTtRQUNiLENBQUMsQ0FBQztZQUNBLFdBQVcsRUFBRTtnQkFDWCxNQUFNLEVBQUUsY0FBYztnQkFDdEIsYUFBYSxFQUFFLFVBQVU7YUFDMUI7U0FDRixDQUFDO0NBQ0wsQ0FBa0IsQ0FDcEIsQ0FBQyJ9