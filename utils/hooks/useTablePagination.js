import React, { useState, useEffect } from "react";
import { useWindowDimensions } from "./useWindowDimensions";

export const useTablePagination = (data, pageSize) => {
    const [page, setPage] = useState(1);
    const minItemIdx = (page - 1) * pageSize;
    const maxItemIdx = page * pageSize - 1;
    const totalItem = data.length;
    const maxPage = Math.ceil(totalItem / pageSize);

    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    const prevPage = () => {
        if(page > 1){
            setPage(page - 1);
        }
    }

    const nextPage = () => {
        if(page < maxPage){
            setPage(page + 1);
        }
    }

    const tableData = !isMobile?data:data.filter((d, i) => i >= minItemIdx && i <= maxItemIdx);

    return {
        page,
        maxPage,
        prevPage,
        nextPage, 
        tableData
    }
}