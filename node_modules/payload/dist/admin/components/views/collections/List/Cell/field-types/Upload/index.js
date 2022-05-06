import React from 'react';
const UploadCell = ({ data }) => (React.createElement(React.Fragment, null,
    React.createElement("span", null, data === null || data === void 0 ? void 0 : data.filename)));
export default UploadCell;
