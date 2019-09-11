import React, { useContext } from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { WordContent } from '../WordContent';
import { Grid } from '../Grid';

import { AppContext } from '../../context';

export const GET_WORDS = gql`
  query GET_WORDS($category: String!) {
    words(where: { category: { name: $category } }) {
      category {
        name
      }
      id
      content
      createdAt
      updatedAt
    }
  }
`;

// eslint-disable-next-line no-unused-vars
const CategoryContent = () => {
  const [{ selectedCategory }] = useContext(AppContext);

  const { data, loading, error, fetchMore } = useQuery(GET_WORDS, {
    variables: { category: selectedCategory }
  });

  // TODO: add spinner
  if (loading) {
    return <h2>Loading Words for {selectedCategory} category...</h2>;
  }

  // do not render until we get some data
  if (!data) {
    return null;
  }

  const { words = [] } = data;
  return words.length ? (
    <Grid
      itemsData={words}
      CellRenderer={WordContent}
      selectedCategory={selectedCategory}
    />
  ) : (
    <h2>There is Nothing... Add new Word!</h2>
  );
};

export default CategoryContent;
