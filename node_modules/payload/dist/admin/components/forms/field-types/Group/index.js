import React from 'react';
import RenderFields from '../../RenderFields';
import withCondition from '../../withCondition';
import FieldDescription from '../../FieldDescription';
import FieldTypeGutter from '../../FieldTypeGutter';
import { NegativeFieldGutterProvider } from '../../FieldTypeGutter/context';
import { fieldAffectsData } from '../../../../../fields/config/types';
import './index.scss';
const baseClass = 'group';
const Group = (props) => {
    const { label, fields, name, path: pathFromProps, fieldTypes, admin: { readOnly, style, className, width, hideGutter, description, }, permissions, } = props;
    const path = pathFromProps || name;
    return (React.createElement("div", { className: [
            'field-type',
            baseClass,
            className,
            !label && `${baseClass}--no-label`,
        ].filter(Boolean).join(' '), style: {
            ...style,
            width,
        } },
        !hideGutter && (React.createElement(FieldTypeGutter, null)),
        React.createElement("div", { className: `${baseClass}__content-wrapper` },
            (label || description) && (React.createElement("header", { className: `${baseClass}__header` },
                label && (React.createElement("h3", { className: `${baseClass}__title` }, label)),
                React.createElement(FieldDescription, { value: null, description: description }))),
            React.createElement("div", { className: `${baseClass}__fields-wrapper` },
                React.createElement(NegativeFieldGutterProvider, { allow: false },
                    React.createElement(RenderFields, { permissions: permissions === null || permissions === void 0 ? void 0 : permissions.fields, readOnly: readOnly, fieldTypes: fieldTypes, fieldSchema: fields.map((subField) => ({
                            ...subField,
                            path: `${path}${fieldAffectsData(subField) ? `.${subField.name}` : ''}`,
                        })) }))))));
};
export default withCondition(Group);
