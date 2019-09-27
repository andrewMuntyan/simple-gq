import React from 'react';

import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { CreateCategoryForm, CREATE_CATEGORY_MUTATION } from '.';
import { GET_CATEGORIES } from '../CategoriesList';
import { SnackBarCtx } from '../../context';

import { fakeCategory, waitAndUpdateWrapper } from '../../testUtils';

const categoryData = fakeCategory();
const { name: newCategoryName } = categoryData;
const mutationVariables = {
  ok: { name: newCategoryName },
  fail: { name: 'error' }
};
const newCategoryResponseData = {
  createCategory: categoryData
};

const mocks = [
  {
    request: {
      query: CREATE_CATEGORY_MUTATION,
      variables: mutationVariables.ok
    },
    result: jest.fn(() => ({ data: newCategoryResponseData }))
  },
  {
    request: {
      query: CREATE_CATEGORY_MUTATION,
      variables: mutationVariables.fail
    },
    result: jest.fn(() => ({
      errors: [
        {
          message: 'invalid input data',
          path: ['createCategory']
        }
      ],
      data: null
    }))
  }
];

const inputHTMLElementSelector = '[data-test="text-field"]';
const formSelector = '[data-test="add-entity-form"]';

describe('<CreateCategoryForm />', () => {
  it('renders and maches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateCategoryForm />
      </MockedProvider>
    );

    expect(toJSON(wrapper)).toMatchSnapshot();

    // create entity form rendered
    const formComponent = wrapper.find(formSelector);
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

    const onActionDone = jest.fn();
    const wrapper = mount(
      <MockedProvider mocks={mocks} cache={cache}>
        <SnackBarCtx.Provider value={{ onActionDone }}>
          <CreateCategoryForm />
        </SnackBarCtx.Provider>
      </MockedProvider>
    );

    // we have the input control
    const pristineInput = wrapper.find(inputHTMLElementSelector);
    expect(pristineInput).toHaveLength(1);
    expect(pristineInput.props().value).toEqual('');

    // typing to input
    pristineInput.simulate('change', {
      target: { value: newCategoryName }
    });

    await waitAndUpdateWrapper(wrapper);

    // input value is changed
    const dirtyInput = wrapper.find(inputHTMLElementSelector);
    expect(dirtyInput.props().value).toEqual(newCategoryName);

    // form submitted
    const form = wrapper.find(formSelector);
    expect(form).toHaveLength(1);
    form.simulate('submit');

    await waitAndUpdateWrapper(wrapper);

    // Check if mutation has been called
    expect(mocks[0].result).toHaveBeenCalledTimes(1);

    // Check if success message was shown
    expect(onActionDone).toHaveBeenCalledTimes(1);

    // Check if input value was cleared
    await waitAndUpdateWrapper(wrapper);
    const submittedInput = wrapper.find(inputHTMLElementSelector);
    expect(submittedInput.props().value).toEqual('');

    expect(onActionDone).toHaveBeenCalledWith({
      data: { createCategory: categoryData }
    });

    // cache is updated with data from mocked response
    const { categories: resultedCategoriesData } = cache.readQuery({
      query: GET_CATEGORIES
    });

    expect(resultedCategoriesData).toBeInstanceOf(Array);
    expect(resultedCategoriesData).toHaveLength(1);
    expect(resultedCategoriesData[0]).toEqual(categoryData);
  });

  it('correctly reacts on an graphql error', async () => {
    const onActionDone = jest.fn();
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SnackBarCtx.Provider value={{ onActionDone }}>
          <CreateCategoryForm />
        </SnackBarCtx.Provider>
      </MockedProvider>
    );

    const inputValue = mutationVariables.fail.name;

    // typing to input and form submitting
    const input = wrapper.find(inputHTMLElementSelector);
    const form = wrapper.find(formSelector);
    input.simulate('change', {
      target: { value: inputValue }
    });
    form.simulate('submit');

    await waitAndUpdateWrapper(wrapper);

    // Check if mutation has been called
    expect(mocks[1].result).toHaveBeenCalledTimes(1);

    // Check if input value was not cleared
    await waitAndUpdateWrapper(wrapper);
    const submittedInput = wrapper.find(inputHTMLElementSelector);
    expect(submittedInput.props().value).toEqual(inputValue);

    // Check if error message was shown
    expect(onActionDone).toHaveBeenCalledTimes(1);
    const error = onActionDone.mock.calls[0][0];
    expect(error.toString()).toEqual(
      'Error: GraphQL error: invalid input data'
    );
  });
});
