import React, { useCallback } from 'react';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AddEntityForm } from '../AddEntityForm';
import { GET_CATEGORIES } from '../CategoriesList';

export const CREATE_CATEGORY = gql`
  mutation CREATE_CATEGORY($name: String!) {
    createCategory(name: $name) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const CreateWordForm = () => {
  // eslint-disable-next-line no-unused-vars
  const [createcategory, { data, loading, error }] = useMutation(
    CREATE_CATEGORY,
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
      await createcategory({
        variables: { name: value }
      });
    },
    [createcategory]
  );

  return (
    <AddEntityForm
      onSubmit={onSubmitHandler}
      loading={loading}
      error={!!error}
    />
  );
};

export default CreateWordForm;
