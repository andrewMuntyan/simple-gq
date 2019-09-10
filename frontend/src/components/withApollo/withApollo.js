import React from 'react';

import { ApolloClient } from 'apollo-client';
// import { ApolloLink, concat } from "apollo-link";
import { ApolloProvider } from '@apollo/react-hooks';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
// Apollo HTTP Link
const httpLink = new HttpLink({
  uri: 'http://localhost:4000'
});
// Apollo Authentication Link
// const authMiddleware = new ApolloLink((operation, forward) => {
//   operation.setContext({
//     headers: {
//       authorization: localStorage.getItem('authToken')
//     }
//   })

//   return forward(operation)
// })
// Create Apollo Link with cache
const client = new ApolloClient({
  // link: concat(authMiddleware, httpLink),
  link: httpLink,
  cache: new InMemoryCache()
});
// Preconfigured HOC
const withApollo = BaseComponent => props => (
  <ApolloProvider client={client}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <BaseComponent {...props} />
  </ApolloProvider>
);
export default withApollo;
