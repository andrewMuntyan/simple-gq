import React from 'react';

import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AppStateCtx, SnackBarCtx } from '../../context';
import { WORDS_PER_PAGE, SEARCH_RESULTS_COUNT } from '../../config';

import { GET_WORDS_QUERY } from '../CategoryContent';
import { PAGINATION_QUERY } from '../WordsLoadMoreBtn';

import { CreateWordForm, CREATE_WORD_MUTATION } from '.';

import { fakeWord, waitAndUpdateWrapper, fakeGQError } from '../../testUtils';

const selectedCategory = 'category1';
const searchTerm = 'searchTerm';
const wrongCategory = 'doesNotExist';
const wordData = fakeWord();
const { content: newWordContent } = wordData;

const newWordResponseData = {
  createWord: wordData
};
const mutationVariables = {
  ok: {
    content: newWordContent,
    category: { connect: { name: selectedCategory } }
  },
  fail: {
    content: newWordContent,
    category: { connect: { name: wrongCategory } }
  }
};

const mocks = [
  {
    request: {
      query: CREATE_WORD_MUTATION,
      variables: mutationVariables.ok
    },
    result: jest.fn(() => ({ data: newWordResponseData }))
  },
  {
    request: {
      query: CREATE_WORD_MUTATION,
      variables: mutationVariables.fail
    },
    result: jest.fn(() => fakeGQError)
  }
];

const inputHTMLElementSelector = '[data-test="text-field"]';
const formSelector = '[data-test="add-entity-form"]';

describe('<CreateWordForm />', () => {
  it('renders and maches snapshot', () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AppStateCtx.Provider value={{ selectedCategory, searchTerm }}>
          <CreateWordForm />
        </AppStateCtx.Provider>
      </MockedProvider>
    );

    expect(toJSON(wrapper)).toMatchSnapshot();

    // create entity form rendered
    const formComponent = wrapper.find('[data-test="add-entity-form"]');
    expect(formComponent).toHaveLength(1);
    expect(toJSON(formComponent)).toMatchSnapshot();
  });

  it('calls the mutation and updates local cache', async () => {
    // since <CreateWordForm /> component interacts
    // with apollo local cashe after create Category mutation is made
    // we have to prepare sych local apollo cache
    const dataSize = searchTerm ? SEARCH_RESULTS_COUNT : WORDS_PER_PAGE;
    const queryVars = {
      variables: { category: selectedCategory, searchTerm, first: dataSize }
    };
    const cache = new InMemoryCache();
    cache.writeQuery({
      query: GET_WORDS_QUERY,
      ...queryVars,
      data: { words: [] }
    });
    cache.writeQuery({
      query: PAGINATION_QUERY,
      ...queryVars,
      data: {
        wordsConnection: {
          aggregate: {
            count: 0,
            __typename: 'AggregateWord'
          },
          __typename: 'WordConnection'
        }
      }
    });

    // cache initialised with empty array for categories
    const { words: initialWordsData } = cache.readQuery({
      query: GET_WORDS_QUERY,
      ...queryVars
    });

    expect(initialWordsData).toBeInstanceOf(Array);
    expect(initialWordsData).toHaveLength(0);

    const onActionDone = jest.fn();
    // TODO: move initialisation code to separate function
    // and call it in beforeEach
    const wrapper = mount(
      <MockedProvider mocks={mocks} cache={cache}>
        <SnackBarCtx.Provider value={{ onActionDone }}>
          <AppStateCtx.Provider value={{ selectedCategory, searchTerm }}>
            <CreateWordForm />
          </AppStateCtx.Provider>
        </SnackBarCtx.Provider>
      </MockedProvider>
    );

    // we have the input control
    const pristineInput = wrapper.find(inputHTMLElementSelector);
    expect(pristineInput).toHaveLength(1);
    expect(pristineInput.props().value).toEqual('');
    // typing to input
    pristineInput.simulate('change', {
      target: { value: newWordContent }
    });
    await waitAndUpdateWrapper(wrapper);
    // input value is changed
    const dirtyInput = wrapper.find(inputHTMLElementSelector);
    expect(dirtyInput.props().value).toEqual(newWordContent);
    // form submitted
    const form = wrapper.find(formSelector);
    expect(form).toHaveLength(1);
    form.simulate('submit');
    await waitAndUpdateWrapper(wrapper);
    // Check if mutation has been called
    expect(mocks[0].result).toHaveBeenCalledTimes(1);
    // Check if success message was shown
    expect(onActionDone).toHaveBeenCalledTimes(1);
    expect(onActionDone).toHaveBeenCalledWith({
      data: newWordResponseData
    });
    // cache is updated with data from mocked response
    const { words: finalWordsCacheData } = cache.readQuery({
      query: GET_WORDS_QUERY,
      ...queryVars
    });
    expect(finalWordsCacheData).toBeInstanceOf(Array);
    expect(finalWordsCacheData).toHaveLength(1);
    expect(finalWordsCacheData[0]).toEqual(wordData);
  });

  it('correctly reacts on an graphql error', async () => {
    const onActionDone = jest.fn();
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SnackBarCtx.Provider value={{ onActionDone }}>
          <AppStateCtx.Provider
            value={{ selectedCategory: wrongCategory, searchTerm }}
          >
            <CreateWordForm />
          </AppStateCtx.Provider>
        </SnackBarCtx.Provider>
      </MockedProvider>
    );

    const inputValue = mutationVariables.fail.content;

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
