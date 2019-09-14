import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { GET_WORDS_QUERY } from '../CategoryContent';
import { PAGINATION_QUERY } from '../WordsLoadMoreBtn';

import { AppContext } from '../../context';

import getClasses from './styles';

export const DELETE_WORD = gql`
  mutation DELETE_WORD($id: ID!) {
    deleteWord(id: $id) {
      count
    }
  }
`;

const WordContent = ({ data: { content, createdAt, id } }) => {
  const classes = getClasses();
  const [{ selectedCategory }] = useContext(AppContext);

  const [deleteWord, { loading }] = useMutation(DELETE_WORD, {
    variables: { id },
    update(cache) {
      const queryVars = { variables: { category: selectedCategory } };
      const { words } = cache.readQuery({
        query: GET_WORDS_QUERY,
        ...queryVars
      });
      cache.writeQuery({
        query: GET_WORDS_QUERY,
        ...queryVars,
        data: { words: words.filter(word => word.id !== id) }
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
              count: cachedCount - 1,
              __typename: 'AggregateWord'
            },
            __typename: 'WordConnection'
          }
        }
      });
    },
    // refetching queries
    refetchQueries: [
      { query: PAGINATION_QUERY, variables: { category: selectedCategory } }
    ]
  });

  return (
    <ListItem>
      <Card className={classes.card}>
        <CardHeader
          data-test="wordContentHeader"
          title={content}
          subheader={new Date(createdAt).toLocaleString()}
        />
        <CardContent>
          <Button color="secondary" size="small" fullWidth onClick={deleteWord}>
            Delete
            {loading && (
              <CircularProgress
                className={classes.progress}
                color="inherit"
                size={20}
              />
            )}
          </Button>
        </CardContent>
      </Card>
    </ListItem>
  );
};

WordContent.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string
  }).isRequired
};

export default WordContent;
