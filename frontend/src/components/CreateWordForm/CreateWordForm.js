import React, { useCallback } from 'react';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AddEntityForm } from '../AddEntityForm';

export const CREATE_WORD = gql`
  mutation CREATE_WORD($content: String!, $category: CategoryCreateOneInput!) {
    createWord(content: $content, category: $category) {
      id
      content
      createdAt
      updatedAt
    }
  }
`;

const CreateWordForm = () => {
  // eslint-disable-next-line no-unused-vars
  const [createWord, { data, loading, error }] = useMutation(CREATE_WORD);
  const onSubmitHandler = useCallback(
    async value => {
      await createWord({
        variables: { content: value, category: { connect: { name: 'lol1' } } }
      });
    },
    [createWord]
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
