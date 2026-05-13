import {Box, Button, Typography} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorFallbackProps {
    error?: Error | null;
}

export function ErrorFallback({error}: ErrorFallbackProps) {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: 2,
            p: 4,
        }}>
            <ErrorOutlineIcon sx={{fontSize: 64, color: 'error.main'}}/>
            <Typography variant="h5" fontWeight={700}>
                Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
                An unexpected error occurred. Please try reloading the page.
            </Typography>
            {import.meta.env.DEV && error && (
                <Box sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    maxWidth: 600,
                    width: '100%',
                    overflow: 'auto',
                }}>
                    <Typography variant="body2" fontFamily="monospace" color="error.main">
                        {error.message}
                    </Typography>
                    {error.stack && (
                        <Typography variant="caption" fontFamily="monospace" component="pre" sx={{
                            mt: 1,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            maxHeight: 200,
                            overflow: 'auto',
                        }}>
                            {error.stack.split('\n').slice(0, 5).join('\n')}
                        </Typography>
                    )}
                </Box>
            )}
            <Button
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{mt: 2}}
            >
                Reload Page
            </Button>
        </Box>
    );
}
