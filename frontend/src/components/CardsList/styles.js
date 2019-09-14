import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    position: 'relative'
  },
  list: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
    gridTemplateRows: 'max-content',
    alignItems: 'start',
    userSelect: 'none'
  },
  loadMore: {
    position: 'absolute',
    right: 0
  }
}));
