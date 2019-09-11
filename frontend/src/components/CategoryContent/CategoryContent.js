import React from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { WordContent } from '../WordContent';
import { Grid } from '../Grid';

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
const CategoryContent = ({ selectedCategory }) => {
  const { data, loading, error, fetchMore } = useQuery(GET_WORDS, {
    variables: { category: selectedCategory }
  });

  // TODO: add spinner
  if (loading) {
    return <h2>Loading Words for {selectedCategory} category...</h2>;
  }

  if (!selectedCategory) {
    return null;
  }
  // TODO: move selectedCategory to context!!!
  const cellRenderer = props => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <WordContent {...props} selectedCategory={selectedCategory} />;
  };

  const { words = [] } = data;
  return words.length ? (
    <Grid
      itemsData={words}
      CellRenderer={cellRenderer}
      selectedCategory={selectedCategory}
    />
  ) : (
    <h2>There is Nothing... Add new Word!</h2>
  );
};

CategoryContent.propTypes = {
  selectedCategory: PropTypes.string
};
CategoryContent.defaultProps = {
  selectedCategory: null
};

export default CategoryContent;
