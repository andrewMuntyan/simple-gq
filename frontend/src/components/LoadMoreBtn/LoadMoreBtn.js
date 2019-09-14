import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import Fab from '@material-ui/core/Fab';
import GetAppIcon from '@material-ui/icons/GetApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import getClasses from './styles';
import { defaultOnSMTH } from '../../utils';

const LoadMoreBtn = ({ onClick, displayedItemsCount, allItemsCount }) => {
  const classes = getClasses();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // componentDid like
  useEffect(() => {
    setVisible(displayedItemsCount < allItemsCount);
  }, [displayedItemsCount, allItemsCount]);

  const onClickHandler = useCallback(async () => {
    setLoading(true);
    await onClick();
    setLoading(false);
  }, [onClick]);

  return visible ? (
    <Fab
      variant="extended"
      color="secondary"
      className={classes.loadMore}
      onClick={onClickHandler}
      disabled={loading}
    >
      Load More
      <GetAppIcon />
      {loading && (
        <CircularProgress
          className={classes.progress}
          color="inherit"
          size={20}
          data-test="spinner"
        />
      )}
    </Fab>
  ) : null;
};

LoadMoreBtn.propTypes = {
  onClick: PropTypes.func,
  allItemsCount: PropTypes.number,
  displayedItemsCount: PropTypes.number
};

LoadMoreBtn.defaultProps = {
  onClick: defaultOnSMTH,
  allItemsCount: 0,
  displayedItemsCount: 0
};

export default LoadMoreBtn;
