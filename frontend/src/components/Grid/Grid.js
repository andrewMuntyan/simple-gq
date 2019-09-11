import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import { DefaultRowRenderer } from '../../utils';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    padding: 0,
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
    gridTemplateRows: 'max-content',
    alignItems: 'start',
    userSelect: 'none'
  }
}));

const Grid = ({ itemsData, CellRenderer }) => {
  const classes = useStyles();

  return (
    <ul className={classes.root}>
      {itemsData.map(item => (
        <CellRenderer data={item} key={item.id} />
      ))}
    </ul>
  );
};

Grid.propTypes = {
  itemsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ).isRequired,
  CellRenderer: PropTypes.elementType
};

Grid.defaultProps = {
  CellRenderer: DefaultRowRenderer
};

export default Grid;
