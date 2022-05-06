"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge_1 = __importDefault(require("deepmerge"));
const defaultUser_1 = __importDefault(require("../auth/defaultUser"));
const sanitize_1 = __importDefault(require("../collections/config/sanitize"));
const errors_1 = require("../errors");
const sanitize_2 = __importDefault(require("../globals/config/sanitize"));
const checkDuplicateCollections_1 = __importDefault(require("../utilities/checkDuplicateCollections"));
const defaults_1 = require("./defaults");
const sanitizeConfig = (config) => {
    const sanitizedConfig = (0, deepmerge_1.default)(defaults_1.defaults, config);
    if (!sanitizedConfig.admin.user) {
        sanitizedConfig.admin.user = 'users';
        const sanitizedDefaultUser = (0, sanitize_1.default)(sanitizedConfig, defaultUser_1.default);
        sanitizedConfig.collections.push(sanitizedDefaultUser);
    }
    else if (!sanitizedConfig.collections.find((c) => c.slug === sanitizedConfig.admin.user)) {
        throw new errors_1.InvalidConfiguration(`${sanitizedConfig.admin.user} is not a valid admin user collection`);
    }
    sanitizedConfig.collections = sanitizedConfig.collections.map((collection) => (0, sanitize_1.default)(sanitizedConfig, collection));
    (0, checkDuplicateCollections_1.default)(sanitizedConfig.collections);
    if (sanitizedConfig.globals.length > 0) {
        sanitizedConfig.globals = (0, sanitize_2.default)(sanitizedConfig.collections, sanitizedConfig.globals);
    }
    if (typeof sanitizedConfig.serverURL === 'undefined') {
        sanitizedConfig.serverURL = '';
    }
    if (sanitizedConfig.serverURL !== '') {
        sanitizedConfig.csrf.push(sanitizedConfig.serverURL);
    }
    return sanitizedConfig;
};
exports.default = sanitizeConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL3Nhbml0aXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMERBQThCO0FBRTlCLHNFQUE4QztBQUM5Qyw4RUFBZ0U7QUFDaEUsc0NBQWlEO0FBQ2pELDBFQUF5RDtBQUN6RCx1R0FBK0U7QUFDL0UseUNBQXNDO0FBRXRDLE1BQU0sY0FBYyxHQUFHLENBQUMsTUFBYyxFQUFtQixFQUFFO0lBQ3pELE1BQU0sZUFBZSxHQUFHLElBQUEsbUJBQUssRUFBQyxtQkFBUSxFQUFFLE1BQU0sQ0FBVyxDQUFDO0lBRTFELElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtRQUMvQixlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7UUFDckMsTUFBTSxvQkFBb0IsR0FBRyxJQUFBLGtCQUFrQixFQUFDLGVBQWUsRUFBRSxxQkFBVyxDQUFDLENBQUM7UUFDOUUsZUFBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUN4RDtTQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzFGLE1BQU0sSUFBSSw2QkFBb0IsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSx1Q0FBdUMsQ0FBQyxDQUFDO0tBQ3RHO0lBRUQsZUFBZSxDQUFDLFdBQVcsR0FBRyxlQUFlLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsSUFBQSxrQkFBa0IsRUFBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUMvSCxJQUFBLG1DQUF5QixFQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUV2RCxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN0QyxlQUFlLENBQUMsT0FBTyxHQUFHLElBQUEsa0JBQWUsRUFBQyxlQUFlLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRztJQUVELElBQUksT0FBTyxlQUFlLENBQUMsU0FBUyxLQUFLLFdBQVcsRUFBRTtRQUNwRCxlQUFlLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztLQUNoQztJQUVELElBQUksZUFBZSxDQUFDLFNBQVMsS0FBSyxFQUFFLEVBQUU7UUFDcEMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3REO0lBRUQsT0FBTyxlQUFrQyxDQUFDO0FBQzVDLENBQUMsQ0FBQztBQUVGLGtCQUFlLGNBQWMsQ0FBQyJ9