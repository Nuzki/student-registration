import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  cache: new InMemoryCache(),
  // Add error handling if needed
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) console.log('GraphQL Errors:', graphQLErrors);
    if (networkError) console.log('Network Error:', networkError);
  },
});

export default client;