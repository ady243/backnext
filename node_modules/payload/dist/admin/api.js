import qs from 'qs';
export const requests = {
    get: (url, params = {}) => {
        const query = qs.stringify(params, { addQueryPrefix: true });
        return fetch(`${url}${query}`);
    },
    post: (url, options = { headers: {} }) => {
        const headers = options && options.headers ? { ...options.headers } : {};
        const formattedOptions = {
            ...options,
            method: 'post',
            headers: {
                ...headers,
            },
        };
        return fetch(`${url}`, formattedOptions);
    },
    put: (url, options = { headers: {} }) => {
        const headers = options && options.headers ? { ...options.headers } : {};
        const formattedOptions = {
            ...options,
            method: 'put',
            headers: {
                ...headers,
            },
        };
        return fetch(url, formattedOptions);
    },
    delete: (url, options = { headers: {} }) => {
        const headers = options && options.headers ? { ...options.headers } : {};
        return fetch(url, {
            ...options,
            method: 'delete',
            headers: {
                ...headers,
            },
        });
    },
};
