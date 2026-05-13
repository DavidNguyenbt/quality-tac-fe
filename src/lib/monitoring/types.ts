export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogCategory = 'http' | 'react' | 'auth' | 'query' | 'perf' | 'app';

export interface LogEntry {
    id: number;
    timestamp: string;
    level: LogLevel;
    category: LogCategory;
    message: string;
    data?: Record<string, unknown>;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}

export interface LoggerConfig {
    minConsoleLevel: LogLevel;
    enableConsole: boolean;
    maxBufferSize: number;
}
