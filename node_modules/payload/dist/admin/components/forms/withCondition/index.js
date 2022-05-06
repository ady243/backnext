import React, { useEffect } from 'react';
import { useWatchForm } from '../Form/context';
const withCondition = (Field) => {
    const CheckForCondition = (props) => {
        const { admin: { condition, } = {}, } = props;
        if (condition) {
            return React.createElement(WithCondition, { ...props });
        }
        return React.createElement(Field, { ...props });
    };
    const WithCondition = (props) => {
        const { name, path: pathFromProps, admin: { condition, } = {}, } = props;
        const path = pathFromProps || name;
        const { getData, getSiblingData, getField, dispatchFields } = useWatchForm();
        const data = getData();
        const siblingData = getSiblingData(path);
        const hasCondition = Boolean(condition);
        const currentlyPassesCondition = hasCondition ? condition(data, siblingData) : true;
        const field = getField(path);
        const existingConditionPasses = field === null || field === void 0 ? void 0 : field.passesCondition;
        useEffect(() => {
            if (hasCondition) {
                if (!existingConditionPasses && currentlyPassesCondition) {
                    dispatchFields({ type: 'MODIFY_CONDITION', path, result: true });
                }
                if (!currentlyPassesCondition && (existingConditionPasses || typeof existingConditionPasses === 'undefined')) {
                    dispatchFields({ type: 'MODIFY_CONDITION', path, result: false });
                }
            }
        }, [currentlyPassesCondition, existingConditionPasses, dispatchFields, path, hasCondition]);
        if (currentlyPassesCondition) {
            return React.createElement(Field, { ...props });
        }
        return null;
    };
    return CheckForCondition;
};
export default withCondition;
