import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import { DefaultRowRenderer, noop } from '../../utils';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    // height: '100%'

    // TODO: add styles reset
    margin: 0,
    padding: 0
  }
}));

const List = ({ itemsData, RowRenderer, onItemClick, selectedItem }) => {
  const classes = useStyles();

  return (
    <ul className={classes.root}>
      {itemsData.map(item => (
        <RowRenderer
          data={item}
          key={item.id}
          onItemClick={onItemClick}
          selectedItem={selectedItem}
        />
      ))}
    </ul>
  );
};

List.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  onItemClick: PropTypes.func,
  itemsData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  RowRenderer: PropTypes.elementType,
  selectedItem: PropTypes.string
};

List.defaultProps = {
  RowRenderer: DefaultRowRenderer,
  onItemClick: noop,
  selectedItem: null
};

export default List;
