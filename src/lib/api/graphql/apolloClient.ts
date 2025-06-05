import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

export function createApolloClient(uri: string) {
    const httpLink = createHttpLink({
        uri,
        credentials: 'include'
    });

    return new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
        defaultOptions: {
            query: {
                fetchPolicy: 'network-only'
            }
        }
    });
}