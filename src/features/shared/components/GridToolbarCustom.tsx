import { Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { ReactNode, useState } from "react";

const StyledQuickFilter = styled(GridToolbarQuickFilter)({
    "& .MuiSvgIcon-root": { color: "#d2d7e0ff" },
});

interface GridToolbarCustomProps {
    children?: ReactNode;
    searchPlaceHolder: string;
    searchWidth?: number;
    paginationModel?: { page: number; pageSize: number };
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    totalRows?: number; // tổng số hàng
}

function GridToolbarCustom({
    children,
    searchWidth,
    searchPlaceHolder,
    paginationModel,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],
    totalRows = 0,
}: GridToolbarCustomProps) {
    const handlePageSizeChange = (event: any) => {
        const newSize = event.target.value;
        if (newSize === -1) {
            onPageSizeChange?.(totalRows); // set pageSize = tất cả hàng
        } else {
            onPageSizeChange?.(newSize);
        }
    };

    return (
        <Box display="flex" flexWrap="wrap" gap={2} mt={1} mb={2} justifyContent="space-between" alignItems="center">
            <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel>Rows per page</InputLabel>
                <Select
                    value={paginationModel?.pageSize === totalRows ? -1 : paginationModel?.pageSize}
                    label="Rows per page"
                    onChange={handlePageSizeChange}
                >
                    {[...pageSizeOptions].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box>
                <StyledQuickFilter
                    sx={{
                        width: searchWidth ?? 300,
                        "& .MuiInputBase-input": { overflow: "hidden", textOverflow: "ellipsis" },
                    }}
                    size="small"
                    variant="outlined"
                    placeholder={searchPlaceHolder}
                />
                {children}
            </Box>
        </Box>
    );
}

export default GridToolbarCustom;
