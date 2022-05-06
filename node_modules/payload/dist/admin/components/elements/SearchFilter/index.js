import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import queryString from 'qs';
import Search from '../../icons/Search';
import useDebounce from '../../../hooks/useDebounce';
import { useSearchParams } from '../../utilities/SearchParams';
import './index.scss';
const baseClass = 'search-filter';
const SearchFilter = (props) => {
    const { fieldName = 'id', fieldLabel = 'ID', modifySearchQuery = true, handleChange, } = props;
    const params = useSearchParams();
    const history = useHistory();
    const [search, setSearch] = useState(() => { var _a, _b; return ((_b = (_a = params === null || params === void 0 ? void 0 : params.where) === null || _a === void 0 ? void 0 : _a[fieldName]) === null || _b === void 0 ? void 0 : _b.like) || ''; });
    const debouncedSearch = useDebounce(search, 300);
    useEffect(() => {
        var _a, _b, _c, _d, _e;
        if (debouncedSearch !== ((_b = (_a = params === null || params === void 0 ? void 0 : params.where) === null || _a === void 0 ? void 0 : _a[fieldName]) === null || _b === void 0 ? void 0 : _b.like)) {
            const newWhere = {
                ...(typeof (params === null || params === void 0 ? void 0 : params.where) === 'object' ? params.where : {}),
                [fieldName]: {
                    like: debouncedSearch,
                },
            };
            if (!debouncedSearch) {
                delete newWhere[fieldName];
            }
            if (handleChange)
                handleChange(newWhere);
            if (modifySearchQuery && ((_d = (_c = params === null || params === void 0 ? void 0 : params.where) === null || _c === void 0 ? void 0 : _c[fieldName]) === null || _d === void 0 ? void 0 : _d.like) !== ((_e = newWhere === null || newWhere === void 0 ? void 0 : newWhere[fieldName]) === null || _e === void 0 ? void 0 : _e.like)) {
                history.replace({
                    search: queryString.stringify({
                        ...params,
                        page: 1,
                        where: newWhere,
                    }),
                });
            }
        }
    }, [debouncedSearch, history, fieldName, params, handleChange, modifySearchQuery]);
    return (React.createElement("div", { className: baseClass },
        React.createElement("input", { className: `${baseClass}__input`, placeholder: `Search by ${fieldLabel}`, type: "text", value: search || '', onChange: (e) => setSearch(e.target.value) }),
        React.createElement(Search, null)));
};
export default SearchFilter;
