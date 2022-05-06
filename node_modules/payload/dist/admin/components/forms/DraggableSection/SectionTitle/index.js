import React from 'react';
import useField from '../../useField';
import Pill from '../../../elements/Pill';
import './index.scss';
const baseClass = 'section-title';
const SectionTitle = (props) => {
    const { label, path, readOnly } = props;
    const { value, setValue } = useField({ path });
    const classes = [
        baseClass,
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: classes },
        React.createElement(Pill, { pillStyle: "light-gray", className: `${baseClass}__pill` }, label),
        React.createElement("input", { className: `${baseClass}__input`, id: path, value: value || '', placeholder: "Untitled", type: "text", name: path, onChange: setValue, readOnly: readOnly })));
};
export default SectionTitle;
