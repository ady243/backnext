import React from 'react';
import { isComponent } from './types';
import './index.scss';
const FieldDescription = (props) => {
    const { description, value, } = props;
    if (isComponent(description)) {
        const Description = description;
        return React.createElement(Description, { value: value });
    }
    if (description) {
        return (React.createElement("div", { className: "field-description" }, typeof description === 'function' ? description({ value }) : description));
    }
    return null;
};
export default FieldDescription;
