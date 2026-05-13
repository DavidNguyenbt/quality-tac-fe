import { Box, Paper } from "@mui/material";

type ContentLayoutProps = {
    children: React.ReactNode;
    title?: string;
};

export const ContentLayout = ({ children }: ContentLayoutProps) => {
    return (
        <Box
            mt={2}
            mb={2}
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                minHeight: 0,
            }}
        >
            <Paper
                sx={{
                    padding: 1,
                    height: '100%',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0
                }}
            >
                {children}
            </Paper>
        </Box>
    );
};
