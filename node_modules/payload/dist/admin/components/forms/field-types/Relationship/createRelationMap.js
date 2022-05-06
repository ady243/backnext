export const createRelationMap = ({ hasMany, relationTo, value, }) => {
    const hasMultipleRelations = Array.isArray(relationTo);
    const relationMap = {};
    const add = (relation, id) => {
        if (((typeof id === 'string' && id !== 'null') || typeof id === 'number') && typeof relation === 'string') {
            if (typeof relationMap[relation] === 'undefined')
                relationMap[relation] = [];
            relationMap[relation].push(id);
        }
    };
    if (hasMany && Array.isArray(value)) {
        value.forEach((val) => {
            if (hasMultipleRelations) {
                add(val.relationTo, val.value);
            }
            else {
                add(relationTo, val);
            }
        });
    }
    else if (hasMultipleRelations) {
        const valueWithRelation = value;
        add(valueWithRelation === null || valueWithRelation === void 0 ? void 0 : valueWithRelation.relationTo, valueWithRelation === null || valueWithRelation === void 0 ? void 0 : valueWithRelation.value);
    }
    else {
        add(relationTo, value);
    }
    return relationMap;
};
