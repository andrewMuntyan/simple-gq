import { act } from 'react-dom/test-utils';

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
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 'uuid2',
      name: 'category 2',
      __typename: 'Category',
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 'uuid3',
      name: 'category 3',
      __typename: 'Category',
      createdAt: '',
      updatedAt: ''
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
