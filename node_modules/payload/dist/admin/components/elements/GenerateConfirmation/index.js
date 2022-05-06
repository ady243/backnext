import React from 'react';
import { toast } from 'react-toastify';
import { Modal, useModal } from '@faceless-ui/modal';
import Button from '../Button';
import MinimalTemplate from '../../templates/Minimal';
import './index.scss';
const baseClass = 'generate-confirmation';
const GenerateConfirmation = (props) => {
    const { setKey, highlightField, } = props;
    const { toggle } = useModal();
    const modalSlug = 'generate-confirmation';
    const handleGenerate = () => {
        setKey();
        toggle(modalSlug);
        toast.success('New API Key Generated.', { autoClose: 3000 });
        highlightField(true);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { size: "small", buttonStyle: "secondary", onClick: () => {
                toggle(modalSlug);
            } }, "Generate new API key"),
        React.createElement(Modal, { slug: modalSlug, className: baseClass },
            React.createElement(MinimalTemplate, null,
                React.createElement("h1", null, "Confirm Generation"),
                React.createElement("p", null,
                    "Generating a new API key will",
                    ' ',
                    React.createElement("strong", null, "invalidate"),
                    ' ',
                    "the previous key.",
                    ' ',
                    "Are you sure you wish to continue?"),
                React.createElement(Button, { buttonStyle: "secondary", type: "button", onClick: () => {
                        toggle(modalSlug);
                    } }, "Cancel"),
                React.createElement(Button, { onClick: handleGenerate }, "Generate")))));
};
export default GenerateConfirmation;
