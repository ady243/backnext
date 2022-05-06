"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeQueryValue = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const createArrayFromCommaDelineated_1 = require("./createArrayFromCommaDelineated");
const getSchemaTypeOptions_1 = require("./getSchemaTypeOptions");
const sanitizeQueryValue = (schemaType, path, operator, val) => {
    let formattedValue = val;
    const schemaOptions = (0, getSchemaTypeOptions_1.getSchemaTypeOptions)(schemaType);
    // Disregard invalid _ids
    if (path === '_id' && typeof val === 'string' && val.split(',').length === 1) {
        if ((schemaType === null || schemaType === void 0 ? void 0 : schemaType.instance) === 'ObjectID') {
            const isValid = mongoose_1.default.Types.ObjectId.isValid(val);
            if (!isValid) {
                return undefined;
            }
        }
        if ((schemaType === null || schemaType === void 0 ? void 0 : schemaType.instance) === 'Number') {
            const parsedNumber = parseFloat(val);
            if (Number.isNaN(parsedNumber)) {
                return undefined;
            }
        }
    }
    // Cast incoming values as proper searchable types
    if ((schemaType === null || schemaType === void 0 ? void 0 : schemaType.instance) === 'Boolean' && typeof val === 'string') {
        if (val.toLowerCase() === 'true')
            formattedValue = true;
        if (val.toLowerCase() === 'false')
            formattedValue = false;
    }
    if ((schemaType === null || schemaType === void 0 ? void 0 : schemaType.instance) === 'Number' && typeof val === 'string') {
        formattedValue = Number(val);
    }
    if (((schemaOptions === null || schemaOptions === void 0 ? void 0 : schemaOptions.ref) || (schemaOptions === null || schemaOptions === void 0 ? void 0 : schemaOptions.refPath)) && val === 'null') {
        formattedValue = null;
    }
    // Set up specific formatting necessary by operators
    if (operator === 'near') {
        let lng;
        let lat;
        let maxDistance;
        let minDistance;
        if (Array.isArray(formattedValue)) {
            [lng, lat, maxDistance, minDistance] = formattedValue;
        }
        if (typeof formattedValue === 'string') {
            [lng, lat, maxDistance, minDistance] = (0, createArrayFromCommaDelineated_1.createArrayFromCommaDelineated)(formattedValue);
        }
        if (!lng || !lat || (!maxDistance && !minDistance)) {
            formattedValue = undefined;
        }
        else {
            formattedValue = {
                $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            };
            if (maxDistance)
                formattedValue.$maxDistance = parseFloat(maxDistance);
            if (minDistance)
                formattedValue.$minDistance = parseFloat(minDistance);
        }
    }
    if (['all', 'not_in', 'in'].includes(operator) && typeof formattedValue === 'string') {
        formattedValue = (0, createArrayFromCommaDelineated_1.createArrayFromCommaDelineated)(formattedValue);
    }
    if (schemaOptions && (schemaOptions.ref || schemaOptions.refPath) && operator === 'in') {
        if (Array.isArray(formattedValue)) {
            formattedValue = formattedValue.reduce((formattedValues, inVal) => {
                const newValues = [inVal];
                if (mongoose_1.default.Types.ObjectId.isValid(inVal))
                    newValues.push(new mongoose_1.default.Types.ObjectId(inVal));
                const parsedNumber = parseFloat(inVal);
                if (!Number.isNaN(parsedNumber))
                    newValues.push(parsedNumber);
                return [
                    ...formattedValues,
                    ...newValues,
                ];
            }, []);
        }
    }
    if (path !== '_id') {
        if (operator === 'contains') {
            formattedValue = { $regex: formattedValue, $options: 'i' };
        }
        if (operator === 'like' && typeof formattedValue === 'string') {
            const words = formattedValue.split(' ');
            const regex = words.reduce((pattern, word, i) => {
                return `${pattern}(?=.*\\b${word}\\b)${i + 1 === words.length ? '.+' : ''}`;
            }, '');
            formattedValue = { $regex: new RegExp(regex), $options: 'i' };
        }
    }
    if (operator === 'exists') {
        formattedValue = (formattedValue === 'true' || formattedValue === true);
    }
    return formattedValue;
};
exports.sanitizeQueryValue = sanitizeQueryValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemVGb3JtYXR0ZWRWYWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb25nb29zZS9zYW5pdGl6ZUZvcm1hdHRlZFZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdEQUFnRDtBQUNoRCxxRkFBa0Y7QUFDbEYsaUVBQThEO0FBRXZELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxVQUFzQixFQUFFLElBQVksRUFBRSxRQUFnQixFQUFFLEdBQVEsRUFBVyxFQUFFO0lBQzlHLElBQUksY0FBYyxHQUFHLEdBQUcsQ0FBQztJQUN6QixNQUFNLGFBQWEsR0FBRyxJQUFBLDJDQUFvQixFQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXZELHlCQUF5QjtJQUV6QixJQUFJLElBQUksS0FBSyxLQUFLLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUM1RSxJQUFJLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLFFBQVEsTUFBSyxVQUFVLEVBQUU7WUFDdkMsTUFBTSxPQUFPLEdBQUcsa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVyRCxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1NBQ0Y7UUFFRCxJQUFJLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLFFBQVEsTUFBSyxRQUFRLEVBQUU7WUFDckMsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXJDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDOUIsT0FBTyxTQUFTLENBQUM7YUFDbEI7U0FDRjtLQUNGO0lBRUQsa0RBQWtEO0lBRWxELElBQUksQ0FBQSxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsUUFBUSxNQUFLLFNBQVMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7UUFDakUsSUFBSSxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTTtZQUFFLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDeEQsSUFBSSxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTztZQUFFLGNBQWMsR0FBRyxLQUFLLENBQUM7S0FDM0Q7SUFFRCxJQUFJLENBQUEsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLFFBQVEsTUFBSyxRQUFRLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1FBQ2hFLGNBQWMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDOUI7SUFFRCxJQUFJLENBQUMsQ0FBQSxhQUFhLGFBQWIsYUFBYSx1QkFBYixhQUFhLENBQUUsR0FBRyxNQUFJLGFBQWEsYUFBYixhQUFhLHVCQUFiLGFBQWEsQ0FBRSxPQUFPLENBQUEsQ0FBQyxJQUFJLEdBQUcsS0FBSyxNQUFNLEVBQUU7UUFDcEUsY0FBYyxHQUFHLElBQUksQ0FBQztLQUN2QjtJQUVELG9EQUFvRDtJQUVwRCxJQUFJLFFBQVEsS0FBSyxNQUFNLEVBQUU7UUFDdkIsSUFBSSxHQUFHLENBQUM7UUFDUixJQUFJLEdBQUcsQ0FBQztRQUNSLElBQUksV0FBVyxDQUFDO1FBQ2hCLElBQUksV0FBVyxDQUFDO1FBRWhCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUNqQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxHQUFHLGNBQWMsQ0FBQztTQUN2RDtRQUVELElBQUksT0FBTyxjQUFjLEtBQUssUUFBUSxFQUFFO1lBQ3RDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLEdBQUcsSUFBQSwrREFBOEIsRUFBQyxjQUFjLENBQUMsQ0FBQztTQUN2RjtRQUVELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ2xELGNBQWMsR0FBRyxTQUFTLENBQUM7U0FDNUI7YUFBTTtZQUNMLGNBQWMsR0FBRztnQkFDZixTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTthQUM5RSxDQUFDO1lBRUYsSUFBSSxXQUFXO2dCQUFFLGNBQWMsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksV0FBVztnQkFBRSxjQUFjLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN4RTtLQUNGO0lBRUQsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLE9BQU8sY0FBYyxLQUFLLFFBQVEsRUFBRTtRQUNwRixjQUFjLEdBQUcsSUFBQSwrREFBOEIsRUFBQyxjQUFjLENBQUMsQ0FBQztLQUNqRTtJQUVELElBQUksYUFBYSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtRQUN0RixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDakMsY0FBYyxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ2hFLE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFCLElBQUksa0JBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7b0JBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLGtCQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUUvRixNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztvQkFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUU5RCxPQUFPO29CQUNMLEdBQUcsZUFBZTtvQkFDbEIsR0FBRyxTQUFTO2lCQUNiLENBQUM7WUFDSixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDUjtLQUNGO0lBRUQsSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO1FBQ2xCLElBQUksUUFBUSxLQUFLLFVBQVUsRUFBRTtZQUMzQixjQUFjLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQztTQUM1RDtRQUVELElBQUksUUFBUSxLQUFLLE1BQU0sSUFBSSxPQUFPLGNBQWMsS0FBSyxRQUFRLEVBQUU7WUFDN0QsTUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDOUMsT0FBTyxHQUFHLE9BQU8sV0FBVyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzlFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVQLGNBQWMsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUM7U0FDL0Q7S0FDRjtJQUVELElBQUksUUFBUSxLQUFLLFFBQVEsRUFBRTtRQUN6QixjQUFjLEdBQUcsQ0FBQyxjQUFjLEtBQUssTUFBTSxJQUFJLGNBQWMsS0FBSyxJQUFJLENBQUMsQ0FBQztLQUN6RTtJQUVELE9BQU8sY0FBYyxDQUFDO0FBQ3hCLENBQUMsQ0FBQztBQTVHVyxRQUFBLGtCQUFrQixzQkE0RzdCIn0=