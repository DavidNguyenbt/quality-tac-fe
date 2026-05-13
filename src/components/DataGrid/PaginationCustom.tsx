import { styled, TablePaginationProps } from "@mui/material";
import { gridPageCountSelector, GridPagination, useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import MuiPagination from "@mui/material/Pagination";

function Pagination(
    {
        page,
        onPageChange,
        className,
    }: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <MuiPagination
            sx={{
                mt: -8,
                mr: -4
            }}
            color={'secondary'}
            className={className}
            count={pageCount}
            page={page + 1}
            shape={'rounded'}
            onChange={(event, newPage) => {
                onPageChange(event as any, newPage - 1);
            }}
        />
    );
}

const StyledGridPagination = styled(GridPagination)(({ theme }) => ({
    "& .MuiPaginationItem-root": {
        color: theme.color.text.o1,
    },
}));

export function PaginationCustom(props: any) {
    return (
        <div style={{
            display: "flex",
            width: "100%",
            justifyContent: 'end',
            position: 'sticky',
            zIndex: 10,
            right: 0,
            // borderTop: '1px solid #e0e0e0',
        }}>
            <StyledGridPagination
                ActionsComponent={Pagination}  {...props} />
        </div>
    )
}