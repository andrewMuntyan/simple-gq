import React from 'react';

import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { CreateCategoryForm, CREATE_CATEGORY_MUTATION } from '.';
import { GET_CATEGORIES } from '../CategoriesList';
import { AppContext } from '../../context';
import { getMessage } from '../../utils';

import { fakeCategory } from '../../testUtils';

const categoryData = fakeCategory();
const { name: newCategoryName } = categoryData;
const mutationVariables = { name: newCategoryName };
const newCategoryResponseData = {
  createCategory: categoryData
};

const mocks = [
  {
    request: {
      query: CREATE_CATEGORY_MUTATION,
      variables: mutationVariables
    },
    result: jest.fn(() => ({ data: newCategoryResponseData }))
  }
];

describe('<CreateCategoryForm />', () => {
  it('renders and maches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateCategoryForm />
      </MockedProvider>
    );

    const formComponent = wrapper.find('[data-test="add-entity-form"]');
    expect(formComponent).toHaveLength(1);
    expect(toJSON(formComponent)).toMatchSnapshot();
  });

  it('calls the mutation and updates local cache', async () => {
    // since <CreateCategoryForm /> component interacts
    // with apollo local cashe after create Category mutation is made
    // we have to prepare sych local apollo cache
    const cache = new InMemoryCache();
    cache.writeQuery({
      query: GET_CATEGORIES,
      data: { categories: [] }
    });

    // cache initialised with empty array for categories
    const { categories: initialCategoriesData } = cache.readQuery({
      query: GET_CATEGORIES
    });
    expect(initialCategoriesData).toBeInstanceOf(Array);
    expect(initialCategoriesData).toHaveLength(0);

    const showMessage = jest.fn();
    const wrapper = mount(
      <MockedProvider mocks={mocks} cache={cache}>
        <AppContext.Provider value={[{ showMessage }]}>
          <CreateCategoryForm />
        </AppContext.Provider>
      </MockedProvider>
    );

    const inputSelector = '[data-test="text-field"]';
    const formSelector = '[data-test="add-entity-form"]';

    // we have the input control
    const pristineInput = wrapper.find(inputSelector);
    expect(pristineInput).toHaveLength(1);
    expect(pristineInput.props().value).toEqual('');

    // typing to input
    pristineInput.simulate('change', {
      target: { value: newCategoryName }
    });

    await wait();
    wrapper.update();

    // input value is changed
    const dirtyInput = wrapper.find(inputSelector);
    expect(dirtyInput.props().value).toEqual(newCategoryName);

    // form submitted
    const form = wrapper.find(formSelector);
    expect(form).toHaveLength(1);
    form.simulate('submit');

    await wait(50);

    // Check if mutation has been called
    expect(mocks[0].result).toHaveBeenCalledTimes(1);

    // Check if success message was shown
    expect(showMessage).toHaveBeenCalledTimes(1);
    expect(showMessage).toHaveBeenCalledWith(getMessage(true));

    // cache is updated with data from mocked response
    const { categories: resultedCategoriesData } = cache.readQuery({
      query: GET_CATEGORIES
    });

    expect(resultedCategoriesData).toBeInstanceOf(Array);
    expect(resultedCategoriesData).toHaveLength(1);
    expect(resultedCategoriesData[0]).toEqual(categoryData);
  });

  // TODO: add test for case whent there is an error
});
