import useLocalization from "@/hooks/app/useLocalization";
import { Box, Typography } from "@mui/material";

type LazyLoadPaginationCustomProps = {
    rowCount?: number;
    totalCurrentRow?: number
};

export function LazyLoadPaginationCustom({ rowCount, totalCurrentRow }: LazyLoadPaginationCustomProps) {
    const { t } = useLocalization();
    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                alignItems: "center",
                px: 0,
                py: 2, 
            }}
        >
            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: (theme)=>theme.color.text.o1}}>
                {t?.allTotal}: 
                {totalCurrentRow ===0 ? " -/-" : 
                (
                    <strong>{totalCurrentRow ?? 0}/{rowCount ?? 0}</strong>
                )}
            </Typography>
        </Box>
    );
}