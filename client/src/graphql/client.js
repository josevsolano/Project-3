import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:3001/graphql', // ← updated port
        credentials: 'include', // if you need cookies/auth
    }),
    cache: new InMemoryCache(),
});
export default client;
//# sourceMappingURL=client.js.map