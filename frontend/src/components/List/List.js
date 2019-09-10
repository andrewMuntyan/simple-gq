import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { DefaultRowRenderer } from '../../utils';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%'
  }
}));

const List = ({ itemsData, RowRenderer, itemSize }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AutoSizer>
        {({ height, width }) => {
          return (
            <FixedSizeList
              innerElementType="ul"
              height={height}
              width={width}
              itemSize={itemSize}
              itemCount={itemsData.length}
              itemData={itemsData}
            >
              {({ style, ...rest }) => (
                <div style={style}>
                  {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                  <RowRenderer data={rest} />
                </div>
              )}
            </FixedSizeList>
          );
        }}
      </AutoSizer>
    </div>
  );
};

List.propTypes = {
  itemsData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  RowRenderer: PropTypes.elementType,
  itemSize: PropTypes.number
};

List.defaultProps = {
  itemSize: 40,
  RowRenderer: DefaultRowRenderer
};

export default List;
