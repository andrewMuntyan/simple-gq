import React from 'react';
import PropTypes from 'prop-types';

import { DefaultRowRenderer, noop } from '../../utils';

import getClasses from './styles';

const List = ({ itemsData, RowRenderer, onItemClick, selectedItem }) => {
  const classes = getClasses();

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
