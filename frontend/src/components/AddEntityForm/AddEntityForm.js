/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { makeStyles } from '@material-ui/core/styles';

import { TextInput } from '../TextInput';

import { defaultSubmit } from '../../utils';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  input: {
    flex: '1 1 0',
    marginRight: '5px'
  },
  fab: {
    margin: theme.spacing(1)
  }
}));

const AddEnity = ({ onSubmit }) => {
  const classes = useStyles();
  return (
    <form
      className={classes.container}
      noValidate
      autoComplete="off"
      onSubmit={onSubmit}
    >
      <span className={classes.input}>
        <TextInput />
      </span>

      <Fab
        color="secondary"
        aria-label="add"
        className={classes.fab}
        type="submit"
      >
        <AddIcon />
      </Fab>
    </form>
  );
};

AddEnity.propTypes = {
  onSubmit: PropTypes.func
};
AddEnity.defaultProps = {
  onSubmit: defaultSubmit
};

export default AddEnity;
