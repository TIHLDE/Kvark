import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // refetch after 5 minutes
        gcTime: Infinity, // Disable garbage collection
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Recreate the query client on the server for each request
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

export function getContext() {
  return {
    queryClient: getQueryClient(),
  };
}

export function Provider({ children, queryClient }: React.PropsWithChildren<{ queryClient: QueryClient }>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
