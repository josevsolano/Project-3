// client/src/apollo.js (or wherever you configure your client)
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3001/graphql',  // ← updated port
    credentials: 'include',                // if you need cookies/auth
  }),
  cache: new InMemoryCache(),
});

export default client;
