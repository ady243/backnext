import { Where } from '../../../../types';
export declare type Props = {
    fieldName?: string;
    fieldLabel?: string;
    modifySearchQuery?: boolean;
    handleChange?: (where: Where) => void;
};
