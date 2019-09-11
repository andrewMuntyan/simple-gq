import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { defaultOnChange } from '../../utils';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%',
    marginTop: 19
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
}));

const TextInput = ({ onChange, disabled, error, required }) => {
  const classes = useStyles();
  return (
    <TextField
      id="standard-dense"
      label="Add"
      className={classes.textField}
      margin="dense"
      onChange={onChange}
      disabled={disabled}
      error={error}
      required={required}
    />
  );
};

// TODO: add props
TextInput.propTypes = {
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  required: PropTypes.bool
};

TextInput.defaultProps = {
  onChange: defaultOnChange,
  disabled: false,
  error: false,
  required: false
};

export default TextInput;
