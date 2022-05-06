"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge_1 = __importDefault(require("deepmerge"));
const sanitize_1 = __importDefault(require("../../fields/config/sanitize"));
const toKebabCase_1 = __importDefault(require("../../utilities/toKebabCase"));
const auth_1 = __importDefault(require("../../auth/baseFields/auth"));
const apiKey_1 = __importDefault(require("../../auth/baseFields/apiKey"));
const verification_1 = __importDefault(require("../../auth/baseFields/verification"));
const accountLock_1 = __importDefault(require("../../auth/baseFields/accountLock"));
const getBaseFields_1 = __importDefault(require("../../uploads/getBaseFields"));
const formatLabels_1 = require("../../utilities/formatLabels");
const defaults_1 = require("./defaults");
const defaults_2 = require("../../versions/defaults");
const baseFields_1 = __importDefault(require("../../versions/baseFields"));
const TimestampsRequired_1 = __importDefault(require("../../errors/TimestampsRequired"));
const mergeBaseFields_1 = __importDefault(require("../../fields/mergeBaseFields"));
const sanitizeCollection = (config, collection) => {
    // /////////////////////////////////
    // Make copy of collection config
    // /////////////////////////////////
    const sanitized = (0, deepmerge_1.default)(defaults_1.defaults, collection);
    sanitized.slug = (0, toKebabCase_1.default)(sanitized.slug);
    sanitized.labels = sanitized.labels || (0, formatLabels_1.formatLabels)(sanitized.slug);
    if (sanitized.versions) {
        if (sanitized.versions === true)
            sanitized.versions = { drafts: false };
        if (sanitized.timestamps === false) {
            throw new TimestampsRequired_1.default(collection);
        }
        if (sanitized.versions.drafts) {
            if (sanitized.versions.drafts === true) {
                sanitized.versions.drafts = {
                    autosave: false,
                };
            }
            if (sanitized.versions.drafts.autosave === true)
                sanitized.versions.drafts.autosave = {};
            const versionFields = (0, mergeBaseFields_1.default)(sanitized.fields, baseFields_1.default);
            sanitized.fields = [
                ...versionFields,
                ...sanitized.fields,
            ];
        }
        sanitized.versions = (0, deepmerge_1.default)(defaults_2.versionCollectionDefaults, sanitized.versions);
    }
    if (sanitized.upload) {
        if (sanitized.upload === true)
            sanitized.upload = {};
        sanitized.upload.staticDir = sanitized.upload.staticDir || sanitized.slug;
        sanitized.upload.staticURL = sanitized.upload.staticURL || `/${sanitized.slug}`;
        sanitized.admin.useAsTitle = (sanitized.admin.useAsTitle && sanitized.admin.useAsTitle !== 'id') ? sanitized.admin.useAsTitle : 'filename';
        let uploadFields = (0, getBaseFields_1.default)({
            config,
            collection: sanitized,
        });
        uploadFields = (0, mergeBaseFields_1.default)(sanitized.fields, uploadFields);
        sanitized.fields = [
            ...uploadFields,
            ...sanitized.fields,
        ];
    }
    if (sanitized.auth) {
        sanitized.auth = (0, deepmerge_1.default)(defaults_1.authDefaults, typeof sanitized.auth === 'object' ? sanitized.auth : {});
        let authFields = auth_1.default;
        if (sanitized.auth.useAPIKey) {
            authFields = authFields.concat(apiKey_1.default);
        }
        if (sanitized.auth.verify) {
            if (sanitized.auth.verify === true)
                sanitized.auth.verify = {};
            authFields = authFields.concat(verification_1.default);
        }
        if (sanitized.auth.maxLoginAttempts > 0) {
            authFields = authFields.concat(accountLock_1.default);
        }
        authFields = (0, mergeBaseFields_1.default)(sanitized.fields, authFields);
        sanitized.fields = [
            ...authFields,
            ...sanitized.fields,
        ];
    }
    // /////////////////////////////////
    // Sanitize fields
    // /////////////////////////////////
    const validRelationships = config.collections.map((c) => c.slug);
    sanitized.fields = (0, sanitize_1.default)(sanitized.fields, validRelationships);
    return sanitized;
};
exports.default = sanitizeCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29sbGVjdGlvbnMvY29uZmlnL3Nhbml0aXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMERBQThCO0FBRTlCLDRFQUEwRDtBQUMxRCw4RUFBc0Q7QUFDdEQsc0VBQXdEO0FBQ3hELDBFQUE0RDtBQUM1RCxzRkFBd0U7QUFDeEUsb0ZBQXNFO0FBQ3RFLGdGQUE4RDtBQUM5RCwrREFBNEQ7QUFDNUQseUNBQW9EO0FBRXBELHNEQUFvRTtBQUNwRSwyRUFBMEQ7QUFDMUQseUZBQWlFO0FBQ2pFLG1GQUEyRDtBQUUzRCxNQUFNLGtCQUFrQixHQUFHLENBQUMsTUFBYyxFQUFFLFVBQTRCLEVBQTZCLEVBQUU7SUFDckcsb0NBQW9DO0lBQ3BDLGlDQUFpQztJQUNqQyxvQ0FBb0M7SUFFcEMsTUFBTSxTQUFTLEdBQXFCLElBQUEsbUJBQUssRUFBQyxtQkFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBRWhFLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBQSxxQkFBVyxFQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLElBQUksSUFBQSwyQkFBWSxFQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVwRSxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUU7UUFDdEIsSUFBSSxTQUFTLENBQUMsUUFBUSxLQUFLLElBQUk7WUFBRSxTQUFTLENBQUMsUUFBUSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBRXhFLElBQUksU0FBUyxDQUFDLFVBQVUsS0FBSyxLQUFLLEVBQUU7WUFDbEMsTUFBTSxJQUFJLDRCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO1FBRUQsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUM3QixJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtnQkFDdEMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUc7b0JBQzFCLFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUFDO2FBQ0g7WUFFRCxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsS0FBSyxJQUFJO2dCQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFFekYsTUFBTSxhQUFhLEdBQUcsSUFBQSx5QkFBZSxFQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsb0JBQWlCLENBQUMsQ0FBQztZQUUzRSxTQUFTLENBQUMsTUFBTSxHQUFHO2dCQUNqQixHQUFHLGFBQWE7Z0JBQ2hCLEdBQUcsU0FBUyxDQUFDLE1BQU07YUFDcEIsQ0FBQztTQUNIO1FBRUQsU0FBUyxDQUFDLFFBQVEsR0FBRyxJQUFBLG1CQUFLLEVBQUMsb0NBQXlCLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzNFO0lBRUQsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO1FBQ3BCLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxJQUFJO1lBQUUsU0FBUyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFckQsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQztRQUMxRSxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoRixTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBRTNJLElBQUksWUFBWSxHQUFHLElBQUEsdUJBQW1CLEVBQUM7WUFDckMsTUFBTTtZQUNOLFVBQVUsRUFBRSxTQUFTO1NBQ3RCLENBQUMsQ0FBQztRQUVILFlBQVksR0FBRyxJQUFBLHlCQUFlLEVBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUUvRCxTQUFTLENBQUMsTUFBTSxHQUFHO1lBQ2pCLEdBQUcsWUFBWTtZQUNmLEdBQUcsU0FBUyxDQUFDLE1BQU07U0FDcEIsQ0FBQztLQUNIO0lBRUQsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFO1FBQ2xCLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBQSxtQkFBSyxFQUFDLHVCQUFZLEVBQUUsT0FBTyxTQUFTLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFL0YsSUFBSSxVQUFVLEdBQUcsY0FBYyxDQUFDO1FBRWhDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDNUIsVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNsRDtRQUVELElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDekIsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJO2dCQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUMvRCxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3hEO1FBRUQsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsRUFBRTtZQUN2QyxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3ZEO1FBRUQsVUFBVSxHQUFHLElBQUEseUJBQWUsRUFBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRTNELFNBQVMsQ0FBQyxNQUFNLEdBQUc7WUFDakIsR0FBRyxVQUFVO1lBQ2IsR0FBRyxTQUFTLENBQUMsTUFBTTtTQUNwQixDQUFDO0tBQ0g7SUFFRCxvQ0FBb0M7SUFDcEMsa0JBQWtCO0lBQ2xCLG9DQUFvQztJQUVwQyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakUsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFBLGtCQUFjLEVBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBRXhFLE9BQU8sU0FBc0MsQ0FBQztBQUNoRCxDQUFDLENBQUM7QUFFRixrQkFBZSxrQkFBa0IsQ0FBQyJ9