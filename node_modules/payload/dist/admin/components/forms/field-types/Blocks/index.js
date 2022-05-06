import React, { Suspense, lazy } from 'react';
import Loading from '../../../elements/Loading';
const Blocks = lazy(() => import('./Blocks'));
const BlocksField = (props) => (React.createElement(Suspense, { fallback: React.createElement(Loading, null) },
    React.createElement(Blocks, { ...props })));
export default BlocksField;
