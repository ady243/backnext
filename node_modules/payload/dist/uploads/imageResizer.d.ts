/// <reference types="node" />
import { ProbedImageSize } from './getImageSize';
import { SanitizedCollectionConfig } from '../collections/config/types';
import { FileSizes } from './types';
import { PayloadRequest } from '../express/types';
declare type Args = {
    req: PayloadRequest;
    file: Buffer;
    dimensions: ProbedImageSize;
    staticPath: string;
    config: SanitizedCollectionConfig;
    savedFilename: string;
    mimeType: string;
};
/**
 * @description
 * @param staticPath Path to save images
 * @param config Payload config
 * @param savedFilename
 * @param mimeType
 * @returns image sizes keyed to strings
 */
export default function resizeAndSave({ req, file, dimensions, staticPath, config, savedFilename, mimeType, }: Args): Promise<FileSizes>;
export {};
