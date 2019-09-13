import React, { useContext } from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { CategoryListRow } from '../CategoryListRow';
import { List } from '../List';

import { AppContext } from '../../context';

export const GET_CATEGORIES = gql`
  query GET_CATEGORIES {
    categories {
      id
      name
    }
  }
`;

const CategoriesList = () => {
  const [{ onActionDone }] = useContext(AppContext);

  const { data, loading, error } = useQuery(GET_CATEGORIES);

  if (loading) {
    return <h2>Loading Categories...</h2>;
  }

  if (error) {
    // show message according to results
    onActionDone(error);
    return <h2>Something went wrong...</h2>;
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
