"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.point = exports.blocks = exports.radio = exports.select = exports.array = exports.relationship = exports.upload = exports.date = exports.checkbox = exports.richText = exports.code = exports.textarea = exports.email = exports.password = exports.text = exports.number = void 0;
const defaultValue_1 = __importDefault(require("./richText/defaultValue"));
const canUseDOM_1 = __importDefault(require("../utilities/canUseDOM"));
const defaultMessage = 'This field is required.';
const number = (value, { required, min, max }) => {
    const parsedValue = parseInt(value, 10);
    if ((value && typeof parsedValue !== 'number') || (required && Number.isNaN(parsedValue))) {
        return 'Please enter a valid number.';
    }
    if (max && parsedValue > max) {
        return `"${value}" is greater than the max allowed value of ${max}.`;
    }
    if (min && parsedValue < min) {
        return `"${value}" is less than the min allowed value of ${min}.`;
    }
    if (required && typeof parsedValue !== 'number') {
        return defaultMessage;
    }
    return true;
};
exports.number = number;
const text = (value, { minLength, maxLength, required }) => {
    if (value && maxLength && value.length > maxLength) {
        return `This value must be shorter than the max length of ${maxLength} characters.`;
    }
    if (value && minLength && (value === null || value === void 0 ? void 0 : value.length) < minLength) {
        return `This value must be longer than the minimum length of ${minLength} characters.`;
    }
    if (required) {
        if (typeof value !== 'string' || (value === null || value === void 0 ? void 0 : value.length) === 0) {
            return defaultMessage;
        }
    }
    return true;
};
exports.text = text;
const password = (value, { required, maxLength, minLength }) => {
    if (value && maxLength && value.length > maxLength) {
        return `This value must be shorter than the max length of ${maxLength} characters.`;
    }
    if (value && minLength && value.length < minLength) {
        return `This value must be longer than the minimum length of ${minLength} characters.`;
    }
    if (required && !value) {
        return defaultMessage;
    }
    return true;
};
exports.password = password;
const email = (value, { required }) => {
    if ((value && !/\S+@\S+\.\S+/.test(value))
        || (!value && required)) {
        return 'Please enter a valid email address.';
    }
    return true;
};
exports.email = email;
const textarea = (value, { required, maxLength, minLength, }) => {
    if (value && maxLength && value.length > maxLength) {
        return `This value must be shorter than the max length of ${maxLength} characters.`;
    }
    if (value && minLength && value.length < minLength) {
        return `This value must be longer than the minimum length of ${minLength} characters.`;
    }
    if (required && !value) {
        return defaultMessage;
    }
    return true;
};
exports.textarea = textarea;
const code = (value, { required }) => {
    if (required && value === undefined) {
        return defaultMessage;
    }
    return true;
};
exports.code = code;
const richText = (value, { required }) => {
    if (required) {
        const stringifiedDefaultValue = JSON.stringify(defaultValue_1.default);
        if (value && JSON.stringify(value) !== stringifiedDefaultValue)
            return true;
        return 'This field is required.';
    }
    return true;
};
exports.richText = richText;
const checkbox = (value, { required }) => {
    if ((value && typeof value !== 'boolean')
        || (required && typeof value !== 'boolean')) {
        return 'This field can only be equal to true or false.';
    }
    return true;
};
exports.checkbox = checkbox;
const date = (value, { required }) => {
    if (value && !isNaN(Date.parse(value.toString()))) { /* eslint-disable-line */
        return true;
    }
    if (value) {
        return `"${value}" is not a valid date.`;
    }
    if (required) {
        return defaultMessage;
    }
    return true;
};
exports.date = date;
const validateFilterOptions = async (value, { filterOptions, id, user, data, siblingData, relationTo, payload }) => {
    if (!canUseDOM_1.default && typeof filterOptions !== 'undefined' && value) {
        const options = {};
        const collections = typeof relationTo === 'string' ? [relationTo] : relationTo;
        const values = Array.isArray(value) ? value : [value];
        await Promise.all(collections.map(async (collection) => {
            const optionFilter = typeof filterOptions === 'function' ? filterOptions({
                id,
                data,
                siblingData,
                user,
                relationTo: collection,
            }) : filterOptions;
            const valueIDs = [];
            values.forEach((val) => {
                if (typeof val === 'object' && (val === null || val === void 0 ? void 0 : val.value)) {
                    valueIDs.push(val.value);
                }
                if (typeof val === 'string' || typeof val === 'number') {
                    valueIDs.push(val);
                }
            });
            const result = await payload.find({
                collection,
                depth: 0,
                where: {
                    and: [
                        { id: { in: valueIDs } },
                        optionFilter,
                    ],
                },
            });
            options[collection] = result.docs.map((doc) => doc.id);
        }));
        const invalidRelationships = values.filter((val) => {
            let collection;
            let requestedID;
            if (typeof relationTo === 'string') {
                collection = relationTo;
                if (typeof val === 'string' || typeof val === 'number') {
                    requestedID = val;
                }
            }
            if (Array.isArray(relationTo) && typeof val === 'object' && (val === null || val === void 0 ? void 0 : val.relationTo)) {
                collection = val.relationTo;
                requestedID = val.value;
            }
            return options[collection].indexOf(requestedID) === -1;
        });
        if (invalidRelationships.length > 0) {
            return invalidRelationships.reduce((err, invalid, i) => {
                return `${err} ${JSON.stringify(invalid)}${invalidRelationships.length === i + 1 ? ',' : ''} `;
            }, 'This field has the following invalid selections:');
        }
        return true;
    }
    return true;
};
const upload = (value, options) => {
    if (!value && options.required) {
        return defaultMessage;
    }
    return validateFilterOptions(value, options);
};
exports.upload = upload;
const relationship = async (value, options) => {
    if ((!value || (Array.isArray(value) && value.length === 0)) && options.required) {
        return defaultMessage;
    }
    return validateFilterOptions(value, options);
};
exports.relationship = relationship;
const array = (value, { minRows, maxRows, required }) => {
    if (minRows && value < minRows) {
        return `This field requires at least ${minRows} row(s).`;
    }
    if (maxRows && value > maxRows) {
        return `This field requires no more than ${maxRows} row(s).`;
    }
    if (!value && required) {
        return 'This field requires at least one row.';
    }
    return true;
};
exports.array = array;
const select = (value, { options, hasMany, required }) => {
    if (Array.isArray(value) && value.some((input) => !options.some((option) => (option === input || (typeof option !== 'string' && (option === null || option === void 0 ? void 0 : option.value) === input))))) {
        return 'This field has an invalid selection';
    }
    if (typeof value === 'string' && !options.some((option) => (option === value || (typeof option !== 'string' && option.value === value)))) {
        return 'This field has an invalid selection';
    }
    if (required && ((typeof value === 'undefined' || value === null) || (hasMany && Array.isArray(value) && (value === null || value === void 0 ? void 0 : value.length) === 0))) {
        return defaultMessage;
    }
    return true;
};
exports.select = select;
const radio = (value, { options, required }) => {
    const stringValue = String(value);
    if ((typeof value !== 'undefined' || !required) && (options.find((option) => String(typeof option !== 'string' && (option === null || option === void 0 ? void 0 : option.value)) === stringValue)))
        return true;
    return defaultMessage;
};
exports.radio = radio;
const blocks = (value, { maxRows, minRows, required }) => {
    if (minRows && value < minRows) {
        return `This field requires at least ${minRows} row(s).`;
    }
    if (maxRows && value > maxRows) {
        return `This field requires no more than ${maxRows} row(s).`;
    }
    if (!value && required) {
        return 'This field requires at least one row.';
    }
    return true;
};
exports.blocks = blocks;
const point = (value = ['', ''], { required }) => {
    const lng = parseFloat(String(value[0]));
    const lat = parseFloat(String(value[1]));
    if (required && ((value[0] && value[1] && typeof lng !== 'number' && typeof lat !== 'number')
        || (Number.isNaN(lng) || Number.isNaN(lat))
        || (Array.isArray(value) && value.length !== 2))) {
        return 'This field requires two numbers';
    }
    if ((value[1] && Number.isNaN(lng)) || (value[0] && Number.isNaN(lat))) {
        return 'This field has an invalid input';
    }
    return true;
};
exports.point = point;
exports.default = {
    number: exports.number,
    text: exports.text,
    password: exports.password,
    email: exports.email,
    textarea: exports.textarea,
    code: exports.code,
    richText: exports.richText,
    checkbox: exports.checkbox,
    date: exports.date,
    upload: exports.upload,
    relationship: exports.relationship,
    array: exports.array,
    select: exports.select,
    radio: exports.radio,
    blocks: exports.blocks,
    point: exports.point,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmllbGRzL3ZhbGlkYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJFQUEyRDtBQXFCM0QsdUVBQStDO0FBRS9DLE1BQU0sY0FBYyxHQUFHLHlCQUF5QixDQUFDO0FBRTFDLE1BQU0sTUFBTSxHQUE0QyxDQUFDLEtBQWEsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtJQUN2RyxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRXhDLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxXQUFXLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFO1FBQ3pGLE9BQU8sOEJBQThCLENBQUM7S0FDdkM7SUFFRCxJQUFJLEdBQUcsSUFBSSxXQUFXLEdBQUcsR0FBRyxFQUFFO1FBQzVCLE9BQU8sSUFBSSxLQUFLLDhDQUE4QyxHQUFHLEdBQUcsQ0FBQztLQUN0RTtJQUVELElBQUksR0FBRyxJQUFJLFdBQVcsR0FBRyxHQUFHLEVBQUU7UUFDNUIsT0FBTyxJQUFJLEtBQUssMkNBQTJDLEdBQUcsR0FBRyxDQUFDO0tBQ25FO0lBRUQsSUFBSSxRQUFRLElBQUksT0FBTyxXQUFXLEtBQUssUUFBUSxFQUFFO1FBQy9DLE9BQU8sY0FBYyxDQUFDO0tBQ3ZCO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUM7QUFwQlcsUUFBQSxNQUFNLFVBb0JqQjtBQUVLLE1BQU0sSUFBSSxHQUEwQyxDQUFDLEtBQWEsRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRTtJQUMvRyxJQUFJLEtBQUssSUFBSSxTQUFTLElBQUksS0FBSyxDQUFDLE1BQU0s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