"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const deepmerge_1 = __importDefault(require("deepmerge"));
const mongoose_1 = __importDefault(require("mongoose"));
const combineMerge_1 = require("../utilities/combineMerge");
const getSchemaTypeOptions_1 = require("./getSchemaTypeOptions");
const operatorMap_1 = require("./operatorMap");
const sanitizeFormattedValue_1 = require("./sanitizeFormattedValue");
const validOperators = ['like', 'contains', 'in', 'all', 'not_in', 'greater_than_equal', 'greater_than', 'less_than_equal', 'less_than', 'not_equals', 'equals', 'exists', 'near'];
const subQueryOptions = {
    limit: 50,
    lean: true,
};
class ParamParser {
    constructor(model, rawParams, locale) {
        this.parse = this.parse.bind(this);
        this.model = model;
        this.rawParams = rawParams;
        this.locale = locale;
        this.query = {
            searchParams: {},
            sort: false,
        };
    }
    // Entry point to the ParamParser class
    async parse() {
        if (typeof this.rawParams === 'object') {
            for (const key of Object.keys(this.rawParams)) {
                if (key === 'where') {
                    this.query.searchParams = await this.parsePathOrRelation(this.rawParams.where);
                }
                else if (key === 'sort') {
                    this.query.sort = this.rawParams[key];
                }
            }
            return this.query;
        }
        return {};
    }
    async parsePathOrRelation(object) {
        let result = {};
        // We need to determine if the whereKey is an AND, OR, or a schema path
        for (const relationOrPath of Object.keys(object)) {
            if (relationOrPath.toLowerCase() === 'and') {
                const andConditions = object[relationOrPath];
                const builtAndConditions = await this.buildAndOrConditions(andConditions);
                if (builtAndConditions.length > 0)
                    result.$and = builtAndConditions;
            }
            else if (relationOrPath.toLowerCase() === 'or' && Array.isArray(object[relationOrPath])) {
                const orConditions = object[relationOrPath];
                const builtOrConditions = await this.buildAndOrConditions(orConditions);
                if (builtOrConditions.length > 0)
                    result.$or = builtOrConditions;
            }
            else {
                // It's a path - and there can be multiple comparisons on a single path.
                // For example - title like 'test' and title not equal to 'tester'
                // So we need to loop on keys again here to handle each operator independently
                const pathOperators = object[relationOrPath];
                if (typeof pathOperators === 'object') {
                    for (const operator of Object.keys(pathOperators)) {
                        if (validOperators.includes(operator)) {
                            const searchParam = await this.buildSearchParam(this.model.schema, relationOrPath, pathOperators[operator], operator);
                            if ((searchParam === null || searchParam === void 0 ? void 0 : searchParam.value) && (searchParam === null || searchParam === void 0 ? void 0 : searchParam.path)) {
                                result = {
                                    ...result,
                                    [searchParam.path]: searchParam.value,
                                };
                            }
                            else if (typeof (searchParam === null || searchParam === void 0 ? void 0 : searchParam.value) === 'object') {
                                result = (0, deepmerge_1.default)(result, searchParam.value, { arrayMerge: combineMerge_1.combineMerge });
                            }
                        }
                    }
                }
            }
        }
        return result;
    }
    async buildAndOrConditions(conditions) {
        const completedConditions = [];
        // Loop over all AND / OR operations and add them to the AND / OR query param
        // Operations should come through as an array
        for (const condition of conditions) {
            // If the operation is properly formatted as an object
            if (typeof condition === 'object') {
                const result = await this.parsePathOrRelation(condition);
                completedConditions.push(result);
            }
        }
        return completedConditions;
    }
    // Build up an array of auto-localized paths to search on
    // Multiple paths may be possible if searching on properties of relationship fields
    getLocalizedPaths(Model, incomingPath, operator) {
        const { schema } = Model;
        const pathSegments = incomingPath.split('.');
        let paths = [
            {
                path: '',
                complete: false,
                Model,
            },
        ];
        pathSegments.forEach((segment, i) => {
            const lastIncompletePath = paths.find(({ complete }) => !complete);
            const { path } = lastIncompletePath;
            const currentPath = path ? `${path}.${segment}` : segment;
            const currentSchemaType = schema.path(currentPath);
            const currentSchemaPathType = schema.pathType(currentPath);
            if (currentSchemaPathType === 'nested') {
                lastIncompletePath.path = currentPath;
                return;
            }
            const upcomingSegment = pathSegments[i + 1];
            if (currentSchemaType && currentSchemaPathType !== 'adhocOrUndefined') {
                const currentSchemaTypeOptions = (0, getSchemaTypeOptions_1.getSchemaTypeOptions)(currentSchemaType);
                if (currentSchemaTypeOptions.localized) {
                    const localePath = `${currentPath}.${this.locale}`;
                    const localizedSchemaType = schema.path(localePath);
                    if (localizedSchemaType || operator === 'near') {
                        lastIncompletePath.path = localePath;
                        return;
                    }
                    const upcomingPathWithLocale = `${currentPath}.${this.locale}.${upcomingSegment}`;
                    const upcomingSchemaTypeWithLocale = schema.path(upcomingPathWithLocale);
                    if (upcomingSchemaTypeWithLocale) {
                        lastIncompletePath.path = upcomingPathWithLocale;
                        return;
                    }
                }
                lastIncompletePath.path = currentPath;
                return;
            }
            const priorSchemaType = schema.path(path);
            if (priorSchemaType) {
                const priorSchemaTypeOptions = (0, getSchemaTypeOptions_1.getSchemaTypeOptions)(priorSchemaType);
                if (typeof priorSchemaTypeOptions.ref === 'string') {
                    const RefModel = mongoose_1.default.model(priorSchemaTypeOptions.ref);
                    lastIncompletePath.complete = true;
                    const remainingPath = pathSegments.slice(i).join('.');
                    paths = [
                        ...paths,
                        ...this.getLocalizedPaths(RefModel, remainingPath, operator),
                    ];
                    return;
                }
            }
            if (operator === 'near') {
                lastIncompletePath.path = currentPath;
            }
        });
        return paths;
    }
    // Convert the Payload key / value / operator into a MongoDB query
    async buildSearchParam(schema, incomingPath, val, operator) {
        // Replace GraphQL nested field double underscore formatting
        let sanitizedPath = incomingPath.replace(/__/gi, '.');
        if (sanitizedPath === 'id')
            sanitizedPath = '_id';
        const collectionPaths = this.getLocalizedPaths(this.model, sanitizedPath, operator);
        const [{ path }] = collectionPaths;
        if (path) {
            const schemaType = schema.path(path);
            const schemaOptions = (0, getSchemaTypeOptions_1.getSchemaTypeOptions)(schemaType);
            const formattedValue = (0, sanitizeFormattedValue_1.sanitizeQueryValue)(schemaType, path, operator, val);
            // If there are multiple collections to search through,
            // Recursively build up a list of query constraints
            if (collectionPaths.length > 1) {
                // Remove top collection and reverse array
                // to work backwards from top
                const collectionPathsToSearch = collectionPaths.slice(1).reverse();
                const initialRelationshipQuery = {
                    value: {},
                };
                const relationshipQuery = await collectionPathsToSearch.reduce(async (priorQuery, { Model: SubModel, path: subPath }, i) => {
                    const priorQueryResult = await priorQuery;
                    // On the "deepest" collection,
                    // Search on the value passed through the query
                    if (i === 0) {
                        const subQuery = await SubModel.buildQuery({
                            where: {
                                [subPath]: {
                                    [operator]: val,
                                },
                            },
                        }, this.locale);
                        const result = await SubModel.find(subQuery, subQueryOptions);
                        const $in = result.map((doc) => doc._id.toString());
                        if (collectionPathsToSearch.length === 1)
                            return { path, value: { $in } };
                        return {
                            value: { _id: { $in } },
                        };
                    }
                    const subQuery = priorQueryResult.value;
                    const result = await SubModel.find(subQuery, subQueryOptions);
                    const $in = result.map((doc) => doc._id.toString());
                    // If it is the last recursion
                    // then pass through the search param
                    if (i + 1 === collectionPathsToSearch.length) {
                        return { path, value: { $in } };
                    }
                    return {
                        value: {
                            _id: { $in },
                        },
                    };
                }, Promise.resolve(initialRelationshipQuery));
                return relationshipQuery;
            }
            if (operator && validOperators.includes(operator)) {
                const operatorKey = operatorMap_1.operatorMap[operator];
                let overrideQuery = false;
                let query;
                // If there is a ref, this is a relationship or upload field
                // IDs can be either string, number, or ObjectID
                // So we need to build an `or` query for all these types
                if (schemaOptions && (schemaOptions.ref || schemaOptions.refPath)) {
                    overrideQuery = true;
                    query = {
                        $or: [
                            {
                                [path]: {
                                    [operatorKey]: formattedValue,
                                },
                            },
                        ],
                    };
                    if (typeof formattedValue === 'number' || (typeof formattedValue === 'string' && mongoose_1.default.Types.ObjectId.isValid(formattedValue))) {
                        query.$or.push({
                            [path]: {
                                [operatorKey]: formattedValue.toString(),
                            },
                        });
                    }
                    if (typeof formattedValue === 'string') {
                        if (!Number.isNaN(formattedValue)) {
                            query.$or.push({
                                [path]: {
                                    [operatorKey]: parseFloat(formattedValue),
                                },
                            });
                        }
                    }
                }
                // If forced query
                if (overrideQuery) {
                    return {
                        value: query,
                    };
                }
                // Some operators like 'near' need to define a full query
                // so if there is no operator key, just return the value
                if (!operatorKey) {
                    return {
                        path,
                        value: formattedValue,
                    };
                }
                return {
                    path,
                    value: { [operatorKey]: formattedValue },
                };
            }
        }
        return undefined;
    }
}
// This plugin asynchronously builds a list of Mongoose query constraints
// which can then be used in subsequent Mongoose queries.
function buildQueryPlugin(schema) {
    const modifiedSchema = schema;
    async function buildQuery(rawParams, locale) {
        const paramParser = new ParamParser(this, rawParams, locale);
        const params = await paramParser.parse();
        return params.searchParams;
    }
    modifiedSchema.statics.buildQuery = buildQuery;
}
exports.default = buildQueryPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRRdWVyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb25nb29zZS9idWlsZFF1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUN6QywwREFBa0M7QUFDbEMsd0RBQWlEO0FBQ2pELDREQUF5RDtBQUV6RCxpRUFBOEQ7QUFDOUQsK0NBQTRDO0FBQzVDLHFFQUE4RDtBQUU5RCxNQUFNLGNBQWMsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUVuTCxNQUFNLGVBQWUsR0FBRztJQUN0QixLQUFLLEVBQUUsRUFBRTtJQUNULElBQUksRUFBRSxJQUFJO0NBQ1gsQ0FBQztBQXFCRixNQUFNLFdBQVc7SUFjZixZQUFZLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBYztRQUMxQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDWCxZQUFZLEVBQUUsRUFBRTtZQUNoQixJQUFJLEVBQUUsS0FBSztTQUNaLENBQUM7SUFDSixDQUFDO0lBRUQsdUNBQXVDO0lBRXZDLEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxFQUFFO1lBQ3RDLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElB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