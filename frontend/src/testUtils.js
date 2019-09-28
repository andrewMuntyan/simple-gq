import React from 'react';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/react-testing';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SnackBarCtx, AppStateCtx, AppStateSetterCtx } from './context';

export const fakeWord = () => ({
  id: 'ck12ag7onfkqb0b1715rirdve',
  content: 'fakeWordContent',
  createdAt: '2019-09-27T15:35:49.223Z',
  updatedAt: '2019-09-27T15:35:49.223Z',
  category: { name: '1', __typename: 'Category' },
  __typename: 'Word'
});

export const getFakeCategoriesData = () => ({
  categories: [
    {
      id: 'uuid1',
      name: 'category 1',
      __typename: 'Category',
      createdAt: '2019-09-28T11:58:36.949Z',
      updatedAt: '2019-09-28T11:58:38.949Z'
    },
    {
      id: 'uuid2',
      name: 'category 2',
      __typename: 'Category',
      createdAt: '2019-09-28T11:58:36.949Z',
      updatedAt: '2019-09-28T11:58:38.949Z'
    },
    {
      id: 'uuid3',
      name: 'category 3',
      __typename: 'Category',
      createdAt: '2019-09-28T11:58:36.949Z',
      updatedAt: '2019-09-28T11:58:38.949Z'
    }
  ]
});

export const fakeCategory = () => getFakeCategoriesData().categories[0];

export const fakePaginationResponse = (count = 0) => ({
  data: {
    wordsConnection: {
      aggregate: { count, __typename: 'AggregateWord' },
      __typename: 'WordConnection'
    }
  }
});

export const fakeGQError = {
  errors: [
    {
      message: 'invalid input data',
      path: ['createCategory']
    }
  ],
  data: null
};

// see https://github.com/airbnb/enzyme/issues/2073
export const waitAndUpdateWrapper = async (wrapper, time = 0) => {
  await act(async () => {
    await new Promise(res => setTimeout(res, time));
    await wrapper.update();
  });
};

export const getMockedStaff = ({
  mocks = [],
  cacheInitialQueries = []
} = {}) => {
  const selectedCategory = 'selectedCategory';
  const searchTerm = 'searchTerm';
  const onActionDone = jest.fn();
  const setAppStateMock = jest.fn();

  // since Tested component may interact
  // with apollo local cashe
  // we have to prepare sych local apollo cache
  const cache = new InMemoryCache();
  if (cacheInitialQueries.length) {
    cacheInitialQueries.forEach(query => cache.writeQuery(query));
  }

  return {
    selectedCategory,
    searchTerm,
    onActionDone,
    setAppStateMock,
    cache,
    // eslint-disable-next-line react/prop-types
    MockedAppProvider: ({ children }) => (
      <MockedProvider mocks={mocks} cache={cache}>
        <SnackBarCtx.Provider value={{ onActionDone }}>
          <AppStateCtx.Provider value={{ selectedCategory, searchTerm }}>
            <AppStateSetterCtx.Provider value={setAppStateMock}>
              {children}
            </AppStateSetterCtx.Provider>
          </AppStateCtx.Provider>
        </SnackBarCtx.Provider>
      </MockedProvider>
    )
  };
};
