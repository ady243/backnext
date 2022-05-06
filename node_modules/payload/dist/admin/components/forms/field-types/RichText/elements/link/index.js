import React, { Fragment, useCallback, useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Transforms } from 'slate';
import ElementButton from '../Button';
import { withLinks, wrapLink } from './utilities';
import LinkIcon from '../../../../../icons/Link';
import Popup from '../../../../../elements/Popup';
import Button from '../../../../../elements/Button';
import Check from '../../../../../icons/Check';
import Error from '../../../../Error';
import './index.scss';
const baseClass = 'rich-text-link';
const Link = ({ attributes, children, element, editorRef }) => {
    const editor = useSlate();
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(element.url === undefined);
    const handleToggleOpen = useCallback((newOpen) => {
        setOpen(newOpen);
        if (element.url === undefined && !newOpen) {
            const path = ReactEditor.findPath(editor, element);
            Transforms.setNodes(editor, { url: '' }, { at: path });
        }
    }, [editor, element]);
    return (React.createElement("span", { className: baseClass, ...attributes },
        React.createElement("span", { style: { userSelect: 'none' }, contentEditable: false },
            React.createElement(Popup, { initActive: element.url === undefined, buttonType: "none", size: "small", color: "dark", horizontalAlign: "center", forceOpen: open, onToggleOpen: handleToggleOpen, boundingRef: editorRef, render: ({ close }) => (React.createElement(Fragment, null,
                    React.createElement("div", { className: `${baseClass}__url-wrap` },
                        React.createElement("input", { value: element.url || '', className: `${baseClass}__url`, placeholder: "Enter a URL", onChange: (e) => {
                                const { value } = e.target;
                                if (value && error) {
                                    setError(false);
                                }
                                const path = ReactEditor.findPath(editor, element);
                                Transforms.setNodes(editor, { url: value }, { at: path });
                            }, onKeyDown: (e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    close();
                                }
                            } }),
                        React.createElement(Button, { className: `${baseClass}__confirm`, buttonStyle: "none", icon: "chevron", onClick: (e) => {
                                e.preventDefault();
                                if (element.url) {
                                    close();
                                }
                                else {
                                    setError(true);
                                }
                            } }),
                        error && (React.createElement(Error, { showError: error, message: "Please enter a valid URL." }))),
                    React.createElement(Button, { className: [`${baseClass}__new-tab`, element.newTab && `${baseClass}__new-tab--checked`].filter(Boolean).join(' '), buttonStyle: "none", onClick: () => {
                            const path = ReactEditor.findPath(editor, element);
                            Transforms.setNodes(editor, { newTab: !element.newTab }, { at: path });
                        } },
                        React.createElement(Check, null),
                        "Open link in new tab"))) })),
        React.createElement("button", { className: [
                `${baseClass}__button`,
                open && `${baseClass}__button--open`,
            ].filter(Boolean).join(' '), type: "button", onClick: () => setOpen(true) }, children)));
};
const LinkButton = () => {
    const editor = useSlate();
    return (React.createElement(ElementButton, { format: "link", onClick: () => wrapLink(editor) },
        React.createElement(LinkIcon, null)));
};
const link = {
    Button: LinkButton,
    Element: Link,
    plugins: [
        withLinks,
    ],
};
export default link;
