import React, { Suspense, lazy } from 'react';
import Loading from '../../../elements/Loading';
const ArrayField = lazy(() => import('./Array'));
const ArrayFieldType = (props) => (React.createElement(Suspense, { fallback: React.createElement(Loading, null) },
    React.createElement(ArrayField, { ...props })));
export default ArrayFieldType;
