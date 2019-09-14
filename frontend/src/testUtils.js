import { act } from 'react-test-renderer';
import wait from 'waait';

export const fakeWord = () => ({
  content: 'word',
  id: 'uniqueId',
  createdAt: '2019-09-11T21:13:39.695Z'
});

export const getFakeCategoriesData = () => ({
  categories: [
    {
      id: 'uuid1',
      name: 'category 1',
      __typename: 'Category'
    },
    {
      id: 'uuid2',
      name: 'category 2',
      __typename: 'Category'
    },
    {
      id: 'uuid3',
      name: 'category 3',
      __typename: 'Category'
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

// see https://github.com/airbnb/enzyme/issues/2073

// Use this in your test after mounting if you need just need to let the query finish without updating the wrapper
export async function actWait(amount = 0) {
  await act(async () => {
    await wait(amount);
  });
}

// Use this in your test after mounting if you want the query to finish and update the wrapper
export async function updateWrapper(wrapper, amount = 0) {
  await act(async () => {
    await wait(amount);
    wrapper.update();
  });
}
