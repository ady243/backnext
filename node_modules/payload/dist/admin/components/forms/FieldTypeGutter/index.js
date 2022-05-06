import React from 'react';
import { useNegativeFieldGutter } from './context';
import './index.scss';
const baseClass = 'field-type-gutter';
const FieldTypeGutter = ({ children, variant = 'left', verticalAlignment = 'sticky', className, dragHandleProps = {}, }) => {
    const allowNegativeGutter = useNegativeFieldGutter();
    const classes = [
        baseClass,
        `${baseClass}--${variant}`,
        `${baseClass}--v-align-${verticalAlignment}`,
        allowNegativeGutter && `${baseClass}--negative-gutter`,
        className && className,
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: classes, ...dragHandleProps },
        React.createElement("div", { className: `${baseClass}__content-container` },
            React.createElement("div", { className: `${baseClass}__content` }, children))));
};
export default FieldTypeGutter;
