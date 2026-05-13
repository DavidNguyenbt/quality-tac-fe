import type {LogEntry, LogLevel, LogCategory} from './types';

type Subscriber = (entry: LogEntry) => void;

class LogStore {
    private buffer: (LogEntry | null)[];
    private head = 0;
    private count = 0;
    private subscribers: Subscriber[] = [];

    constructor(private capacity: number = 500) {
        this.buffer = new Array(capacity).fill(null);
    }

    push(entry: LogEntry): void {
        this.buffer[this.head] = entry;
        this.head = (this.head + 1) % this.capacity;
        if (this.count < this.capacity) this.count++;
        for (const fn of this.subscribers) fn(entry);
    }

    getAll(): LogEntry[] {
        if (this.count === 0) return [];
        const start = this.count < this.capacity ? 0 : this.head;
        const result: LogEntry[] = [];
        for (let i = 0; i < this.count; i++) {
            const idx = (start + i) % this.capacity;
            const entry = this.buffer[idx];
            if (entry) result.push(entry);
        }
        return result;
    }

    getByLevel(level: LogLevel): LogEntry[] {
        return this.getAll().filter(e => e.level === level);
    }

    getByCategory(category: LogCategory): LogEntry[] {
        return this.getAll().filter(e => e.category === category);
    }

    clear(): void {
        this.buffer = new Array(this.capacity).fill(null);
        this.head = 0;
        this.count = 0;
    }

    size(): number {
        return this.count;
    }

    subscribe(fn: Subscriber): () => void {
        this.subscribers.push(fn);
        return () => {
            this.subscribers = this.subscribers.filter(s => s !== fn);
        };
    }
}

export const logStore = new LogStore();
