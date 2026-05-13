import { useState, useEffect } from "react";

interface PaginationModel {
    pageSize: number;
    page: number;
}

export const usePagination = () => {
    const LOCAL_KEY = "paginationModel";

    const stored = localStorage.getItem(LOCAL_KEY);
    const initialModel: PaginationModel = stored
        ? JSON.parse(stored)
        : { pageSize: 10, page: 0 };

    const [paginationModel, setPaginationModel] = useState<PaginationModel>(initialModel);

    useEffect(() => {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(paginationModel));
    }, [paginationModel]);

    return { paginationModel, setPaginationModel };
};