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

export const DELETE_WORD = gql`
  mutation DELETE_WORD($id: ID!) {
    deleteWord(id: $id) {
      count
    }
  }
`;

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345
  },
  progress: {
    position: 'absolute',
    right: 5
  }
}));

// eslint-disable-next-line no-unused-vars
const WordContent = ({ data: { content, createdAt, id } }) => {
  const [{ selectedCategory }] = useContext(AppContext);
  const classes = useStyles();

  const [deleteWord, { data, loading, error }] = useMutation(DELETE_WORD, {
    variables: { id },
    update(
      cache,
      {
        data: { deleteWord: deletedWord }
      }
    ) {
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
        <CardHeader title={content} subheader={createdAt} />
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
