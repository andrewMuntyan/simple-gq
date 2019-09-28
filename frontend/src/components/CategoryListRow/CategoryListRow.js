import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { GET_CATEGORIES } from '../CategoriesList';
import { GET_WORDS_QUERY } from '../CategoryContent';

import { AppStateCtx, AppStateSetterCtx, SnackBarCtx } from '../../context';
import { showDevError } from '../../utils';

import getClasses from './styles';

export const DELETE_CATEGORY = gql`
  mutation DELETE_CATEGORY($name: String!) {
    deleteCategory(name: $name) {
      id
      name
    }
  }
`;

const ListRow = ({ data: categoryData }) => {
  const { selectedCategory, searchTerm } = useContext(AppStateCtx);
  const { onActionDone } = useContext(SnackBarCtx);
  const setAppState = useContext(AppStateSetterCtx);

  const { name } = categoryData;
  const classes = getClasses();

  const [deleteCategory, { loading }] = useMutation(DELETE_CATEGORY, {
    variables: { name },
    update(
      cache,
      {
        // TODO: we need better names
        data: { deleteCategory: deletedCategory }
      }
    ) {
      // cache.readQuery throws an error if there are no entries in local cache
      // see https://github.com/apollographql/react-apollo/issues/2175
      // make it silent for now
      try {
        const { categories } = cache.readQuery({
          query: GET_CATEGORIES
        });

        const newCategories = categories.filter(
          category => category.name !== deletedCategory.name
        );

        cache.writeQuery({
          query: GET_CATEGORIES,
          data: {
            categories: newCategories
          }
        });

        // words related to removed category will be deleted automatically on backend side
        // since we have `onDelete: CASCADE` in our schema.
        // but we still have to remove words from cache
        cache.writeQuery({
          query: GET_WORDS_QUERY,
          variables: { category: deletedCategory.name, searchTerm },
          data: { words: [] }
        });
      } catch (queryError) {
        showDevError(queryError);
      }
    }
  });

  const onClickHandler = useCallback(
    e => {
      e.preventDefault();
      const {
        target: { textContent }
      } = e;
      setAppState({
        selectedCategory: textContent,
        // to reset searchTerm after selectedCategory is changed
        searchTerm: ''
      });
    },
    [setAppState]
  );

  const onDeleteHandler = useCallback(
    async e => {
      e.stopPropagation();
      return deleteCategory()
        .then(onActionDone)
        .catch(error => {
          onActionDone(error);
        });
    },
    [deleteCategory, onActionDone]
  );

  return (
    <ListItem
      button
      selected={name === selectedCategory}
      onClick={onClickHandler}
      className={classes.item}
    >
      <ListItemText primary={`${name}`} />
      {loading ? (
        <CircularProgress
          className={classes.progress}
          color="secondary"
          size={20}
        />
      ) : (
        <IconButton
          aria-label="delete"
          color="secondary"
          size="small"
          onClick={onDeleteHandler}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </ListItem>
  );
};

ListRow.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired
};

export default ListRow;
