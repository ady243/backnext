import { SanitizedConfig } from '../config/types';
import { Collection } from '../collections/config/types';
import { PayloadRequest } from '../express/types';
declare type Args = {
    config: SanitizedConfig;
    collection: Collection;
    throwOnMissingFile?: boolean;
    req: PayloadRequest;
    data: Record<string, unknown>;
    overwriteExistingFiles?: boolean;
};
declare const uploadFile: ({ config, collection: { config: collectionConfig, Model, }, req, data, throwOnMissingFile, overwriteExistingFiles, }: Args) => Promise<Record<string, unknown>>;
export default uploadFile;
