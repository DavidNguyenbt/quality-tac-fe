import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import './index.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoadingProvider } from "@/utils/context/LoadingProvider.tsx";
import { ThemeContextProvider } from './utils/context/ThemeContextProvider';
import { createQueryClientConfig } from '@/lib/monitoring/queryClientConfig';
import { initPerformanceMonitoring } from '@/lib/monitoring/performanceMonitor';
import { initLogTransport } from '@/lib/monitoring/logTransport';
import { ErrorBoundary } from '@/lib/monitoring/ErrorBoundary';
initPerformanceMonitoring();
initLogTransport();
const queryClient = new QueryClient(createQueryClientConfig())

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary fallback={<div style={{ padding: 32 }}>Application failed to load. Please refresh the page.</div>}>
            <ThemeContextProvider>
                <LoadingProvider>
                    <QueryClientProvider client={queryClient}>
                        <App />
                    </QueryClientProvider>
                </LoadingProvider>
            </ThemeContextProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
}