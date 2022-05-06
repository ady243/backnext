import React, { useEffect, useState } from 'react';
import { useModal } from '@faceless-ui/modal';
import Button from '../../../elements/Button';
import Label from '../../Label';
import Error from '../../Error';
import FileDetails from '../../../elements/FileDetails';
import FieldDescription from '../../FieldDescription';
import AddModal from './Add';
import SelectExistingModal from './SelectExisting';
import './index.scss';
const baseClass = 'upload';
const UploadInput = (props) => {
    const { path, required, readOnly, style, className, width, description, label, relationTo, fieldTypes, value, onChange, showError, serverURL = 'http://localhost:3000', api = '/api', collection, errorMessage, filterOptions, } = props;
    const { toggle } = useModal();
    const addModalSlug = `${path}-add`;
    const selectExistingModalSlug = `${path}-select-existing`;
    const [file, setFile] = useState(undefined);
    const [missingFile, setMissingFile] = useState(false);
    const classes = [
        'field-type',
        baseClass,
        className,
        showError && 'error',
        readOnly && 'read-only',
    ].filter(Boolean).join(' ');
    useEffect(() => {
        if (typeof value === 'string' && value !== '') {
            const fetchFile = async () => {
                const response = await fetch(`${serverURL}${api}/${relationTo}/${value}`);
                if (response.ok) {
                    const json = await response.json();
                    setFile(json);
                }
                else {
                    setMissingFile(true);
                    setFile(undefined);
                }
            };
            fetchFile();
        }
        else {
            setFile(undefined);
        }
    }, [
        value,
        relationTo,
        api,
        serverURL,
    ]);
    return (React.createElement("div", { className: classes, style: {
            ...style,
            width,
        } },
        React.createElement(Error, { showError: showError, message: errorMessage }),
        React.createElement(Label, { htmlFor: path, label: label, required: required }),
        (collection === null || collection === void 0 ? void 0 : collection.upload) && (React.createElement(React.Fragment, null,
            (file && !missingFile) && (React.createElement(FileDetails, { collection: collection, doc: file, handleRemove: () => {
                    onChange(null);
                } })),
            (!file || missingFile) && (React.createElement("div", { className: `${baseClass}__wrap` },
                React.createElement(Button, { buttonStyle: "secondary", onClick: () => {
                        toggle(addModalSlug);
                    } },
                    "Upload new",
                    ' ',
                    collection.labels.singular),
                React.createElement(Button, { buttonStyle: "secondary", onClick: () => {
                        toggle(selectExistingModalSlug);
                    } }, "Choose from existing"))),
            React.createElement(AddModal, { ...{
                    collection,
                    slug: addModalSlug,
                    fieldTypes,
                    setValue: onChange,
                } }),
            React.createElement(SelectExistingModal, { ...{
                    collection,
                    slug: selectExistingModalSlug,
                    setValue: onChange,
                    addModalSlug,
                    filterOptions,
                    path,
                } }),
            React.createElement(FieldDescription, { value: file, description: description })))));
};
export default UploadInput;
