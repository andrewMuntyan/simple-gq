import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { GET_WORDS } from '../CategoryContent';

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
      const { words } = cache.readQuery({
        query: GET_WORDS,
        variables: { category: selectedCategory }
      });

      cache.writeQuery({
        query: GET_WORDS,
        variables: { category: selectedCategory },
        data: { words: words.filter(word => word.id !== id) }
      });
    }
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
