import type {LogEntry, LogLevel} from './types';
import {logStore} from './logStore';

const LEVEL_ORDER: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const FLUSH_INTERVAL_MS = 10_000;
const MAX_BATCH_SIZE = 20;
const MIN_TRANSPORT_LEVEL: LogLevel = 'warn';

let buffer: LogEntry[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

function mapEntry(entry: LogEntry) {
    return {
        timestamp: entry.timestamp,
        level: entry.level,
        category: entry.category,
        message: entry.message,
        data: entry.data,
        error: entry.error,
        userAgent: navigator.userAgent,
        url: window.location.href,
    };
}

async function flush() {
    if (buffer.length === 0) return;

    const batch = buffer.splice(0, MAX_BATCH_SIZE);

    try {
        const baseUrl = import.meta.env.VITE_APP_API_URL as string;
        await fetch(`${baseUrl}/api/v2/logs/frontend`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(batch.map(mapEntry)),
            keepalive: true,
        });
    } catch {
        // silently fail - don't use logger here to avoid infinite loop
    }
}

function onNewEntry(entry: LogEntry) {
    if (LEVEL_ORDER[entry.level] >= LEVEL_ORDER[MIN_TRANSPORT_LEVEL]) {
        buffer.push(entry);
    }

    if (buffer.length >= MAX_BATCH_SIZE) {
        flush();
    }
}

export function initLogTransport() {
    // Only run in production
    if (import.meta.env.DEV) return;

    logStore.subscribe(onNewEntry);

    flushTimer = setInterval(flush, FLUSH_INTERVAL_MS);

    // Flush on page unload
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            flush();
        }
    });
}

export function stopLogTransport() {
    if (flushTimer) {
        clearInterval(flushTimer);
        flushTimer = null;
    }
    flush();
}
