/// <reference types="react" />
import { Context } from './types';
declare const FormContext: import("react").Context<Context>;
declare const FormWatchContext: import("react").Context<Context>;
declare const SubmittedContext: import("react").Context<boolean>;
declare const ProcessingContext: import("react").Context<boolean>;
declare const ModifiedContext: import("react").Context<boolean>;
declare const useForm: () => Context;
declare const useWatchForm: () => Context;
declare const useFormSubmitted: () => boolean;
declare const useFormProcessing: () => boolean;
declare const useFormModified: () => boolean;
export { FormContext, FormWatchContext, SubmittedContext, ProcessingContext, ModifiedContext, useForm, useWatchForm, useFormSubmitted, useFormProcessing, useFormModified, };
