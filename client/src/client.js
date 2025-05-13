import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
export const client = new ApolloClient({
    link: createHttpLink({
        uri: 'http://localhost:3001/graphql',
        credentials: 'include',
    }),
    cache: new InMemoryCache(),
});
export default client;
//# sourceMappingURL=client.js.map