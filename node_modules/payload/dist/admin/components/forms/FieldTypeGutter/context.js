import React, { createContext, useContext } from 'react';
import { useWindowInfo } from '@faceless-ui/window-info';
const context = createContext(false);
const { Provider } = context;
export const NegativeFieldGutterProvider = ({ children, allow }) => {
    const { breakpoints: { m: midBreak } } = useWindowInfo();
    return (React.createElement(Provider, { value: allow && !midBreak }, children));
};
export const useNegativeFieldGutter = () => useContext(context);
