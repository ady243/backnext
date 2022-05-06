import React from 'react';
import ULIcon from '../../../../../icons/UnorderedList';
import ListButton from '../ListButton';
const UL = ({ attributes, children }) => (React.createElement("ul", { ...attributes }, children));
const ul = {
    Button: () => (React.createElement(ListButton, { format: "ul" },
        React.createElement(ULIcon, null))),
    Element: UL,
};
export default ul;
