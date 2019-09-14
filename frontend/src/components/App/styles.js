import { makeStyles } from '@material-ui/core/styles';

const globalStyles = {
  ul: {
    margin: 0,
    padding: 0
  },
  '.infoMessage': {
    textAlign: 'center'
  }
};

export default makeStyles(() => ({
  '@global': globalStyles,
  root: {
    flexGrow: 1
  }
}));
