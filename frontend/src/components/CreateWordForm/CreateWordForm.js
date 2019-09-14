import React, { useCallback, useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AddEntityForm } from '../AddEntityForm';
import { GET_WORDS_QUERY } from '../CategoryContent';
import { PAGINATION_QUERY } from '../WordsLoadMoreBtn';

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
  const [{ selectedCategory, onActionDone }] = useContext(AppContext);

  const [createWord, { loading, error }] = useMutation(CREATE_WORD, {
    // cache updating
    update(
      cache,
      {
        data: { createWord: newWordData }
      }
    ) {
      const queryVars = { variables: { category: selectedCategory } };

      const { words } = cache.readQuery({
        query: GET_WORDS_QUERY,
        ...queryVars
      });
      cache.writeQuery({
        query: GET_WORDS_QUERY,
        ...queryVars,
        data: { words: [newWordData, ...words] }
      });

      // TODO: DRY
      const paginationChache = cache.readQuery({
        query: PAGINATION_QUERY,
        ...queryVars
      });
      const {
        wordsConnection: {
          aggregate: { count: cachedCount }
        }
      } = paginationChache;
      cache.writeQuery({
        query: PAGINATION_QUERY,
        ...queryVars,
        data: {
          wordsConnection: {
            aggregate: {
              count: cachedCount + 1,
              __typename: 'AggregateWord'
            },
            __typename: 'WordConnection'
          }
        }
      });
    }
  });

  const onSubmitHandler = useCallback(
    async value => {
      return createWord({
        variables: {
          content: value,
          category: { connect: { name: selectedCategory } }
        }
      })
        .then(onActionDone)
        .catch(e => {
          onActionDone(e);
          throw e;
        });
    },
    [createWord, selectedCategory, onActionDone]
  );

  return selectedCategory ? (
    <AddEntityForm
      label={`Add Word to ${selectedCategory} category`}
      onSubmit={onSubmitHandler}
      loading={loading}
      error={!!error}
    />
  ) : (
    <h2 className="infoMessage">Please chose the Category</h2>
  );
};

export default CreateWordForm;
