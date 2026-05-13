import type {LogLevel, LogCategory, LogEntry, LoggerConfig} from './types';
import {logStore} from './logStore';

const LEVEL_ORDER: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const CONSOLE_METHOD: Record<LogLevel, 'debug' | 'info' | 'warn' | 'error'> = {
    debug: 'debug',
    info: 'info',
    warn: 'warn',
    error: 'error',
};

let idCounter = 0;

const config: LoggerConfig = {
    minConsoleLevel: import.meta.env.DEV ? 'debug' : 'warn',
    enableConsole: import.meta.env.DEV,
    maxBufferSize: 500,
};

function serializeError(err: unknown): LogEntry['error'] | undefined {
    if (!err) return undefined;
    if (err instanceof Error) {
        return {name: err.name, message: err.message, stack: err.stack};
    }
    return {name: 'Error', message: String(err)};
}

function log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: Record<string, unknown>,
    error?: unknown,
): void {
    const entry: LogEntry = {
        id: ++idCounter,
        timestamp: new Date().toISOString(),
        level,
        category,
        message,
        data,
        error: serializeError(error),
    };

    logStore.push(entry);

    if (config.enableConsole && LEVEL_ORDER[level] >= LEVEL_ORDER[config.minConsoleLevel]) {
        const method = CONSOLE_METHOD[level];
        const prefix = `[${level.toUpperCase()}][${category}]`;
        if (entry.error) {
            console[method](prefix, message, data ?? '', entry.error);
        } else if (data) {
            console[method](prefix, message, data);
        } else {
            console[method](prefix, message);
        }
    }
}

export const logger = {
    debug: (category: LogCategory, message: string, data?: Record<string, unknown>) =>
        log('debug', category, message, data),

    info: (category: LogCategory, message: string, data?: Record<string, unknown>) =>
        log('info', category, message, data),

    warn: (category: LogCategory, message: string, data?: Record<string, unknown>, error?: unknown) =>
        log('warn', category, message, data, error),

    error: (category: LogCategory, message: string, data?: Record<string, unknown>, error?: unknown) =>
        log('error', category, message, data, error),

    setConfig: (partial: Partial<LoggerConfig>) => {
        Object.assign(config, partial);
    },

    getStore: () => logStore,
};
