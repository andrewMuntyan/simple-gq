import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';

import { AppContext } from '../../context';
import {
  fakePaginationResponse,
  updateWrapper,
  actWait
} from '../../testUtils';

import { WordsLoadMoreBtn, PAGINATION_QUERY } from '.';

const selectedCategory = 'category1';

const getMocks = (result, error) => [
  {
    request: {
      query: PAGINATION_QUERY,
      variables: { category: selectedCategory }
    },
    result,
    error
  }
];

describe('<WordsLoadMoreBtn />', () => {
  it('renders and displays properly', () => {
    const wrapper = mount(
      <MockedProvider mocks={getMocks(fakePaginationResponse(5))}>
        <AppContext.Provider value={[{ selectedCategory }]}>
          <WordsLoadMoreBtn />
        </AppContext.Provider>
      </MockedProvider>
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('should call the PAGINATION_QUERY mutation', async () => {
    const gettingResult = jest.fn(() => ({ data: fakePaginationResponse(5) }));
    expect(gettingResult).toHaveBeenCalledTimes(0);
    mount(
      <MockedProvider mocks={getMocks(gettingResult)}>
        <AppContext.Provider value={[{ selectedCategory }]}>
          <WordsLoadMoreBtn displayedWordsCount={1} />
        </AppContext.Provider>
      </MockedProvider>
    );
    // wait for query result
    await actWait();
    expect(gettingResult).toHaveBeenCalledTimes(1);
  });

  it('should not render LoadMore if displayedWordsCount >= allItemsCount', async () => {
    // allItemsCount will be goten from query result,
    // so we put it to mocks
    const mocks = getMocks(fakePaginationResponse(1));

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AppContext.Provider value={[{ selectedCategory }]}>
          <WordsLoadMoreBtn displayedWordsCount={1} />
        </AppContext.Provider>
      </MockedProvider>
    );

    const getLoadMoreBtn = () => wrapper.find('button');

    // child dummy LoadMoreBtn should not be rendered
    // until PAGINATION_QUERY is in progress
    expect(getLoadMoreBtn().exists()).toBeFalsy();

    // wait for query result
    await updateWrapper(wrapper);
    // child dummy LoadMoreBtn should not be rendered
    // as PAGINATION_QUERY is done
    // but displayedWordsCount !< allItemsCount
    // 1 !< 1
    expect(getLoadMoreBtn().exists()).toBeFalsy();
  });

  it('should render LoadMore if allItemsCount > displayedWordsCount', async () => {
    // allItemsCount will be goten from query result,
    // so we put it to mocks
    const mocks = getMocks(fakePaginationResponse(100));

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AppContext.Provider value={[{ selectedCategory }]}>
          <WordsLoadMoreBtn displayedWordsCount={10} />
        </AppContext.Provider>
      </MockedProvider>
    );

    const getLoadMoreBtn = () => wrapper.find('button');

    // child dummy LoadMoreBtn should not be rendered
    // until PAGINATION_QUERY is in progress
    expect(getLoadMoreBtn().exists()).toBeFalsy();

    // wait for query result
    await updateWrapper(wrapper, 1000);
    expect(getLoadMoreBtn().exists()).toBeTruthy();
  });

  it('should pass correct props to child dummy <LoadMoreBtn />', async () => {
    const fetchMore = jest.fn();
    // allItemsCount will be goten from query result,
    // so we put it to mocks
    const mocks = getMocks(fakePaginationResponse(120));
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AppContext.Provider value={[{ selectedCategory }]}>
          <WordsLoadMoreBtn displayedWordsCount={15} fetchMore={fetchMore} />
        </AppContext.Provider>
      </MockedProvider>
    );
    await updateWrapper(wrapper);

    expect(wrapper.find('LoadMoreBtn').props()).toMatchObject({
      displayedItemsCount: 15,
      allItemsCount: 120
    });

    // fetchMore function from props is called after
    // buttin inside LoadMoreBtn is clicked
    expect(fetchMore).toHaveBeenCalledTimes(0);
    wrapper.find('button').simulate('click');
    expect(fetchMore).toHaveBeenCalledTimes(1);
  });

  it('should show error notification', async () => {
    const onActionDone = jest.fn();
    const mocks = getMocks(null, [
      {
        message: 'lol',
        locations: [{ line: 2, column: 3 }],
        path: ['wordsConnection'],
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        }
      }
    ]);

    mount(
      <MockedProvider mocks={mocks}>
        <AppContext.Provider value={[{ selectedCategory, onActionDone }]}>
          <WordsLoadMoreBtn displayedWordsCount={15} />
        </AppContext.Provider>
      </MockedProvider>
    );
    expect(onActionDone).toHaveBeenCalledTimes(0);
    await actWait();
    // TODO: figure  out why is is called twice
    expect(onActionDone).toHaveBeenCalledTimes(2);
  });
});
