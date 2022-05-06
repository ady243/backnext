const reduceToIDs = (options) => options.reduce((ids, option) => {
    if (option.options) {
        return [
            ...ids,
            ...reduceToIDs(option.options),
        ];
    }
    return [
        ...ids,
        option.value,
    ];
}, []);
const sortOptions = (options) => options.sort((a, b) => {
    var _a, _b;
    if (typeof ((_a = a === null || a === void 0 ? void 0 : a.label) === null || _a === void 0 ? void 0 : _a.localeCompare) === 'function' && typeof ((_b = b === null || b === void 0 ? void 0 : b.label) === null || _b === void 0 ? void 0 : _b.localeCompare) === 'function') {
        return a.label.localeCompare(b.label);
    }
    return 0;
});
const optionsReducer = (state, action) => {
    switch (action.type) {
        case 'CLEAR': {
            return action.required ? [] : [{ value: 'null', label: 'None' }];
        }
        case 'ADD': {
            const { hasMultipleRelations, collection, relation, data, sort } = action;
            const labelKey = collection.admin.useAsTitle || 'id';
            const loadedIDs = reduceToIDs(state);
            if (!hasMultipleRelations) {
                const options = [
                    ...state,
                    ...data.docs.reduce((docs, doc) => {
                        if (loadedIDs.indexOf(doc.id) === -1) {
                            loadedIDs.push(doc.id);
                            return [
                                ...docs,
                                {
                                    label: doc[labelKey] || `Untitled - ID: ${doc.id}`,
                                    value: doc.id,
                                },
                            ];
                        }
                        return docs;
                    }, []),
                ];
                return sort ? sortOptions(options) : options;
            }
            const newOptions = [...state];
            const optionsToAddTo = newOptions.find((optionGroup) => optionGroup.label === collection.labels.plural);
            const newSubOptions = data.docs.reduce((docs, doc) => {
                if (loadedIDs.indexOf(doc.id) === -1) {
                    loadedIDs.push(doc.id);
                    return [
                        ...docs,
                        {
                            label: doc[labelKey] || `Untitled - ID: ${doc.id}`,
                            relationTo: relation,
                            value: doc.id,
                        },
                    ];
                }
                return docs;
            }, []);
            if (optionsToAddTo) {
                const subOptions = [
                    ...optionsToAddTo.options,
                    ...newSubOptions,
                ];
                optionsToAddTo.options = sort ? sortOptions(subOptions) : subOptions;
            }
            else {
                newOptions.push({
                    label: collection.labels.plural,
                    options: sort ? sortOptions(newSubOptions) : newSubOptions,
                    value: undefined,
                });
            }
            return newOptions;
        }
        default: {
            return state;
        }
    }
};
export default optionsReducer;
