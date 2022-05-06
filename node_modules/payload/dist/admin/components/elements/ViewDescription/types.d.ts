import React from 'react';
export declare type DescriptionFunction = () => string;
export declare type DescriptionComponent = React.ComponentType;
declare type Description = string | DescriptionFunction | DescriptionComponent;
export declare type Props = {
    description?: Description;
};
export declare function isComponent(description: Description): description is DescriptionComponent;
export {};
