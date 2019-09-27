import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { TextInput } from '../TextInput';

import { defaultSubmit } from '../../utils';

import getClasses from './styles';

const AddEnity = ({ onSubmit, loading, error, label }) => {
  const classes = getClasses();

  const [value, setValue] = useState('');
  const [errorState, setErrorState] = useState(error);

  useEffect(() => {
    setErrorState(error);

    if (!error && !loading) {
      setValue('');
    }
  }, [error, loading]);

  const submitHandler = useCallback(
    async e => {
      e.preventDefault();
      return onSubmit(value);
    },
    [onSubmit, value]
  );

  const onChangeHandler = useCallback(
    e => {
      setValue(e.target.value);
      setErrorState(false);
    },
    [setValue, setErrorState]
  );

  return (
    <form
      className={classes.container}
      noValidate
      onSubmit={submitHandler}
      data-test="add-entity-form"
    >
      <span className={classes.input}>
        <TextInput
          label={label}
          onChange={onChangeHandler}
          disabled={loading}
          error={errorState}
          value={value}
          required
        />
      </span>

      <Fab
        color="secondary"
        aria-label="add"
        className={classes.fab}
        type="submit"
        size="small"
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
  error: PropTypes.bool,
  label: PropTypes.string
};
AddEnity.defaultProps = {
  onSubmit: defaultSubmit,
  loading: false,
  error: false,
  label: null
};

export default AddEnity;
