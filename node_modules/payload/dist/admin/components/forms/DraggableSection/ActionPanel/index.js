import React from 'react';
import Button from '../../../elements/Button';
import Popup from '../../../elements/Popup';
import BlockSelector from '../../field-types/Blocks/BlockSelector';
import './index.scss';
const baseClass = 'action-panel';
const ActionPanel = (props) => {
    const { addRow, removeRow, label = 'Row', blockType, blocks = [], rowIndex, isHovered, hasMaxRows, } = props;
    const classes = [
        baseClass,
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: classes },
        React.createElement(Popup, { showOnHover: true, size: "wide", color: "dark", horizontalAlign: "right", buttonType: "custom", button: (React.createElement(Button, { className: `${baseClass}__remove-row`, round: true, buttonStyle: "none", icon: "x", iconPosition: "left", iconStyle: "with-border", onClick: () => removeRow(rowIndex) })) },
            "Remove\u00A0",
            label),
        !hasMaxRows && (React.createElement(React.Fragment, null, blockType === 'blocks'
            ? (React.createElement(Popup, { buttonType: "custom", size: "large", horizontalAlign: "right", button: (React.createElement(Button, { className: `${baseClass}__add-row`, round: true, buttonStyle: "none", icon: "plus", iconPosition: "left", iconStyle: "with-border" })), render: ({ close }) => (React.createElement(BlockSelector, { blocks: blocks, addRow: addRow, addRowIndex: rowIndex, close: close, parentIsHovered: isHovered, watchParentHover: true })) }))
            : (React.createElement(Popup, { showOnHover: true, size: "wide", color: "dark", horizontalAlign: "center", buttonType: "custom", button: (React.createElement(Button, { className: `${baseClass}__add-row`, round: true, buttonStyle: "none", icon: "plus", iconPosition: "left", iconStyle: "with-border", onClick: () => addRow(rowIndex) })) },
                "Add\u00A0",
                label))))));
};
export default ActionPanel;
