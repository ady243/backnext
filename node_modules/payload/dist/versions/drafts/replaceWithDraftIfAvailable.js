"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const auth_1 = require("../../auth");
const flattenWhereConstraints_1 = __importDefault(require("../../utilities/flattenWhereConstraints"));
const sanitizeInternalFields_1 = __importDefault(require("../../utilities/sanitizeInternalFields"));
const appendVersionToQueryKey_1 = require("./appendVersionToQueryKey");
const replaceWithDraftIfAvailable = async ({ payload, entity, doc, locale, accessResult, }) => {
    if ((0, types_1.docHasTimestamps)(doc)) {
        const VersionModel = payload.versions[entity.slug];
        let useEstimatedCount = false;
        const queryToBuild = {
            where: {
                and: [
                    {
                        parent: {
                            equals: doc.id,
                        },
                    },
                    {
                        'version._status': {
                            equals: 'draft',
                        },
                    },
                    {
                        updatedAt: {
                            greater_than: doc.updatedAt,
                        },
                    },
                ],
            },
        };
        if ((0, auth_1.hasWhereAccessResult)(accessResult)) {
            const versionAccessResult = (0, appendVersionToQueryKey_1.appendVersionToQueryKey)(accessResult);
            queryToBuild.where.and.push(versionAccessResult);
        }
        const constraints = (0, flattenWhereConstraints_1.default)(queryToBuild);
        useEstimatedCount = constraints.some((prop) => Object.keys(prop).some((key) => key === 'near'));
        const query = await VersionModel.buildQuery(queryToBuild, locale);
        let draft = await VersionModel.findOne(query, {}, {
            lean: true,
            useEstimatedCount,
            sort: { updatedAt: 'desc' },
        });
        if (!draft) {
            return doc;
        }
        draft = JSON.parse(JSON.stringify(draft));
        draft = (0, sanitizeInternalFields_1.default)(draft);
        // Disregard all other draft content at this point,
        // Only interested in the version itself.
        // Operations will handle firing hooks, etc.
        return {
            id: doc.id,
            ...draft.version,
            createdAt: draft.createdAt,
            updatedAt: draft.updatedAt,
        };
    }
    return doc;
};
exports.default = replaceWithDraftIfAvailable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZVdpdGhEcmFmdElmQXZhaWxhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3ZlcnNpb25zL2RyYWZ0cy9yZXBsYWNlV2l0aERyYWZ0SWZBdmFpbGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSx1Q0FBc0Q7QUFDdEQscUNBQWtEO0FBR2xELHNHQUE4RTtBQUM5RSxvR0FBNEU7QUFDNUUsdUVBQW9FO0FBV3BFLE1BQU0sMkJBQTJCLEdBQUcsS0FBSyxFQUF3QixFQUMvRCxPQUFPLEVBQ1AsTUFBTSxFQUNOLEdBQUcsRUFDSCxNQUFNLEVBQ04sWUFBWSxHQUNDLEVBQWMsRUFBRTtJQUM3QixJQUFJLElBQUEsd0JBQWdCLEVBQUMsR0FBRyxDQUFDLEVBQUU7UUFDekIsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFvQixDQUFDO1FBRXRFLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDO1FBQzlCLE1BQU0sWUFBWSxHQUFxQjtZQUNyQyxLQUFLLEVBQUU7Z0JBQ0wsR0FBRyxFQUFFO29CQUNIO3dCQUNFLE1BQU0sRUFBRTs0QkFDTixNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7eUJBQ2Y7cUJBQ0Y7b0JBQ0Q7d0JBQ0UsaUJBQWlCLEVBQUU7NEJBQ2pCLE1BQU0sRUFBRSxPQUFPO3lCQUNoQjtxQkFDRjtvQkFDRDt3QkFDRSxTQUFTLEVBQUU7NEJBQ1QsWUFBWSxFQUFFLEdBQUcsQ0FBQyxTQUFTO3lCQUM1QjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztRQUVGLElBQUksSUFBQSwyQkFBb0IsRUFBQyxZQUFZLENBQUMsRUFBRTtZQUN0QyxNQUFNLG1CQUFtQixHQUFHLElBQUEsaURBQXVCLEVBQUMsWUFBWSxDQUFDLENBQUM7WUFDbEUsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDbEQ7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFBLGlDQUF1QixFQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFELGlCQUFpQixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoRyxNQUFNLEtBQUssR0FBRyxNQUFNLFlBQVksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWxFLElBQUksS0FBSyxHQUFHLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2hELElBQUksRUFBRSxJQUFJO1lBQ1YsaUJBQWlCO1lBQ2pCLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUU7U0FDNUIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE9BQU8sR0FBRyxDQUFDO1NBQ1o7UUFFRCxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDMUMsS0FBSyxHQUFHLElBQUEsZ0NBQXNCLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsbURBQW1EO1FBQ25ELHlDQUF5QztRQUN6Qyw0Q0FBNEM7UUFDNUMsT0FBTztZQUNMLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUNWLEdBQUcsS0FBSyxDQUFDLE9BQU87WUFDaEIsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQzFCLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUztTQUMzQixDQUFDO0tBQ0g7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVGLGtCQUFlLDJCQUEyQixDQUFDIn0=