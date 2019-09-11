import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { CategoryListRow } from '../CategoryListRow';
import { List } from '../List';

export const GET_CATEGORIES = gql`
  query GET_CATEGORIES {
    categories {
      id
      name
    }
  }
`;

const CategoriesList = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_CATEGORIES);
  const { categories = [] } = data;

  if (loading) {
    return <h2>Loading Categories...</h2>;
  }

  // TODO: add spinner
  return categories.length ? (
    <List itemsData={categories} RowRenderer={CategoryListRow} />
  ) : (
    <h2>There is Nothing... Add new Category!</h2>
  );
};

export default CategoriesList;
