import { OptionsType, GroupedOptionsType } from 'react-select';
export declare type Options = OptionsType<Value> | GroupedOptionsType<Value>;
export declare type Value = {
    label: string;
    value: string | null;
    options?: Options;
};
export declare type Props = {
    className?: string;
    value?: Value | Value[];
    onChange?: (value: any) => void;
    disabled?: boolean;
    showError?: boolean;
    options: Options;
    isMulti?: boolean;
    isDisabled?: boolean;
    onInputChange?: (val: string) => void;
    onMenuScrollToBottom?: () => void;
    placeholder?: string;
    isSearchable?: boolean;
};
