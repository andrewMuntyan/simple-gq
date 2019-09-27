import React, { useCallback, useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AddEntityForm } from '../AddEntityForm';
import { GET_CATEGORIES } from '../CategoriesList';

import { SnackBarCtx } from '../../context';
import { showDevError } from '../../utils';

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
        // cache.readQuery throws an error if there are no words in local cache
        // see https://github.com/apollographql/react-apollo/issues/2175
        // make it silent for now
        try {
          const { categories } = cache.readQuery({ query: GET_CATEGORIES });
          cache.writeQuery({
            query: GET_CATEGORIES,
            data: { categories: categories.concat([newCategoryData]) }
          });
        } catch (queryError) {
          showDevError(queryError);
        }
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
