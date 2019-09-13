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
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  if (loading) {
    return <h2>Loading Categories...</h2>;
  }
  const { categories = [] } = data;

  // TODO: add spinner
  return categories.length ? (
    <List
      itemsData={categories}
      RowRenderer={CategoryListRow}
      data-test="list-component"
    />
  ) : (
    <h2>There is Nothing... Add new Category!</h2>
  );
};

export default CategoriesList;
