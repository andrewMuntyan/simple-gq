import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  input: {
    flex: '1 1 0',
    marginRight: '-48px'
  },
  fab: {
    margin: theme.spacing(1)
  }
}));
