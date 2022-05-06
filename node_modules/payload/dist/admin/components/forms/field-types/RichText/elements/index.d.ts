/// <reference types="react" />
declare const elements: {
    h1: {
        Button: () => JSX.Element;
        Element: ({ attributes, children }: {
            attributes: any;
            children: any;
        }) => JSX.Element;
    };
    h2: {
        Button: () => JSX.Element;
        Element: ({ attributes, children }: {
            attributes: any;
            children: any;
        }) => JSX.Element;
    };
    h3: {
        Button: () => JSX.Element;
        Element: ({ attributes, children }: {
            attributes: any;
            children: any;
        }) => JSX.Element;
    };
    h4: {
        Button: () => JSX.Element;
        Element: ({ attributes, children }: {
            attributes: any;
            children: any;
        }) => JSX.Element;
    };
    h5: {
        Button: () => JSX.Element;
        Element: ({ attributes, children }: {
            attributes: any;
            children: any;
        }) => JSX.Element;
    };
    h6: {
        Button: () => JSX.Element;
        Element: ({ attributes, children }: {
            attributes: any;
            children: any;
        }) => JSX.Element;
    };
    link: {
        Button: () => JSX.Element;
        Element: ({ attributes, children, element, editorRef }: {
            attributes: any;
            children: any;
            element: any;
            editorRef: any;
        }) => JSX.Element;
        plugins: ((incomingEditor: import("slate").BaseEditor & import("slate-react").ReactEditor & import("slate-history").HistoryEditor & import("../types").BlurSelectionEditor) => import("slate").BaseEditor & import("slate-react").ReactEditor & import("slate-history").HistoryEditor & import("../types").BlurSelectionEditor)[];
    };
    ol: {
        Button: () => JSX.Element;
        Element: ({ attributes, children }: {
            attributes: any;
            children: any;
        }) => JSX.Element;
    };
    ul: {
        Button: () => JSX.Element;
        Element: ({ attributes, children }: {
            attributes: any;
            children: any;
        }) => JSX.Element;
    };
    li: {
        Element: (props: any) => JSX.Element;
    };
    indent: {
        Button: () => JSX.Element;
        Element: ({ attributes, children }: {
            attributes: any;
            children: any;
        }) => JSX.Element;
    };
    relationship: {
        Button: import("react").FC<{
            path: string;
        }>;
        Element: (props: any) => JSX.Element;
        plugins: ((incomingEditor: any) => any)[];
    };
    upload: {
        Button: import("react").FC<{
            path: string;
        }>;
        Element: ({ attributes, children, element, path, fieldProps }: {
            attributes: any;
            children: any;
            element: any;
            path: any;
            fieldProps: any;
        }) => JSX.Element;
        plugins: ((incomingEditor: any) => any)[];
    };
};
export default elements;
