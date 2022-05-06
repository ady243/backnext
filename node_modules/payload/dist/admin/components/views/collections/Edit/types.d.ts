import { SanitizedCollectionConfig } from '../../../../../collections/config/types';
import { CollectionPermission } from '../../../../../auth/types';
import { Document } from '../../../../../types';
import { Fields } from '../../../forms/Form/types';
export declare type IndexProps = {
    collection: SanitizedCollectionConfig;
    isEditing?: boolean;
};
export declare type Props = IndexProps & {
    data: Document;
    onSave?: () => void;
    permissions: CollectionPermission;
    isLoading: boolean;
    initialState?: Fields;
    apiURL: string;
    action: string;
    hasSavePermission: boolean;
    autosaveEnabled: boolean;
};
