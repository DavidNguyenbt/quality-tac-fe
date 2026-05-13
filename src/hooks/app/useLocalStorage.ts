import {useEffect, useState} from "react";

function getStorageValue(key: string, defaultValue: any) {
    const saved = localStorage.getItem(key);
    return saved || defaultValue;
}

export const useLocalStorage = (key: string, defaultValue?: any) => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
};