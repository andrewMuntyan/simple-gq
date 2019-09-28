import React from 'react';

import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import { CategoryListRow, DELETE_CATEGORY } from '.';
import { GET_CATEGORIES } from '../CategoriesList';

import {
  fakeCategory,
  waitAndUpdateWrapper,
  fakeGQError,
  getMockedStaff
} from '../../testUtils';

const categoryData = fakeCategory();
const { name: removedCategoryName } = categoryData;
const mutationVariables = {
  ok: { name: removedCategoryName },
  fail: { name: 'error' }
};
const removedCategoryResponseData = {
  deleteCategory: categoryData
};

const getMocks = ({ isError = false } = {}) => [
  {
    request: {
      query: DELETE_CATEGORY,
      variables: mutationVariables.ok
    },
    result: jest.fn(() =>
      isError ? fakeGQError : { data: removedCategoryResponseData }
    )
  }
];

const cacheInitialQueries = [
  {
    query: GET_CATEGORIES,
    data: { categories: [categoryData] }
  }
];

// TODO: Do not want to use MUI testing tools like createRender() or smth
// but have to make selection better. Add unique attr or smth.
const deleteBtnSelector = 'button';

describe('<CategoryListRow />', () => {
  it('renders and maches snapshot', () => {
    const { MockedAppProvider } = getMockedStaff();
    const wrapper = mount(
      <MockedAppProvider>
        <CategoryListRow data={categoryData} />
      </MockedAppProvider>
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('should set selectedCategory to AppState', () => {
    const { MockedAppProvider, setAppStateMock } = getMockedStaff();
    const wrapper = mount(
      <MockedAppProvider>
        <CategoryListRow data={categoryData} />
      </MockedAppProvider>
    );

    expect(setAppStateMock).toHaveBeenCalledTimes(0);

    wrapper.simulate('click');

    expect(setAppStateMock).toHaveBeenCalledTimes(1);
    expect(setAppStateMock).toHaveBeenCalledWith({
      selectedCategory: categoryData.name,
      searchTerm: ''
    });
  });

  it('calls the mutation and updates local cache', async () => {
    const mocks = getMocks();
    const { onActionDone, cache, MockedAppProvider } = getMockedStaff({
      mocks,
      cacheInitialQueries
    });

    // cache initialised with array
    const { categories: initialCategoriesData } = cache.readQuery({
      query: GET_CATEGORIES
    });
    expect(initialCategoriesData).toBeInstanceOf(Array);
    expect(initialCategoriesData).toHaveLength(1);
    expect(initialCategoriesData[0]).toEqual(categoryData);

    const wrapper = mount(
      <MockedAppProvider>
        <CategoryListRow data={categoryData} />
      </MockedAppProvider>
    );

    // delete button is rendered
    const deleteBtn = wrapper.find(deleteBtnSelector);
    expect(deleteBtn).toHaveLength(1);

    // deleteBtn clicked
    deleteBtn.simulate('click');

    await waitAndUpdateWrapper(wrapper);

    // Check if mutation has been called
    expect(mocks[0].result).toHaveBeenCalledTimes(1);

    // Check if success message was shown
    expect(onActionDone).toHaveBeenCalledTimes(1);
    expect(onActionDone).toHaveBeenCalledWith({
      data: removedCategoryResponseData
    });

    await waitAndUpdateWrapper(wrapper);

    // cache is updated with data from mocked response
    const { categories: resultedCategoriesData } = cache.readQuery({
      query: GET_CATEGORIES
    });

    expect(resultedCategoriesData).toBeInstanceOf(Array);
    expect(resultedCategoriesData).toHaveLength(0);
  });

  it('correctly reacts on an graphql error', async () => {
    const mocks = getMocks({ isError: true });
    const { onActionDone, MockedAppProvider } = getMockedStaff({
      mocks,
      cacheInitialQueries
    });
    const wrapper = mount(
      <MockedAppProvider>
        <CategoryListRow data={categoryData} />
      </MockedAppProvider>
    );

    // delete button is rendered
    const deleteBtn = wrapper.find(deleteBtnSelector);
    // deleteBtn clicked
    deleteBtn.simulate('click');

    await waitAndUpdateWrapper(wrapper);

    // Check if mutation has been called
    expect(mocks[0].result).toHaveBeenCalledTimes(1);

    // Check if error message was shown
    expect(onActionDone).toHaveBeenCalledTimes(1);
    const error = onActionDone.mock.calls[0][0];
    expect(error.toString()).toEqual(
      'Error: GraphQL error: invalid input data'
    );
  });
});
