"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flattenTopLevelFields = (fields) => fields.reduce((flattened, field) => {
    if (!field.name && Array.isArray(field.fields)) {
        return [
            ...flattened,
            ...field.fields.filter((subField) => subField.name),
        ];
    }
    return [
        ...flattened,
        field,
    ];
}, []);
exports.default = flattenTopLevelFields;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhdHRlblRvcExldmVsRmllbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxpdGllcy9mbGF0dGVuVG9wTGV2ZWxGaWVsZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLHFCQUFxQixHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQzNFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzlDLE9BQU87WUFDTCxHQUFHLFNBQVM7WUFDWixHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1NBQ3BELENBQUM7S0FDSDtJQUVELE9BQU87UUFDTCxHQUFHLFNBQVM7UUFDWixLQUFLO0tBQ04sQ0FBQztBQUNKLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUVQLGtCQUFlLHFCQUFxQixDQUFDIn0=