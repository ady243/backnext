import React, { useCallback } from 'react';
import useField from '../../useField';
import Label from '../../Label';
import Error from '../../Error';
import { useWatchForm } from '../../Form/context';
import './index.scss';
const ConfirmPassword = () => {
    const { getField } = useWatchForm();
    const password = getField('password');
    const validate = useCallback((value) => {
        if (value === (password === null || password === void 0 ? void 0 : password.value)) {
            return true;
        }
        return 'Passwords do not match.';
    }, [password]);
    const { value, showError, setValue, errorMessage, } = useField({
        path: 'confirm-password',
        disableFormData: true,
        validate,
        enableDebouncedValue: true,
    });
    const classes = [
        'field-type',
        'confirm-password',
        showError && 'error',
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: classes },
        React.createElement(Error, { showError: showError, message: errorMessage }),
        React.createElement(Label, { htmlFor: "confirm-password", label: "Confirm Password", required: true }),
        React.createElement("input", { value: value || '', onChange: setValue, type: "password", autoComplete: "off", id: "confirm-password", name: "confirm-password" })));
};
export default ConfirmPassword;
