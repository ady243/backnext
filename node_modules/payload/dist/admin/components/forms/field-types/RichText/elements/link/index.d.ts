/// <reference types="react" />
import { ReactEditor } from 'slate-react';
import './index.scss';
declare const link: {
    Button: () => JSX.Element;
    Element: ({ attributes, children, element, editorRef }: {
        attributes: any;
        children: any;
        element: any;
        editorRef: any;
    }) => JSX.Element;
    plugins: ((incomingEditor: import("slate").BaseEditor & ReactEditor & import("slate-history").HistoryEditor & import("../../types").BlurSelectionEditor) => import("slate").BaseEditor & ReactEditor & import("slate-history").HistoryEditor & import("../../types").BlurSelectionEditor)[];
};
export default link;
