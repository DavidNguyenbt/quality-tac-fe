import { useRef, useState } from 'react';
import { useGetDataSearch } from './useGetDataSearch';

export const useFormSearch = () => {
    const { searchResult, fetchSearch, lastFetchedText } = useGetDataSearch();
    const [searchText, setSearchText] = useState("");

    const timerRef = useRef<number | null>(null);

    const handleInputChange = (value: string) => {
        const trimmedValue = value.trim();
        setSearchText(value);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (!trimmedValue) return;

        if (trimmedValue.length < lastFetchedText.length) return;

        const isCovered = searchResult.some(item =>
            item.style.toUpperCase().includes(trimmedValue.toUpperCase())
        );
        if (isCovered) return;

        timerRef.current = window.setTimeout(() => {
            fetchSearch(trimmedValue);
        }, 1000);
    };

    const handleSelectValue = (value: any) => {
        if (!value) return;
        setSearchText(value.style);
    };

    return {
        searchText,
        searchResult,
        handleInputChange,
        handleSelectValue
    };
};
