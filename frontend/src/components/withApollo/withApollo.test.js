import React from 'react';
import { shallow } from 'enzyme';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import toJSON from 'enzyme-to-json';

import { endpoint } from '../../config';

import { withApollo } from '.';

jest.mock('apollo-link-http');
jest.mock('apollo-cache-inmemory');

const BaseComponent = () => <p>base</p>;
const WrappedComponent = withApollo(BaseComponent);

describe('<WithApollo />', () => {
  const wrapper = shallow(<WrappedComponent />);

  it('renders and displays properly', () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('should wrap base component with ApolloProvider', () => {
    const ApolloProvider = wrapper.find('ApolloProvider');
    expect(ApolloProvider).toHaveLength(1);
  });

  it('ApolloProvider should be cobfigured with ApolloClient instance', () => {
    const ApolloProvider = wrapper.find('ApolloProvider');
    const {
      client,
      client: { link, cache }
    } = ApolloProvider.props();
    expect(client).toBeInstanceOf(ApolloClient);
    expect(link).toBeInstanceOf(HttpLink);
    expect(cache).toBeInstanceOf(InMemoryCache);
    expect(HttpLink).toHaveBeenCalledTimes(1);
    expect(HttpLink).toHaveBeenCalledWith({
      uri: endpoint
    });
  });
});
