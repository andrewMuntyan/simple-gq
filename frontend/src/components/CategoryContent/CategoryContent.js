import React from 'react';
// import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { WordContent } from '../WordContent';
import { Grid } from '../Grid';

export const GET_WORDS = gql`
  query GET_WORDS {
    words {
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
const CategoryContent = props => {
  const { data, loading, error, fetchMore } = useQuery(GET_WORDS);

  const { words } = data;
  // TODO: add spinner
  return words ? <Grid itemsData={words} CellRenderer={WordContent} /> : null;
};

CategoryContent.propTypes = {};

export default CategoryContent;
