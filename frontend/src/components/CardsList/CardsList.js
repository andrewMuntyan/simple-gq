import React from 'react';
import PropTypes from 'prop-types';

import { DefaultRowRenderer } from '../../utils';

import getClasses from './styles';

const CardsList = ({ itemsData, CellRenderer }) => {
  const classes = getClasses();

  return (
    <ul className={classes.list}>
      {itemsData.map(item => (
        <CellRenderer data={item} key={item.id} />
      ))}
    </ul>
  );
};

CardsList.propTypes = {
  itemsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ),
  CellRenderer: PropTypes.elementType
};

CardsList.defaultProps = {
  CellRenderer: DefaultRowRenderer,
  itemsData: []
};

export default CardsList;
