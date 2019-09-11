import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { DefaultRowRenderer, noop } from '../../utils';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%'
  }
}));

const List = ({
  itemsData,
  RowRenderer,
  itemSize,
  onItemClick,
  selectedItem
}) => {
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
                  <RowRenderer
                    data={rest}
                    onItemClick={onItemClick}
                    selectedItem={selectedItem}
                  />
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
  // eslint-disable-next-line react/no-unused-prop-types
  onItemClick: PropTypes.func,
  itemsData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  RowRenderer: PropTypes.elementType,
  itemSize: PropTypes.number,
  selectedItem: PropTypes.string
};

List.defaultProps = {
  itemSize: 40,
  RowRenderer: DefaultRowRenderer,
  onItemClick: noop,
  selectedItem: null
};

export default List;
