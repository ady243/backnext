import { Editor } from 'slate';
export declare const unwrapLink: (editor: Editor) => void;
export declare const wrapLink: (editor: Editor, url?: string, newTab?: boolean) => void;
export declare const withLinks: (incomingEditor: Editor) => Editor;
