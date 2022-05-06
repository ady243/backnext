import { unflatten as flatleyUnflatten } from 'flatley';
const reduceFieldsToValues = (fields, unflatten) => {
    const data = {};
    Object.keys(fields).forEach((key) => {
        if (!fields[key].disableFormData) {
            data[key] = fields[key].value;
        }
    });
    if (unflatten) {
        return flatleyUnflatten(data, { safe: true });
    }
    return data;
};
export default reduceFieldsToValues;
