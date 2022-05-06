import React from 'react';
import StepNav from '../StepNav';
import './index.scss';
const baseClass = 'eyebrow';
const Eyebrow = ({ actions }) => (React.createElement("div", { className: baseClass },
    React.createElement(StepNav, null),
    actions));
export default Eyebrow;
