import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  item: {
    userSelect: 'none',
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));
