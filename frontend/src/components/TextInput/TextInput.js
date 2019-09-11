import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

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

const TextInput = props => {
  const classes = useStyles();
  return (
    <TextField
      id="standard-dense"
      label="Add"
      className={classes.textField}
      margin="dense"
    />
  );
};

// TODO: add props
TextInput.propTypes = {};

export default TextInput;
