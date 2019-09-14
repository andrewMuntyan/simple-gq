import React, { useContext } from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { WordContent } from '../WordContent';
import { CardsList } from '../CardsList';
import { WordsLoadMoreBtn } from '../WordsLoadMoreBtn';

import { AppContext } from '../../context';

import { WORDS_PER_PAGE } from '../../config';

import getClasses from './styles';

export const GET_WORDS_QUERY = gql`
  query GET_WORDS_QUERY($category: String!, $skip: Int = 0, $first: Int = ${WORDS_PER_PAGE}) {
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

const CategoryContent = () => {
  const classes = getClasses();
  const [{ selectedCategory, onActionDone }] = useContext(AppContext);

  const { data, loading, fetchMore, error } = useQuery(GET_WORDS_QUERY, {
    variables: { category: selectedCategory }
  });

  // do not render until category is chosen
  if (!selectedCategory) {
    return null;
  }

  if (error) {
    // show message according to results
    onActionDone(error);
    return <h2 className="infoMessage">Something went wrong...</h2>;
  }

  // TODO: add spinner
  if (loading) {
    return (
      <h2 className="infoMessage">
        Loading Words for {selectedCategory} category...
      </h2>
    );
  }

  const { words } = data;

  return words.length ? (
    <section className={classes.root}>
      <CardsList itemsData={words} CellRenderer={WordContent} />
      <WordsLoadMoreBtn
        fetchMore={fetchMore}
        displayedWordsCount={data.words.length}
      />
    </section>
  ) : (
    <h2 className="infoMessage">
      There is Nothing in {selectedCategory} category... Add new Word!
    </h2>
  );
};

export default CategoryContent;
