import {QueryCache, MutationCache} from '@tanstack/react-query';
import {logger} from './logger';

export function createQueryClientConfig() {
    return {
        defaultOptions: {
            queries: {
                retry: 1,
                staleTime: 30_000,
            },
            mutations: {
                retry: 1,
            },
        },
        queryCache: new QueryCache({
            onError: (error: unknown, query) => {
                logger.error('query', 'Query failed', {
                    queryKey: JSON.stringify(query.queryKey),
                    error: typeof error === 'string' ? error : String(error),
                });
            },
        }),
        mutationCache: new MutationCache({
            onError: (error: unknown) => {
                logger.error('query', 'Mutation failed', {
                    error: typeof error === 'string' ? error : String(error),
                });
            },
        }),
    };
}
