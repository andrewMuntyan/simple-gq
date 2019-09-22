import React from 'react';

import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';

import { getFakeCategoriesData, waitAndUpdateWrapper } from '../../testUtils';
import { SnackBarCtx } from '../../context';

import { CategoriesList, GET_CATEGORIES } from '.';

describe('<CategoriesList />', () => {
  it('renders with proper data in loading phase', async () => {
    const mocks = [
      {
        // when someone makes a request with this query and variable combo
        request: { query: GET_CATEGORIES },
        // return this fake data (mocked data)
        result: {
          data: getFakeCategoriesData()
        }
      }
    ];
    const onActionDone = jest.fn();
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SnackBarCtx.Provider value={{ onActionDone }}>
          <CategoriesList />
        </SnackBarCtx.Provider>
      </MockedProvider>
    );

    const ListComponentSelector = '[data-test="list-component"]';

    // ListComponent should not be rendered
    expect(wrapper.find(ListComponentSelector)).toHaveLength(0);

    // this is first phase of rendering when categories are still loading
    expect(wrapper.text()).toContain('Loading Categories...');

    // wait for query result
    await waitAndUpdateWrapper(wrapper);

    const ListComponent = wrapper.find(ListComponentSelector);
    // ListComponent should be rendered
    expect(ListComponent).toHaveLength(1);

    // fetched data should be passed to ListComponent with prop itemsData
    const { itemsData } = ListComponent.props();
    expect(itemsData).toEqual(getFakeCategoriesData().categories);
  });

  it('Show proper message if there is no Data in DB', async () => {
    const mocks = [
      {
        // when someone makes a request with this query and variable combo
        request: { query: GET_CATEGORIES },
        // return this fake data (mocked data)
        result: {
          data: { categories: [] }
        }
      }
    ];
    const onActionDone = jest.fn();
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SnackBarCtx.Provider value={{ onActionDone }}>
          <CategoriesList />
        </SnackBarCtx.Provider>
      </MockedProvider>
    );
    // wait for query result
    await waitAndUpdateWrapper(wrapper);
    const ListComponentSelector = '[data-test="list-component"]';

    // ListComponent should not be rendered
    expect(wrapper.find(ListComponentSelector)).toHaveLength(0);
    expect(wrapper.text()).toContain('There is Nothing... Add new Category!');
  });

  // TODO: Add proper error handling tests
});
