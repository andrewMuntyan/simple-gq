import React, { useCallback, useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AddEntityForm } from '../AddEntityForm';
import { GET_WORDS, PAGINATION_QUERY } from '../CategoryContent';

import { AppContext } from '../../context';

export const CREATE_WORD = gql`
  mutation CREATE_WORD(
    $content: String!
    $category: CategoryCreateOneWithoutWordsInput!
  ) {
    createWord(content: $content, category: $category) {
      id
      content
      createdAt
      updatedAt
      category {
        name
      }
    }
  }
`;

const CreateWordForm = () => {
  const [{ selectedCategory }] = useContext(AppContext);
  const [createWord, { data, loading, error }] = useMutation(CREATE_WORD, {
    // cache updating
    update(
      cache,
      {
        data: { createWord: newWordData }
      }
    ) {
      const { words } = cache.readQuery({
        query: GET_WORDS,
        variables: { category: selectedCategory }
      });

      cache.writeQuery({
        query: GET_WORDS,
        variables: { category: selectedCategory },
        data: { words: [newWordData, ...words] }
      });
    },
    // refetching queries
    refetchQueries: [
      { query: PAGINATION_QUERY, variables: { category: selectedCategory } }
    ]
  });

  const onSubmitHandler = useCallback(
    async value => {
      await createWord({
        variables: {
          content: value,
          // TODO: backend: selectedCategory should be id, not name
          category: { connect: { name: selectedCategory } }
        }
      });
    },
    [createWord, selectedCategory]
  );

  return selectedCategory ? (
    <AddEntityForm
      label={`Add Word to ${selectedCategory} category`}
      onSubmit={onSubmitHandler}
      loading={loading}
      error={!!error}
    />
  ) : (
    <h2>Please chose the Category</h2>
  );
};

export default CreateWordForm;
