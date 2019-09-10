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

const ListRow = ({ data: { index, data } }) => {
  const classes = useStyles();
  // Access the items array using the "data" prop:
  const item = data[index];

  return (
    <ListItem key={item.name}>
      <ListItemText primary={`${item.name}`} className={classes.item} />
    </ListItem>
  );
};

ListRow.propTypes = {
  data: PropTypes.shape({
    index: PropTypes.number.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired
};

export default ListRow;
