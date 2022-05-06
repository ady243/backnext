import React from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
export declare type Props = {
    variant?: 'left' | 'right';
    verticalAlignment?: 'top' | 'center' | 'sticky';
    dragHandleProps?: DraggableProvidedDragHandleProps;
    className?: string;
    children?: React.ReactNode;
};
