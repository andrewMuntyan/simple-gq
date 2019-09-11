import React from 'react';
// import PropTypes from "prop-types";

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { ListRow } from '../ListRow';
import { List } from '../List';

export const GET_CATEGORIES = gql`
  query GET_CATEGORIES {
    categories {
      id
      name
    }
  }
`;

const CategoryContent = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_CATEGORIES);
  const { categories } = data;
  // TODO: add spinner
  return categories ? (
    <List itemsData={categories} RowRenderer={ListRow} />
  ) : null;
};

export default CategoryContent;
