import { SanitizedCollectionConfig } from '../../../../../collections/config/types';
import { PaginatedDocs } from '../../../../../mongoose/types';
import { RelationshipField } from '../../../../../fields/config/types';
export declare type Props = Omit<RelationshipField, 'type'> & {
    path?: string;
};
export declare type Option = {
    label: string;
    value: string;
    relationTo?: string;
    options?: Option[];
};
declare type CLEAR = {
    type: 'CLEAR';
    required: boolean;
};
declare type ADD = {
    type: 'ADD';
    data: PaginatedDocs<any>;
    relation: string;
    hasMultipleRelations: boolean;
    collection: SanitizedCollectionConfig;
    sort?: boolean;
};
export declare type Action = CLEAR | ADD;
export declare type ValueWithRelation = {
    relationTo: string;
    value: string;
};
export declare type GetResults = (args: {
    lastFullyLoadedRelation?: number;
    lastLoadedPage?: number;
    search?: string;
    value?: unknown;
    sort?: boolean;
}) => Promise<void>;
export {};
