import { useState } from 'react';
import { showToast } from '@/utils/states/state';
import { searchStyleByText } from '@/network/urls/qc_dashboard';

export interface JobSearchItem {
    style: string;
}

export const useGetDataSearch = () => {
    const [searchResult, setSearchResult] = useState<JobSearchItem[]>([]);
    const [lastFetchedText, setLastFetchedText] = useState<string>("");

    const fetchSearch = async (text: string) => {
        try {
            const data = await searchStyleByText({ text });

            if (Array.isArray(data) && data.length > 0) {
                setSearchResult(data);
                setLastFetchedText(text);
            }
        } catch (error) {
            showToast('Error fetching data', 'error');
        }
    };

    return {
        searchResult,
        lastFetchedText,
        fetchSearch
    };
};
