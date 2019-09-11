import React from 'react';
import PropTypes from 'prop-types';

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

const CategoriesList = ({ onCategoryPick, selectedCategory }) => {
  const { data, loading, error, fetchMore } = useQuery(GET_CATEGORIES);
  const { categories = [] } = data;

  if (loading) {
    return <h2>Loading Categories...</h2>;
  }

  // TODO: add spinner
  return categories.length ? (
    <List
      itemsData={categories}
      RowRenderer={ListRow}
      onItemClick={onCategoryPick}
      selectedItem={selectedCategory}
    />
  ) : (
    <h2>There is Nothing... Add new Category!</h2>
  );
};

CategoriesList.propTypes = {
  onCategoryPick: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string
};
CategoriesList.defaultProps = {
  selectedCategory: null
};

export default CategoriesList;
