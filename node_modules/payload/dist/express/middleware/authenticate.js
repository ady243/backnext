"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
exports.default = (config) => {
    const methods = config.collections.reduce((enabledMethods, collection) => {
        if (typeof collection.auth === 'object' && collection.auth.useAPIKey) {
            const collectionMethods = [...enabledMethods];
            collectionMethods.unshift(`${collection.slug}-api-key`);
            return collectionMethods;
        }
        return enabledMethods;
    }, ['jwt', 'anonymous']);
    const authenticate = passport_1.default.authenticate(methods, { session: false });
    return authenticate;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aGVudGljYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2V4cHJlc3MvbWlkZGxld2FyZS9hdXRoZW50aWNhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBZ0M7QUFNaEMsa0JBQWUsQ0FBQyxNQUF1QixFQUF1QixFQUFFO0lBQzlELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxFQUFFLFVBQVUsRUFBRSxFQUFFO1FBQ3ZFLElBQUksT0FBTyxVQUFVLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNwRSxNQUFNLGlCQUFpQixHQUFHLENBQUMsR0FBRyxjQUFjLENBQUMsQ0FBQztZQUM5QyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQztZQUN4RCxPQUFPLGlCQUFpQixDQUFDO1NBQzFCO1FBRUQsT0FBTyxjQUFjLENBQUM7SUFDeEIsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFFekIsTUFBTSxZQUFZLEdBQUcsa0JBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDeEUsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQyxDQUFDIn0=