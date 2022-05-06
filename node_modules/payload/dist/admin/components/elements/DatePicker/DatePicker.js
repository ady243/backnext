import React from 'react';
import DatePicker from 'react-datepicker';
import CalendarIcon from '../../icons/Calendar';
import 'react-datepicker/dist/react-datepicker.css';
import './index.scss';
const baseClass = 'date-time-picker';
const DateTime = (props) => {
    const { value, onChange, displayFormat, pickerAppearance = 'dayAndTime', minDate, maxDate, monthsToShow = 1, minTime, maxTime, timeIntervals = 30, timeFormat = 'h:mm aa', readOnly, placeholder: placeholderText, } = props;
    let dateTimeFormat = displayFormat;
    if (dateTimeFormat === undefined) {
        if (pickerAppearance === 'dayAndTime')
            dateTimeFormat = 'MMM d, yyy h:mm a';
        else if (pickerAppearance === 'timeOnly')
            dateTimeFormat = 'h:mm a';
        else
            dateTimeFormat = 'MMM d, yyy';
    }
    const dateTimePickerProps = {
        minDate,
        maxDate,
        dateFormat: dateTimeFormat,
        monthsShown: Math.min(2, monthsToShow),
        showTimeSelect: pickerAppearance === 'dayAndTime' || pickerAppearance === 'timeOnly',
        minTime,
        maxTime,
        timeIntervals,
        timeFormat,
        placeholderText,
        disabled: readOnly,
        onChange,
        showPopperArrow: false,
        selected: value && new Date(value),
        customInputRef: 'ref',
    };
    const classes = [
        baseClass,
        `${baseClass}__appearance--${pickerAppearance}`,
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: classes },
        React.createElement("div", { className: `${baseClass}__icon-wrap` },
            React.createElement(CalendarIcon, null)),
        React.createElement("div", { className: `${baseClass}__input-wrapper` },
            React.createElement(DatePicker, { ...dateTimePickerProps, popperModifiers: {
                    preventOverflow: {
                        enabled: true,
                    },
                } }))));
};
export default DateTime;
