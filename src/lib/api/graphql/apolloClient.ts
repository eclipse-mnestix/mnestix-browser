// src/lib/graphql/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// TODO replace hardcoded URL
const httpLink = createHttpLink({
    uri: 'http://localhost:5149/graphql/',
    credentials: 'include'
});

export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'network-only'
        }
    }
});