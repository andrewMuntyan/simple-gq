import React, { useContext, useCallback, useState } from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { WordContent } from '../WordContent';
import { CardsList } from '../CardsList';

import { AppContext } from '../../context';

import { WORDS_PER_PAGE } from '../../config';

export const GET_WORDS = gql`
  query GET_WORDS($category: String!, $skip: Int = 0, $first: Int = ${WORDS_PER_PAGE}) {
    words(
      where: { category: { name: $category } },
      first: $first,
      skip: $skip,
      orderBy: createdAt_DESC
    ) {
      category {
        name
      }
      id
      content
      createdAt
      updatedAt
    }
  }
`;

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($category: String!) {
    wordsConnection(where: { category: { name: $category } }) {
      aggregate {
        count
      }
    }
  }
`;

const CategoryContent = () => {
  const [{ selectedCategory, onActionDone }] = useContext(AppContext);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  const {
    data: wordsData,
    loading: wordsLoading,
    fetchMore,
    error: wordsError
  } = useQuery(GET_WORDS, {
    variables: { category: selectedCategory }
  });

  // TODO: move this to CardsList to avoid complexity with handling two mutations
  const {
    data: paginationData,
    loading: paginationLoading,
    error: paginationError
  } = useQuery(PAGINATION_QUERY, {
    variables: { category: selectedCategory }
  });

  const onLoadMoreClickHandler = useCallback(async () => {
    setLoadingNextPage(true);
    await fetchMore({
      variables: {
        skip: wordsData.words.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return { ...prev, words: [...prev.words, ...fetchMoreResult.words] };
      }
    });
    setLoadingNextPage(false);
  }, [wordsData, setLoadingNextPage, fetchMore]);

  // do not render until category is chosen
  if (!selectedCategory) {
    return null;
  }

  if (wordsError || paginationError) {
    // show message according to results
    onActionDone(wordsError || paginationError);
    return <h2>Something went wrong...</h2>;
  }

  // TODO: add spinner
  if (wordsLoading || paginationLoading) {
    return <h2>Loading Words for {selectedCategory} category...</h2>;
  }

  const {
    wordsConnection: {
      aggregate: { count: wordsCount }
    }
  } = paginationData;

  const { words = [] } = wordsData;

  return words.length ? (
    <CardsList
      itemsData={words}
      CellRenderer={WordContent}
      selectedCategory={selectedCategory}
      onLoadMoreClick={onLoadMoreClickHandler}
      wordsCount={wordsCount}
      loadingNextPage={loadingNextPage}
    />
  ) : (
    <h2>There is Nothing in {selectedCategory} category... Add new Word!</h2>
  );
};

export default CategoryContent;
