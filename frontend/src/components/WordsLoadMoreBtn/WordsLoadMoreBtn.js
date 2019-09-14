import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AppContext } from '../../context';
import { defaultOnSMTH } from '../../utils';

import { LoadMoreBtn } from '../LoadMoreBtn';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($category: String!) {
    wordsConnection(where: { category: { name: $category } }) {
      aggregate {
        count
      }
    }
  }
`;

const WordsLoadMoreBtn = ({ fetchMore, displayedWordsCount }) => {
  const [{ selectedCategory, onActionDone }] = useContext(AppContext);
  const { data: paginationData, error, loading } = useQuery(PAGINATION_QUERY, {
    variables: { category: selectedCategory }
  });

  const makeFetchMore = useCallback(async () => {
    await fetchMore({
      variables: {
        skip: displayedWordsCount
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return { ...prev, words: [...prev.words, ...fetchMoreResult.words] };
      }
    });
  }, [displayedWordsCount, fetchMore]);

  // TODO: error is shown twice. Check and fix
  if (error) {
    // show error notification message
    onActionDone(error, true);
  }

  // do not render untill we do not have pagination information
  // TODO: such long checks is needed for unit-tests
  if (
    loading ||
    !paginationData ||
    !paginationData.wordsConnection ||
    !paginationData.wordsConnection.aggregate
  ) {
    return null;
  }

  const {
    wordsConnection: {
      aggregate: { count: allItemsCount }
    }
  } = paginationData;

  return (
    <LoadMoreBtn
      data-test="words-load-more-btn"
      onClick={makeFetchMore}
      displayedItemsCount={displayedWordsCount}
      allItemsCount={allItemsCount}
    />
  );
};

WordsLoadMoreBtn.propTypes = {
  fetchMore: PropTypes.func,
  displayedWordsCount: PropTypes.number
};

WordsLoadMoreBtn.defaultProps = {
  fetchMore: defaultOnSMTH,
  displayedWordsCount: 0
};

export default WordsLoadMoreBtn;
