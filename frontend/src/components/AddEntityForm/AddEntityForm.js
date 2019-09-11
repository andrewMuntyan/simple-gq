import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Fab from '@material-ui/core/Fab';
// eslint-disable-next-line import/no-extraneous-dependencies
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

const AddEnity = ({ onSubmit, loading, error }) => {
  const classes = useStyles();

  const [value, setValue] = useState(null);
  const [errorState, setErrorState] = useState(error);

  const submitHandler = e => {
    e.preventDefault();
    onSubmit(value);
  };

  useEffect(() => {
    setErrorState(error);
  }, [error]);

  const onChangeHandler = e => {
    setValue(e.target.value);
    setErrorState(false);
  };

  return (
    <form className={classes.container} noValidate onSubmit={submitHandler}>
      <span className={classes.input}>
        <TextInput
          autoComplete="off"
          onChange={onChangeHandler}
          disabled={loading}
          error={errorState}
          required
        />
      </span>

      <Fab
        color="secondary"
        aria-label="add"
        className={classes.fab}
        type="submit"
        disabled={loading || !value}
      >
        <AddIcon />
      </Fab>
    </form>
  );
};

AddEnity.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.bool
};
AddEnity.defaultProps = {
  onSubmit: defaultSubmit,
  loading: false,
  error: false
};

export default AddEnity;
