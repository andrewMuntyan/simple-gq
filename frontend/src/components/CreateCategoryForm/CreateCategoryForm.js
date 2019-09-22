import React, { useCallback, useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { SnackBarCtx } from '../../context';

import { AddEntityForm } from '../AddEntityForm';
import { GET_CATEGORIES } from '../CategoriesList';

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CREATE_CATEGORY_MUTATION($name: String!) {
    createCategory(name: $name) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const CreateCategoryForm = () => {
  const { onActionDone } = useContext(SnackBarCtx);

  const [createcategory, { loading, error }] = useMutation(
    CREATE_CATEGORY_MUTATION,
    {
      update(
        cache,
        {
          data: { createCategory: newCategoryData }
        }
      ) {
        const { categories } = cache.readQuery({ query: GET_CATEGORIES });
        cache.writeQuery({
          query: GET_CATEGORIES,
          data: { categories: categories.concat([newCategoryData]) }
        });
      }
    }
  );

  const onSubmitHandler = useCallback(
    async value => {
      return createcategory({
        variables: { name: value }
      })
        .then(onActionDone)
        .catch(e => {
          onActionDone(e);
          throw e;
        });
    },
    [createcategory, onActionDone]
  );

  return (
    <AddEntityForm
      label="Add new category"
      onSubmit={onSubmitHandler}
      loading={loading}
      error={!!error}
    />
  );
};

export default CreateCategoryForm;
