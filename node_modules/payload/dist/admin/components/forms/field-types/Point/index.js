import React, { useCallback } from 'react';
import useField from '../../useField';
import Label from '../../Label';
import Error from '../../Error';
import FieldDescription from '../../FieldDescription';
import withCondition from '../../withCondition';
import { point } from '../../../../../fields/validations';
import './index.scss';
const baseClass = 'point';
const PointField = (props) => {
    const { name, path: pathFromProps, required, validate = point, label, admin: { readOnly, style, className, width, step, placeholder, description, condition, } = {}, } = props;
    const path = pathFromProps || name;
    const memoizedValidate = useCallback((value, options) => {
        return validate(value, { ...options, required });
    }, [validate, required]);
    const { value = [null, null], showError, setValue, errorMessage, } = useField({
        path,
        validate: memoizedValidate,
        enableDebouncedValue: true,
        condition,
    });
    const handleChange = useCallback((e, index) => {
        let val = parseFloat(e.target.value);
        if (Number.isNaN(val)) {
            val = e.target.value;
        }
        const coordinates = [...value];
        coordinates[index] = val;
        setValue(coordinates);
    }, [setValue, value]);
    const classes = [
        'field-type',
        baseClass,
        className,
        showError && 'error',
        readOnly && 'read-only',
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: classes, style: {
            ...style,
            width,
        } },
        React.createElement(Error, { showError: showError, message: errorMessage }),
        React.createElement("ul", { className: `${baseClass}__wrap` },
            React.createElement("li", null,
                React.createElement(Label, { htmlFor: `${path}.longitude`, label: `${label} - Longitude`, required: required }),
                React.createElement("input", { value: (value && typeof value[0] === 'number') ? value[0] : '', onChange: (e) => handleChange(e, 0), disabled: readOnly, placeholder: placeholder, type: "number", id: `${path}.longitude`, name: `${path}.longitude`, step: step })),
            React.createElement("li", null,
                React.createElement(Label, { htmlFor: `${path}.latitude`, label: `${label} - Latitude`, required: required }),
                React.createElement("input", { value: (value && typeof value[1] === 'number') ? value[1] : '', onChange: (e) => handleChange(e, 1), disabled: readOnly, placeholder: placeholder, type: "number", id: `${path}.latitude`, name: `${path}.latitude`, step: step }))),
        React.createElement(FieldDescription, { value: value, description: description })));
};
export default withCondition(PointField);
