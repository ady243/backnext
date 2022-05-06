"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimeTypeValidator = void 0;
const mimeTypeValidator = (mimeTypes) => (val) => {
    const cleanedMimeTypes = mimeTypes.map((v) => v.replace('*', ''));
    if (!val) {
        return 'Invalid file type';
    }
    return !cleanedMimeTypes.some((v) => val.startsWith(v))
        ? `Invalid file type: '${val}'`
        : true;
};
exports.mimeTypeValidator = mimeTypeValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWltZVR5cGVWYWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXBsb2Fkcy9taW1lVHlwZVZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLGlCQUFpQixHQUFHLENBQUMsU0FBbUIsRUFBWSxFQUFFLENBQUMsQ0FBQyxHQUFXLEVBQUUsRUFBRTtJQUNsRixNQUFNLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFbEUsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNSLE9BQU8sbUJBQW1CLENBQUM7S0FDNUI7SUFFRCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyx1QkFBdUIsR0FBRyxHQUFHO1FBQy9CLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDWCxDQUFDLENBQUM7QUFWVyxRQUFBLGlCQUFpQixxQkFVNUIifQ==