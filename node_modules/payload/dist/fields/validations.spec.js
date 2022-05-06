"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validations_1 = require("./validations");
const minLengthMessage = (length) => `This value must be longer than the minimum length of ${length} characters.`;
const maxLengthMessage = (length) => `This value must be shorter than the max length of ${length} characters.`;
const requiredMessage = 'This field is required.';
let options = {
    operation: 'create',
    data: undefined,
    siblingData: undefined,
};
describe('Field Validations', () => {
    describe('text', () => {
        it('should validate', () => {
            const val = 'test';
            const result = (0, validations_1.text)(val, options);
            expect(result).toBe(true);
        });
        it('should show required message', () => {
            const val = undefined;
            const result = (0, validations_1.text)(val, { ...options, required: true });
            expect(result).toBe(requiredMessage);
        });
        it('should handle undefined', () => {
            const val = undefined;
            const result = (0, validations_1.text)(val, options);
            expect(result).toBe(true);
        });
        it('should validate maxLength', () => {
            const val = 'toolong';
            const result = (0, validations_1.text)(val, { ...options, maxLength: 5 });
            expect(result).toBe(maxLengthMessage(5));
        });
        it('should validate minLength', () => {
            const val = 'short';
            const result = (0, validations_1.text)(val, { ...options, minLength: 10 });
            expect(result).toBe(minLengthMessage(10));
        });
        it('should validate maxLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.text)(val, { ...options, maxLength: 5 });
            expect(result).toBe(true);
        });
        it('should validate minLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.text)(val, { ...options, minLength: 10 });
            expect(result).toBe(true);
        });
    });
    describe('textarea', () => {
        options = { ...options, field: { type: 'textarea', name: 'test' } };
        it('should validate', () => {
            const val = 'test';
            const result = (0, validations_1.textarea)(val, options);
            expect(result).toBe(true);
        });
        it('should show required message', () => {
            const val = undefined;
            const result = (0, validations_1.textarea)(val, { ...options, required: true });
            expect(result).toBe(requiredMessage);
        });
        it('should handle undefined', () => {
            const val = undefined;
            const result = (0, validations_1.textarea)(val, options);
            expect(result).toBe(true);
        });
        it('should validate maxLength', () => {
            const val = 'toolong';
            const result = (0, validations_1.textarea)(val, { ...options, maxLength: 5 });
            expect(result).toBe(maxLengthMessage(5));
        });
        it('should validate minLength', () => {
            const val = 'short';
            const result = (0, validations_1.textarea)(val, { ...options, minLength: 10 });
            expect(result).toBe(minLengthMessage(10));
        });
        it('should validate maxLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.textarea)(val, { ...options, maxLength: 5 });
            expect(result).toBe(true);
        });
        it('should validate minLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.textarea)(val, { ...options, minLength: 10 });
            expect(result).toBe(true);
        });
    });
    describe('password', () => {
        options.type = 'password';
        options.name = 'test';
        it('should validate', () => {
            const val = 'test';
            const result = (0, validations_1.password)(val, options);
            expect(result).toBe(true);
        });
        it('should show required message', () => {
            const val = undefined;
            const result = (0, validations_1.password)(val, { ...options, required: true });
            expect(result).toBe(requiredMessage);
        });
        it('should handle undefined', () => {
            const val = undefined;
            const result = (0, validations_1.password)(val, options);
            expect(result).toBe(true);
        });
        it('should validate maxLength', () => {
            const val = 'toolong';
            const result = (0, validations_1.password)(val, { ...options, maxLength: 5 });
            expect(result).toBe(maxLengthMessage(5));
        });
        it('should validate minLength', () => {
            const val = 'short';
            const result = (0, validations_1.password)(val, { ...options, minLength: 10 });
            expect(result).toBe(minLengthMessage(10));
        });
        it('should validate maxLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.password)(val, { ...options, maxLength: 5 });
            expect(result).toBe(true);
        });
        it('should validate minLength with no value', () => {
            const val = undefined;
            const result = (0, validations_1.password)(val, { ...options, minLength: 10 });
            expect(result).toBe(true);
        });
    });
    describe('point', () => {
        options.type = 'point';
        options.name = 'point';
        it('should validate numbers', () => {
            const val = ['0.1', '0.2'];
            const result = (0, validations_1.point)(val, options);
            expect(result).toBe(true);
        });
        it('should validate strings that could be numbers', () => {
            const val = ['0.1', '0.2'];
            const result = (0, validations_1.point)(val, options);
            expect(result).toBe(true);
        });
        it('should show required message when undefined', () => {
            const val = undefined;
            const result = (0, validations_1.point)(val, { ...options, required: true });
            expect(result).not.toBe(true);
        });
        it('should show required message when array', () => {
            const val = [];
            const result = (0, validations_1.point)(val, { ...options, required: true });
            expect(result).not.toBe(true);
        });
        it('should show required message when array of undefined', () => {
            const val = [undefined, undefined];
            const result = (0, validations_1.point)(val, { ...options, required: true });
            expect(result).not.toBe(true);
        });
        it('should handle undefined not required', () => {
            const val = undefined;
            const result = (0, validations_1.password)(val, options);
            expect(result).toBe(true);
        });
        it('should handle empty array not required', () => {
            const val = [];
            const result = (0, validations_1.point)(val, options);
            expect(result).toBe(true);
        });
        it('should handle array of undefined not required', () => {
            const val = [undefined, undefined];
            const result = (0, validations_1.point)(val, options);
            expect(result).toBe(true);
        });
        it('should prevent text input', () => {
            const val = ['bad', 'input'];
            const result = (0, validations_1.point)(val, options);
            expect(result).not.toBe(true);
        });
        it('should prevent missing value', () => {
            const val = [0.1];
            const result = (0, validations_1.point)(val, options);
            expect(result).not.toBe(true);
        });
    });
    describe('select', () => {
        options.type = 'select';
        options.options = ['one', 'two', 'three'];
        const optionsRequired = {
            ...options,
            required: true,
            options: [{
                    value: 'one',
                    label: 'One',
                }, {
                    value: 'two',
                    label: 'two',
                }, {
                    value: 'three',
                    label: 'three',
                }],
        };
        const optionsWithEmptyString = {
            ...options,
            options: [{
                    value: '',
                    label: 'None',
                }, {
                    value: 'option',
                    label: 'Option',
                }],
        };
        it('should allow valid input', () => {
            const val = 'one';
            const result = (0, validations_1.select)(val, options);
            expect(result).toStrictEqual(true);
        });
        it('should prevent invalid input', () => {
            const val = 'bad';
            const result = (0, validations_1.select)(val, options);
            expect(result).not.toStrictEqual(true);
        });
        it('should allow null input', () => {
            const val = null;
            const result = (0, validations_1.select)(val, options);
            expect(result).toStrictEqual(true);
        });
        it('should allow undefined input', () => {
            let val;
            const result = (0, validations_1.select)(val, options);
            expect(result).toStrictEqual(true);
        });
        it('should prevent empty string input', () => {
            const val = '';
            const result = (0, validations_1.select)(val, options);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent undefined input with required', () => {
            let val;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent empty string input with required', () => {
            const result = (0, validations_1.select)('', optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent undefined input with required and hasMany', () => {
            let val;
            options.hasMany = true;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent empty array input with required and hasMany', () => {
            optionsRequired.hasMany = true;
            const result = (0, validations_1.select)([], optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent empty string array input with required and hasMany', () => {
            options.hasMany = true;
            const result = (0, validations_1.select)([''], optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should prevent null input with required and hasMany', () => {
            const val = null;
            options.hasMany = true;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should allow valid input with option objects', () => {
            const val = 'one';
            options.hasMany = false;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).toStrictEqual(true);
        });
        it('should prevent invalid input with option objects', () => {
            const val = 'bad';
            options.hasMany = false;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
        it('should allow empty string input with option object', () => {
            const val = '';
            const result = (0, validations_1.select)(val, optionsWithEmptyString);
            expect(result).toStrictEqual(true);
        });
        it('should allow empty string input with option object and required', () => {
            const val = '';
            optionsWithEmptyString.required = true;
            const result = (0, validations_1.select)(val, optionsWithEmptyString);
            expect(result).toStrictEqual(true);
        });
        it('should allow valid input with hasMany', () => {
            const val = ['one', 'two'];
            const result = (0, validations_1.select)(val, options);
            expect(result).toStrictEqual(true);
        });
        it('should prevent invalid input with hasMany', () => {
            const val = ['one', 'bad'];
            const result = (0, validations_1.select)(val, options);
            expect(result).not.toStrictEqual(true);
        });
        it('should allow valid input with hasMany option objects', () => {
            const val = ['one', 'three'];
            optionsRequired.hasMany = true;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).toStrictEqual(true);
        });
        it('should prevent invalid input with hasMany option objects', () => {
            const val = ['three', 'bad'];
            optionsRequired.hasMany = true;
            const result = (0, validations_1.select)(val, optionsRequired);
            expect(result).not.toStrictEqual(true);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbnMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9maWVsZHMvdmFsaWRhdGlvbnMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUF3RTtBQUd4RSxNQUFNLGdCQUFnQixHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyx3REFBd0QsTUFBTSxjQUFjLENBQUM7QUFDMUgsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFLENBQUMscURBQXFELE1BQU0sY0FBYyxDQUFDO0FBQ3ZILE1BQU0sZUFBZSxHQUFHLHlCQUF5QixDQUFDO0FBQ2xELElBQUksT0FBTyxHQUFtQztJQUM1QyxTQUFTLEVBQUUsUUFBUTtJQUNuQixJQUFJLEVBQUUsU0FBUztJQUNmLFdBQVcsRUFBRSxTQUFTO0NBQ3ZCLENBQUM7QUFFRixRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO0lBQ2pDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7WUFDekIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDO1lBQ25CLE1BQU0sTUFBTSxHQUFHLElBQUEsa0JBQUksRUFBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDO1lBQ3RCLE1BQU0sTUFBTSxHQUFHLElBQUEsa0JBQUksRUFBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFD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