import React from 'react';
import { Field as FieldConfig, Condition, Validate } from '../../../../fields/config/types';
export declare type Field = {
    value: unknown;
    initialValue: unknown;
    errorMessage?: string;
    valid: boolean;
    validate?: Validate;
    disableFormData?: boolean;
    condition?: Condition;
    passesCondition?: boolean;
};
export declare type Fields = {
    [path: string]: Field;
};
export declare type Data = {
    [key: string]: any;
};
export declare type Preferences = {
    [key: string]: unknown;
};
export declare type Props = {
    disabled?: boolean;
    onSubmit?: (fields: Fields, data: Data) => void;
    method?: 'get' | 'put' | 'delete' | 'post';
    action?: string;
    handleResponse?: (res: Response) => void;
    onSuccess?: (json: unknown) => void;
    className?: string;
    redirect?: string;
    disableSuccessStatus?: boolean;
    initialState?: Fields;
    initialData?: Data;
    waitForAutocomplete?: boolean;
    log?: boolean;
    validationOperation?: 'create' | 'update';
    children?: React.ReactNode;
};
export declare type SubmitOptions = {
    action?: string;
    method?: string;
    overrides?: Record<string, unknown>;
    skipValidation?: boolean;
};
export declare type DispatchFields = React.Dispatch<any>;
export declare type Submit = (options?: SubmitOptions, e?: React.FormEvent<HTMLFormElement>) => void;
export declare type ValidateForm = () => Promise<boolean>;
export declare type CreateFormData = (overrides?: any) => FormData;
export declare type GetFields = () => Fields;
export declare type GetField = (path: string) => Field;
export declare type GetData = () => Data;
export declare type GetSiblingData = (path: string) => Data;
export declare type GetUnflattenedValues = () => Data;
export declare type GetDataByPath = <T = unknown>(path: string) => T;
export declare type SetModified = (modified: boolean) => void;
export declare type SetSubmitted = (submitted: boolean) => void;
export declare type SetProcessing = (processing: boolean) => void;
export declare type Reset = (fieldSchema: FieldConfig[], data: unknown) => Promise<void>;
export declare type Context = {
    dispatchFields: DispatchFields;
    submit: Submit;
    fields: Fields;
    initialState: Fields;
    validateForm: ValidateForm;
    createFormData: CreateFormData;
    disabled: boolean;
    getFields: GetFields;
    getField: GetField;
    getData: GetData;
    getSiblingData: GetSiblingData;
    getUnflattenedValues: GetUnflattenedValues;
    getDataByPath: GetDataByPath;
    setModified: SetModified;
    setProcessing: SetProcessing;
    setSubmitted: SetSubmitted;
    formRef: React.MutableRefObject<HTMLFormElement>;
    reset: Reset;
};
