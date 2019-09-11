import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
// eslint-disable-next-line import/no-extraneous-dependencies
import DeleteIcon from '@material-ui/icons/Delete';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { GET_CATEGORIES } from '../CategoriesList';
import { GET_WORDS } from '../CategoryContent';

export const DELETE_CATEGORY = gql`
  mutation DELETE_CATEGORY($name: String!) {
    deleteCategory(name: $name) {
      id
      name
    }
  }
`;

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(theme => ({
  item: {
    userSelect: 'none',
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

const ListRow = ({ data: categoryData, onItemClick, selectedItem }) => {
  const { name } = categoryData;
  const classes = useStyles();

  const [deleteCategory, { data, loading, error }] = useMutation(
    DELETE_CATEGORY,
    {
      variables: { name },
      update(
        cache,
        {
          // TODO: we need better names
          data: { deleteCategory: deletedCategory }
        }
      ) {
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

        // cache.readQuery throws an error if there are no words in local cache
        // make it silent for now
        // TODO: try to use fragment here
        try {
          const { words } = cache.readQuery({
            query: GET_WORDS,
            variables: { category: deletedCategory.name }
          });
          const newWords = words.filter(
            word => word.category.name !== deletedCategory.name
          );
          cache.writeQuery({
            query: GET_WORDS,
            variables: { category: deletedCategory.name },
            data: { words: newWords }
          });
        } catch (queryError) {
          console.error(queryError);
        }
      }
    }
  );

  return (
    <ListItem
      button
      selected={name === selectedItem}
      onClick={onItemClick}
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
          onClick={deleteCategory}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </ListItem>
  );
};

ListRow.propTypes = {
  selectedItem: PropTypes.string,
  onItemClick: PropTypes.func.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired
};
ListRow.defaultProps = {
  selectedItem: null
};

export default ListRow;
