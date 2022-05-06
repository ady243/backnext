import React from 'react';
import RenderFields from '../../RenderFields';
import withCondition from '../../withCondition';
import { fieldAffectsData } from '../../../../../fields/config/types';
import './index.scss';
const Row = (props) => {
    const { fields, fieldTypes, path, permissions, admin: { readOnly, className, }, } = props;
    const classes = [
        'field-type',
        'row',
        className,
    ].filter(Boolean).join(' ');
    return (React.createElement(RenderFields, { readOnly: readOnly, className: classes, permissions: permissions === null || permissions === void 0 ? void 0 : permissions.fields, fieldTypes: fieldTypes, fieldSchema: fields.map((field) => ({
            ...field,
            path: `${path ? `${path}.` : ''}${fieldAffectsData(field) ? field.name : ''}`,
        })) }));
};
export default withCondition(Row);
