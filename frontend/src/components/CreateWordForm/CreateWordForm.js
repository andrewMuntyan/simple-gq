import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AddEntityForm } from '../AddEntityForm';
import { GET_WORDS } from '../CategoryContent';

export const CREATE_WORD = gql`
  mutation CREATE_WORD($content: String!, $category: CategoryCreateOneInput!) {
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

const CreateWordForm = ({ selectedCategory }) => {
  // eslint-disable-next-line no-unused-vars
  const [createWord, { data, loading, error }] = useMutation(CREATE_WORD, {
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
        data: { words: words.concat([newWordData]) },
        variables: { category: selectedCategory }
      });
    }
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
    <h2>Please chose the category</h2>
  );
};

CreateWordForm.propTypes = {
  selectedCategory: PropTypes.string
};

CreateWordForm.defaultProps = {
  selectedCategory: null
};

export default CreateWordForm;
