import {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import {
    Badge,
    Box,
    Button,
    Chip,
    Fab,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {logStore} from './logStore';
import type {LogEntry, LogLevel, LogCategory} from './types';

const LEVEL_COLORS: Record<LogLevel, string> = {
    debug: '#9e9e9e',
    info: '#2196f3',
    warn: '#ff9800',
    error: '#f44336',
};

const ALL_LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error'];
const ALL_CATEGORIES: LogCategory[] = ['http', 'react', 'auth', 'query', 'perf', 'app'];

function formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-GB', {hour12: false}) + '.' + String(d.getMilliseconds()).padStart(3, '0');
}

function LogEntryRow({entry}: { entry: LogEntry }) {
    const [expanded, setExpanded] = useState(false);
    const hasDetails = entry.data || entry.error;

    return (
        <Box sx={{
            borderBottom: '1px solid #eee',
            py: 0.5,
            px: 1,
            fontSize: 12,
            fontFamily: 'monospace',
            '&:hover': {bgcolor: '#f5f5f5'},
        }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography sx={{fontSize: 11, color: '#999', minWidth: 85, flexShrink: 0}}>
                    {formatTime(entry.timestamp)}
                </Typography>
                <Chip
                    label={entry.level.toUpperCase()}
                    size="small"
                    sx={{
                        height: 18,
                        fontSize: 10,
                        fontWeight: 700,
                        bgcolor: LEVEL_COLORS[entry.level],
                        color: '#fff',
                        minWidth: 50,
                    }}
                />
                <Chip
                    label={entry.category}
                    size="small"
                    variant="outlined"
                    sx={{height: 18, fontSize: 10, minWidth: 40}}
                />
                <Typography sx={{fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {entry.message}
                </Typography>
                {hasDetails && (
                    <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{p: 0}}>
                        {expanded ? <ExpandLessIcon sx={{fontSize: 16}}/> : <ExpandMoreIcon sx={{fontSize: 16}}/>}
                    </IconButton>
                )}
            </Stack>
            {expanded && hasDetails && (
                <Box sx={{
                    mt: 0.5,
                    ml: 11,
                    p: 1,
                    bgcolor: '#f8f8f8',
                    borderRadius: 0.5,
                    fontSize: 11,
                    maxHeight: 200,
                    overflow: 'auto',
                }}>
                    {entry.data && (
                        <pre style={{margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                            {JSON.stringify(entry.data, null, 2)}
                        </pre>
                    )}
                    {entry.error && (
                        <Box sx={{mt: entry.data ? 1 : 0, color: 'error.main'}}>
                            <Typography sx={{fontSize: 11, fontWeight: 700}}>{entry.error.name}: {entry.error.message}</Typography>
                            {entry.error.stack && (
                                <pre style={{margin: '4px 0 0', fontSize: 10, whiteSpace: 'pre-wrap', opacity: 0.7}}>
                                    {entry.error.stack.split('\n').slice(0, 5).join('\n')}
                                </pre>
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}

export function DevLogPanel() {
    const [open, setOpen] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<LogCategory | 'all'>('all');
    const [errorCount, setErrorCount] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLogs(logStore.getAll());
        setErrorCount(logStore.getByLevel('error').length);

        const unsub = logStore.subscribe((entry) => {
            setLogs(logStore.getAll());
            if (entry.level === 'error') {
                setErrorCount((c) => c + 1);
            }
        });
        return unsub;
    }, []);

    useEffect(() => {
        if (open && listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [logs, open]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                setOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const handleClear = useCallback(() => {
        logStore.clear();
        setLogs([]);
        setErrorCount(0);
    }, []);

    const handleExport = useCallback(() => {
        const json = JSON.stringify(logStore.getAll(), null, 2);
        navigator.clipboard.writeText(json);
    }, []);

    const filteredLogs = useMemo(() => {
        return logs.filter(entry => {
            if (levelFilter !== 'all' && entry.level !== levelFilter) return false;
            if (categoryFilter !== 'all' && entry.category !== categoryFilter) return false;
            return true;
        });
    }, [logs, levelFilter, categoryFilter]);

    return (
        <>
            <Tooltip title="Dev Logs (Ctrl+Shift+L)">
                <Fab
                    size="small"
                    onClick={() => setOpen(!open)}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        zIndex: 9999,
                        bgcolor: open ? '#333' : '#616161',
                        color: '#fff',
                        '&:hover': {bgcolor: '#333'},
                    }}
                >
                    <Badge badgeContent={errorCount} color="error" max={99}>
                        <BugReportIcon fontSize="small"/>
                    </Badge>
                </Fab>
            </Tooltip>

            {open && (
                <Paper
                    elevation={8}
                    sx={{
                        position: 'fixed',
                        bottom: 64,
                        right: 16,
                        width: 700,
                        maxWidth: 'calc(100vw - 32px)',
                        height: 450,
                        maxHeight: 'calc(100vh - 100px)',
                        zIndex: 9998,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{px: 1.5, py: 0.75, bgcolor: '#333', color: '#fff'}}
                    >
                        <Typography sx={{fontSize: 13, fontWeight: 700}}>
                            Dev Logs ({filteredLogs.length})
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Export to clipboard">
                                <IconButton size="small" onClick={handleExport} sx={{color: '#fff'}}>
                                    <ContentCopyIcon sx={{fontSize: 16}}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Clear logs">
                                <IconButton size="small" onClick={handleClear} sx={{color: '#fff'}}>
                                    <DeleteOutlineIcon sx={{fontSize: 16}}/>
                                </IconButton>
                            </Tooltip>
                            <IconButton size="small" onClick={() => setOpen(false)} sx={{color: '#fff'}}>
                                <CloseIcon sx={{fontSize: 16}}/>
                            </IconButton>
                        </Stack>
                    </Stack>

                    {/* Filters */}
                    <Stack direction="row" spacing={1} sx={{px: 1.5, py: 0.75, bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd'}}>
                        <Select
                            size="small"
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value as LogLevel | 'all')}
                            sx={{fontSize: 12, height: 28, minWidth: 90}}
                        >
                            <MenuItem value="all" sx={{fontSize: 12}}>All Levels</MenuItem>
                            {ALL_LEVELS.map(l => (
                                <MenuItem key={l} value={l} sx={{fontSize: 12}}>
                                    <Box component="span" sx={{color: LEVEL_COLORS[l], fontWeight: 700}}>
                                        {l.toUpperCase()}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                        <Select
                            size="small"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value as LogCategory | 'all')}
                            sx={{fontSize: 12, height: 28, minWidth: 110}}
                        >
                            <MenuItem value="all" sx={{fontSize: 12}}>All Categories</MenuItem>
                            {ALL_CATEGORIES.map(c => (
                                <MenuItem key={c} value={c} sx={{fontSize: 12}}>{c}</MenuItem>
                            ))}
                        </Select>
                        <Button
                            size="small"
                            variant="text"
                            onClick={() => { setLevelFilter('all'); setCategoryFilter('all'); }}
                            sx={{fontSize: 11, textTransform: 'none', minWidth: 'auto'}}
                        >
                            Reset
                        </Button>
                    </Stack>

                    {/* Log list */}
                    <Box ref={listRef} sx={{flex: 1, overflow: 'auto'}}>
                        {filteredLogs.length === 0 ? (
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                <Typography sx={{fontSize: 13, color: '#999'}}>No logs</Typography>
                            </Box>
                        ) : (
                            filteredLogs.map((entry) => (
                                <LogEntryRow key={entry.id} entry={entry}/>
                            ))
                        )}
                    </Box>
                </Paper>
            )}
        </>
    );
}
