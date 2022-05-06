"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge_1 = __importDefault(require("deepmerge"));
const mergeBaseFields = (fields, baseFields) => {
    const mergedFields = [];
    if (fields) {
        baseFields.forEach((baseField) => {
            let matchedIndex = null;
            const match = fields.find((field, i) => {
                if (field.name === baseField.name) {
                    matchedIndex = i;
                    return true;
                }
                return false;
            });
            if (match) {
                const matchCopy = { ...match };
                fields.splice(matchedIndex, 1);
                let mergedField = {
                    ...baseField,
                    ...matchCopy,
                };
                if (baseField.fields && matchCopy.fields) {
                    mergedField.fields = mergeBaseFields(matchCopy.fields, baseField.fields);
                    return mergedFields.push(mergedField);
                }
                mergedField = (0, deepmerge_1.default)(mergedField, matchCopy, { arrayMerge: (_, source) => source });
                return mergedFields.push(mergedField);
            }
            return mergedFields.push(baseField);
        });
        return mergedFields;
    }
    return baseFields;
};
exports.default = mergeBaseFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2VCYXNlRmllbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZpZWxkcy9tZXJnZUJhc2VGaWVsZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwREFBOEI7QUFFOUIsTUFBTSxlQUFlLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLEVBQUU7SUFDN0MsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBRXhCLElBQUksTUFBTSxFQUFFO1FBQ1YsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQy9CLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQztZQUV4QixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNyQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLElBQUksRUFBRTtvQkFDakMsWUFBWSxHQUFHLENBQUMsQ0FBQztvQkFDakIsT0FBTyxJQUFJLENBQUM7aUJBQ2I7Z0JBRUQsT0FBTyxLQUFLLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksS0FBSyxFQUFFO2dCQUNULE1BQU0sU0FBUyxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRS9CLElBQUksV0FBVyxHQUFHO29CQUNoQixHQUFHLFNBQVM7b0JBQ1osR0FBRyxTQUFTO2lCQUNiLENBQUM7Z0JBRUYsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7b0JBQ3hDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN6RSxPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3ZDO2dCQUVELFdBQVcsR0FBRyxJQUFBLG1CQUFLLEVBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQ25GLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUN2QztZQUVELE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sWUFBWSxDQUFDO0tBQ3JCO0lBRUQsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsZUFBZSxDQUFDIn0=