import {logger} from './logger';

export function initPerformanceMonitoring(): void {
    trackPageLoad();
    trackGlobalErrors();

    if (import.meta.env.DEV) {
        trackLongTasks();
    }
}

function trackPageLoad(): void {
    const report = () => {
        const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (entries.length === 0) return;

        const nav = entries[0];
        logger.info('perf', 'Page loaded', {
            ttfb_ms: Math.round(nav.responseStart - nav.startTime),
            domContentLoaded_ms: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
            loadComplete_ms: Math.round(nav.loadEventEnd - nav.startTime),
            domInteractive_ms: Math.round(nav.domInteractive - nav.startTime),
            transferSize_kb: Math.round(nav.transferSize / 1024),
        });
    };

    if (document.readyState === 'complete') {
        setTimeout(report, 0);
    } else {
        window.addEventListener('load', () => setTimeout(report, 0));
    }
}

function trackGlobalErrors(): void {
    window.addEventListener('error', (event: ErrorEvent) => {
        logger.error('app', 'Unhandled error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
        }, event.error);
    });

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        logger.error('app', 'Unhandled promise rejection', {
            reason: event.reason instanceof Error ? event.reason.message : String(event.reason),
        }, event.reason);
    });
}

function trackLongTasks(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                logger.warn('perf', 'Long task detected', {
                    duration_ms: Math.round(entry.duration),
                    startTime_ms: Math.round(entry.startTime),
                });
            }
        });
        observer.observe({entryTypes: ['longtask']});
    } catch {
        // longtask not supported in this browser
    }
}
