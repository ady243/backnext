import React from 'react';
declare type PreferencesContext = {
    getPreference: <T>(key: string) => T | Promise<T>;
    setPreference: <T>(key: string, value: T) => void;
};
export declare const PreferencesProvider: React.FC<{
    children?: React.ReactNode;
}>;
export declare const usePreferences: () => PreferencesContext;
export {};
