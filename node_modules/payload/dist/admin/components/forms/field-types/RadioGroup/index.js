import React, { useCallback } from 'react';
import useField from '../../useField';
import withCondition from '../../withCondition';
import Error from '../../Error';
import Label from '../../Label';
import FieldDescription from '../../FieldDescription';
import RadioInput from './RadioInput';
import { radio } from '../../../../../fields/validations';
import { optionIsObject } from '../../../../../fields/config/types';
import './index.scss';
const baseClass = 'radio-group';
const RadioGroup = (props) => {
    const { name, path: pathFromProps, required, validate = radio, label, admin: { readOnly, layout = 'horizontal', style, className, width, description, condition, } = {}, options, } = props;
    const path = pathFromProps || name;
    const memoizedValidate = useCallback((value, validationOptions) => {
        return validate(value, { ...validationOptions, options, required });
    }, [validate, options, required]);
    const { value, showError, errorMessage, setValue, } = useField({
        path,
        validate: memoizedValidate,
        condition,
    });
    const classes = [
        'field-type',
        baseClass,
        className,
        `${baseClass}--layout-${layout}`,
        showError && 'error',
        readOnly && `${baseClass}--read-only`,
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: classes, style: {
            ...style,
            width,
        } },
        React.createElement("div", { className: `${baseClass}__error-wrap` },
            React.createElement(Error, { showError: showError, message: errorMessage })),
        React.createElement(Label, { htmlFor: path, label: label, required: required }),
        React.createElement("ul", { className: `${baseClass}--group` }, options.map((option) => {
            let optionValue = '';
            if (optionIsObject(option)) {
                optionValue = option.value;
            }
            else {
                optionValue = option;
            }
            const isSelected = String(optionValue) === String(value);
            return (React.createElement("li", { key: `${path} - ${optionValue}` },
                React.createElement(RadioInput, { path: path, isSelected: isSelected, option: optionIsObject(option) ? option : { label: option, value: option }, onChange: readOnly ? undefined : setValue })));
        })),
        React.createElement(FieldDescription, { value: value, description: description })));
};
export default withCondition(RadioGroup);
