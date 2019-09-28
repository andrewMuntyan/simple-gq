import React, { useCallback, useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AddEntityForm } from '../AddEntityForm';
import { GET_WORDS_QUERY } from '../CategoryContent';
import { PAGINATION_QUERY } from '../WordsLoadMoreBtn';

import { AppStateCtx, SnackBarCtx } from '../../context';
import { showDevError } from '../../utils';
import { WORDS_PER_PAGE, SEARCH_RESULTS_COUNT } from '../../config';

export const CREATE_WORD_MUTATION = gql`
  mutation CREATE_WORD_MUTATION(
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
  const { selectedCategory, searchTerm } = useContext(AppStateCtx);
  const { onActionDone } = useContext(SnackBarCtx);

  const [createWord, { loading, error }] = useMutation(CREATE_WORD_MUTATION, {
    // cache updating
    update(
      cache,
      {
        data: { createWord: newWordData }
      }
    ) {
      const dataSize = searchTerm ? SEARCH_RESULTS_COUNT : WORDS_PER_PAGE;
      const queryVars = {
        variables: { category: selectedCategory, searchTerm, first: dataSize }
      };

      // cache.readQuery throws an error if there are no entries in local cache
      // see https://github.com/apollographql/react-apollo/issues/2175
      // make it silent for now
      try {
        const { words } = cache.readQuery({
          query: GET_WORDS_QUERY,
          ...queryVars
        });

        cache.writeQuery({
          query: GET_WORDS_QUERY,
          ...queryVars,
          data: { words: [newWordData, ...words] }
        });
      } catch (queryError) {
        showDevError(queryError);
      }

      // TODO: DRY
      // cache.readQuery throws an error if there are no entries in local cache
      // see https://github.com/apollographql/react-apollo/issues/2175
      // make it silent for now
      try {
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
      } catch (queryError) {
        showDevError(queryError);
      }
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
