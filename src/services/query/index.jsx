import React from 'react';
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 5000,
            retryDelay: 1000,
        },
    },
})
const Query = ({children}) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default Query;
