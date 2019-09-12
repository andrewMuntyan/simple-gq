import React from 'react';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { endpoint, prodEndpoint } from '../../config';

// Apollo HTTP Link
const uri =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? endpoint
    : prodEndpoint;

const httpLink = new HttpLink({
  uri
});

// Create Apollo Link with cache
const client = new ApolloClient({
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
