import React from 'react';
import Cell from './Cell';
import SortColumn from '../../../elements/SortColumn';
import { fieldHasSubFields, fieldAffectsData, fieldIsPresentationalOnly } from '../../../../../fields/config/types';
const buildColumns = (collection, columns) => (columns || []).reduce((cols, col, colIndex) => {
    let field = null;
    const fields = [
        ...collection.fields,
        {
            name: 'id',
            type: 'text',
            label: 'ID',
        },
        {
            name: 'updatedAt',
            type: 'date',
            label: 'Updated At',
        },
        {
            name: 'createdAt',
            type: 'date',
            label: 'Created At',
        },
    ];
    fields.forEach((fieldToCheck) => {
        if ((fieldAffectsData(fieldToCheck) || fieldIsPresentationalOnly(fieldToCheck)) && fieldToCheck.name === col) {
            field = fieldToCheck;
        }
        if (!fieldAffectsData(fieldToCheck) && fieldHasSubFields(fieldToCheck)) {
            fieldToCheck.fields.forEach((subField) => {
                if (fieldAffectsData(subField) && subField.name === col) {
                    field = subField;
                }
            });
        }
        return false;
    });
    if (field) {
        return [
            ...cols,
            {
                accessor: field.name,
                components: {
                    Heading: (React.createElement(SortColumn, { label: field.label || field.name, name: field.name, disable: (field.disableSort || fieldIsPresentationalOnly(field)) || undefined })),
                    renderCell: (rowData, cellData) => (React.createElement(Cell, { field: field, colIndex: colIndex, collection: collection, rowData: rowData, cellData: cellData })),
                },
            },
        ];
    }
    return cols;
}, []);
export default buildColumns;
