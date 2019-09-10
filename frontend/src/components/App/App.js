import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { withApollo } from '../withApollo';
import theme from './theme';

// import { useQuery } from '@apollo/react-hooks';
// import gql from 'graphql-tag';

// export const GET_CATEGORIES = gql`
//   query GET_CATEGORIES {
//     categories {
//       id
//       name
//     }
//   }
// `;

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(currentTheme => ({
  root: {
    flexGrow: 1
  }
}));

function App() {
  const classes = useStyles();
  // const { data, loading, error, fetchMore } = useQuery(GET_CATEGORIES);
  // console.log({ data, loading, error, fetchMore });
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Container maxWidth="md">
        <Box>
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12} sm={12}>
              header
            </Grid>
            <Grid item xs={12} sm={4}>
              categories list
              {/* <CategoriesList /> */}
            </Grid>
            <Grid item xs={12} sm={8}>
              category content
              {/* <CategoryContent /> */}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default withApollo(App);
