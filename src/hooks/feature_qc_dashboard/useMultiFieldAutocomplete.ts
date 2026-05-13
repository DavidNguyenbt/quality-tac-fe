import { useRef, useState } from 'react';

export interface AutoItem {
    id: number | string;
    label: string;
}

interface FieldState<T extends AutoItem> {
    options: T[];
    value: T | null;
    lastFetchedText: string;
}

export const useMultiFieldAutocomplete = <T extends AutoItem>(
    searchApi: (key: string, text: string) => Promise<T[]>,
    getByIdApi?: (key: string, id: T['id']) => Promise<T>
) => {
    const [fields, setFields] = useState<Record<string, FieldState<T>>>({});
    const timersRef = useRef<Record<string, number>>({});

    /** init khi EDIT (chỉ có id) */
    const initById = async (key: string, id: T['id']) => {
        if (!getByIdApi) return;

        const item = await getByIdApi(key, id);

        setFields(prev => ({
            ...prev,
            [key]: {
                options: [item],
                value: item,
                lastFetchedText: item.label
            }
        }));
    };

    /** search khi user nhập */
    const handleInputChange = (key: string, input: string) => {
        const text = input.trim();
        const state = fields[key] ?? { options: [], value: null, lastFetchedText: "" };

        // clear timer
        if (timersRef.current[key]) {
            clearTimeout(timersRef.current[key]);
        }

        if (!text) return;

        // backspace → không call
        if (text.length < state.lastFetchedText.length) return;

        // đã cover LIKE %%
        const covered = state.options.some(opt =>
            opt.label.toUpperCase().includes(text.toUpperCase())
        );
        if (covered) return;

        timersRef.current[key] = window.setTimeout(async () => {
            const data = await searchApi(key, text);

            if (data.length > 0) {
                setFields(prev => ({
                    ...prev,
                    [key]: {
                        ...state,
                        options: data,
                        lastFetchedText: text
                    }
                }));
            }
        }, 1000);
    };

    /** select option */
    const handleSelect = (key: string, value: T | null) => {
        setFields(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                value
            }
        }));
    };

    const getField = (key: string): FieldState<T> => (
        fields[key] ?? { options: [], value: null, lastFetchedText: "" }
    );

    return {
        getField,
        handleInputChange,
        handleSelect,
        initById
    };
};
