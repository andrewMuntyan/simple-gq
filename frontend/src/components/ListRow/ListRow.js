import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(theme => ({
  item: {
    userSelect: 'none',
    cursor: 'pointer'
  }
}));

const ListRow = ({ data, onItemClick, selectedItem }) => {
  const { name } = data;
  const classes = useStyles();

  return (
    <ListItem button selected={name === selectedItem} onClick={onItemClick}>
      <ListItemText primary={`${name}`} className={classes.item} />
    </ListItem>
  );
};

ListRow.propTypes = {
  selectedItem: PropTypes.string,
  onItemClick: PropTypes.func.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired
};
ListRow.defaultProps = {
  selectedItem: null
};

export default ListRow;
