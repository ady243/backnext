import React, { useEffect, useRef, useState } from 'react';
import { useWindowInfo } from '@faceless-ui/window-info';
import { useScrollInfo } from '@faceless-ui/scroll-info';
import useThrottledEffect from '../../../hooks/useThrottledEffect';
import PopupButton from './PopupButton';
import './index.scss';
const baseClass = 'popup';
const Popup = (props) => {
    const { className, render, size = 'small', color = 'light', button, buttonType = 'default', children, showOnHover = false, horizontalAlign: horizontalAlignFromProps = 'left', verticalAlign: verticalAlignFromProps = 'top', initActive = false, onToggleOpen, padding, forceOpen, boundingRef, } = props;
    const buttonRef = useRef(null);
    const contentRef = useRef(null);
    const [mounted, setMounted] = useState(false);
    const [active, setActive] = useState(initActive);
    const [verticalAlign, setVerticalAlign] = useState(verticalAlignFromProps);
    const [horizontalAlign, setHorizontalAlign] = useState(horizontalAlignFromProps);
    const { y: scrollY } = useScrollInfo();
    const { height: windowHeight, width: windowWidth } = useWindowInfo();
    const handleClickOutside = (e) => {
        if (contentRef.current.contains(e.target)) {
            return;
        }
        setActive(false);
    };
    useThrottledEffect(() => {
        if (contentRef.current && buttonRef.current) {
            const { left: contentLeftPos, right: contentRightPos, top: contentTopPos, bottom: contentBottomPos, } = contentRef.current.getBoundingClientRect();
            let boundingTopPos = 0;
            let boundingRightPos = windowWidth;
            let boundingBottomPos = windowHeight;
            let boundingLeftPos = 0;
            if (boundingRef === null || boundingRef === void 0 ? void 0 : boundingRef.current) {
                ({
                    top: boundingTopPos,
                    right: boundingRightPos,
                    bottom: boundingBottomPos,
                    left: boundingLeftPos,
                } = boundingRef.current.getBoundingClientRect());
            }
            if (contentRightPos > boundingRightPos && contentLeftPos > boundingLeftPos) {
                setHorizontalAlign('right');
            }
            else if (contentLeftPos < boundingLeftPos && contentRightPos < boundingRightPos) {
                setHorizontalAlign('left');
            }
            if (contentTopPos < boundingTopPos && contentBottomPos < boundingBottomPos) {
                setVerticalAlign('bottom');
            }
            else if (contentBottomPos > boundingBottomPos && contentTopPos < boundingTopPos) {
                setVerticalAlign('top');
            }
            setMounted(true);
        }
    }, 500, [scrollY, windowHeight, windowWidth]);
    useEffect(() => {
        if (typeof onToggleOpen === 'function')
            onToggleOpen(active);
        if (active) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [active, onToggleOpen]);
    useEffect(() => {
        setActive(forceOpen);
    }, [forceOpen]);
    const classes = [
        baseClass,
        className,
        `${baseClass}--size-${size}`,
        `${baseClass}--color-${color}`,
        `${baseClass}--v-align-${verticalAlign}`,
        `${baseClass}--h-align-${horizontalAlign}`,
        (active && mounted) && `${baseClass}--active`,
    ].filter(Boolean).join(' ');
    return (React.createElement("div", { className: classes },
        React.createElement("div", { ref: buttonRef, className: `${baseClass}__wrapper` }, showOnHover
            ? (React.createElement("div", { className: `${baseClass}__on-hover-watch`, onMouseEnter: () => setActive(true), onMouseLeave: () => setActive(false) },
                React.createElement(PopupButton, { buttonType: buttonType, button: button, setActive: setActive, active: active })))
            : (React.createElement(PopupButton, { buttonType: buttonType, button: button, setActive: setActive, active: active }))),
        React.createElement("div", { className: `${baseClass}__content`, ref: contentRef },
            React.createElement("div", { className: `${baseClass}__wrap` },
                React.createElement("div", { className: `${baseClass}__scroll`, style: {
                        padding,
                    } },
                    render && render({ close: () => setActive(false) }),
                    children && children)))));
};
export default Popup;
