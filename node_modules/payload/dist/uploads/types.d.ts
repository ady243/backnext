/// <reference types="node" />
import express from 'express';
import serveStatic from 'serve-static';
export declare type FileSize = {
    filename: string;
    filesize: number;
    mimeType: string;
    name: string;
    width: number;
    height: number;
    crop: string;
};
export declare type FileSizes = {
    [size: string]: FileSize;
};
export declare type FileData = {
    filename: string;
    filesize: number;
    mimeType: string;
    width: number;
    height: number;
    sizes: FileSizes;
};
export declare type ImageSize = {
    name: string;
    width: number | null;
    height: number | null;
    crop?: string;
};
export declare type GetAdminThumbnail = (args: {
    doc: Record<string, unknown>;
}) => string;
export declare type IncomingUploadType = {
    imageSizes?: ImageSize[];
    staticURL?: string;
    staticDir?: string;
    disableLocalStorage?: boolean;
    adminThumbnail?: string | GetAdminThumbnail;
    mimeTypes?: string[];
    staticOptions?: serveStatic.ServeStaticOptions<express.Response<any, Record<string, any>>>;
};
export declare type Upload = {
    imageSizes?: ImageSize[];
    staticURL: string;
    staticDir: string;
    disableLocalStorage: boolean;
    adminThumbnail?: string | GetAdminThumbnail;
    mimeTypes?: string[];
    staticOptions?: serveStatic.ServeStaticOptions<express.Response<any, Record<string, any>>>;
};
export declare type File = {
    data: Buffer;
    mimetype: string;
    name: string;
    size: number;
};
