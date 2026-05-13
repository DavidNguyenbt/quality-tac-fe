import {QueryKey, useQuery, UseQueryOptions} from "@tanstack/react-query";

interface UseApiGetOptions<TData = unknown, TError = unknown> extends UseQueryOptions<TData, TError> {
    queryKey: QueryKey;
    queryFn: () => Promise<TData>;
}

export const useApiGet = <TData = unknown, TError = unknown>(
    key: QueryKey,
    fn: () => Promise<TData>,
    options?: Omit<UseApiGetOptions<TData, TError>, 'queryKey' | 'queryFn'>
) => useQuery<TData, TError>({queryKey: key, queryFn: fn, ...options});


