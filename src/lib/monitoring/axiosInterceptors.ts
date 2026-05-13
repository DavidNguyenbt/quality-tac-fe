import type {AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';
import {logger} from './logger';

declare module 'axios' {
    interface InternalAxiosRequestConfig {
        __requestStartTime?: number;
        __requestId?: number;
    }
}

let requestIdCounter = 0;

export function installAxiosInterceptors(client: AxiosInstance): void {
    client.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            config.__requestStartTime = performance.now();
            config.__requestId = ++requestIdCounter;

            logger.info('http', `>> ${config.method?.toUpperCase()} ${config.url}`, {
                requestId: config.__requestId,
                method: config.method?.toUpperCase(),
                url: config.url,
                params: config.params,
            });

            return config;
        },
        (error: AxiosError) => {
            logger.error('http', 'Request config error', {}, error);
            return Promise.reject(error);
        },
    );

    client.interceptors.response.use(
        (response: AxiosResponse) => {
            const config = response.config;
            const duration = config.__requestStartTime
                ? Math.round(performance.now() - config.__requestStartTime)
                : null;

            logger.info('http', `<< ${config.method?.toUpperCase()} ${config.url} [${response.status}]`, {
                requestId: config.__requestId,
                method: config.method?.toUpperCase(),
                url: config.url,
                status: response.status,
                duration_ms: duration,
            });

            return response;
        },
        (error: AxiosError) => {
            const config = error.config;
            const duration = config?.__requestStartTime
                ? Math.round(performance.now() - config.__requestStartTime)
                : null;

            logger.error('http', `<< ${config?.method?.toUpperCase()} ${config?.url} [${error.response?.status ?? 'NETWORK_ERROR'}]`, {
                requestId: config?.__requestId,
                method: config?.method?.toUpperCase(),
                url: config?.url,
                status: error.response?.status,
                duration_ms: duration,
                errorMessage: error.response?.data
                    ? (error.response.data as Record<string, unknown>).message ?? error.message
                    : error.message,
            }, error);

            return Promise.reject(error);
        },
    );
}
