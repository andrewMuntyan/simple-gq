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
