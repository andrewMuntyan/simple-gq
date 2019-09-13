import React from 'react';
import PropTypes from 'prop-types';

import Fab from '@material-ui/core/Fab';
import GetAppIcon from '@material-ui/icons/GetApp';

import { DefaultRowRenderer, defaultOnSMTH } from '../../utils';

import getClasses from './styles';

const CardsList = ({
  itemsData,
  CellRenderer,
  onLoadMoreClick,
  wordsCount,
  loadingNextPage
}) => {
  const classes = getClasses();

  return (
    <section className={classes.root}>
      <ul className={classes.list}>
        {itemsData.map(item => (
          <CellRenderer data={item} key={item.id} />
        ))}
      </ul>
      {wordsCount > itemsData.length && (
        <Fab
          variant="extended"
          color="secondary"
          className={classes.loadMore}
          onClick={onLoadMoreClick}
          disabled={loadingNextPage}
        >
          Load More
          <GetAppIcon />
        </Fab>
      )}
    </section>
  );
};

CardsList.propTypes = {
  wordsCount: PropTypes.number,
  itemsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ).isRequired,
  CellRenderer: PropTypes.elementType,
  onLoadMoreClick: PropTypes.func,
  loadingNextPage: PropTypes.bool
};

CardsList.defaultProps = {
  CellRenderer: DefaultRowRenderer,
  onLoadMoreClick: defaultOnSMTH,
  wordsCount: 0,
  loadingNextPage: false
};

export default CardsList;
