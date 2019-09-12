import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { defaultOnSMTH } from '../../utils';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%'
  }
}));

const TextInput = ({ onChange, disabled, error, required, label, value }) => {
  const classes = useStyles();
  return (
    <TextField
      inputProps={{
        'data-test': 'text-field'
      }}
      label={label}
      id="standard-dense"
      className={classes.textField}
      margin="dense"
      onChange={onChange}
      disabled={disabled}
      error={error}
      required={required}
      value={value}
      autoComplete="off"
    />
  );
};

// TODO: add props
TextInput.propTypes = {
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  required: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string
};

TextInput.defaultProps = {
  onChange: defaultOnSMTH,
  disabled: false,
  value: '',
  error: false,
  required: false,
  label: 'Add...'
};

export default TextInput;
