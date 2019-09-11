import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { withApollo } from '../withApollo';
import theme from './theme';
import { AppBar } from '../AppBar';
import { CategoriesList } from '../CategoriesList';
import { CategoryContent } from '../CategoryContent';
import CreateWordForm from '../CreateWordForm/CreateWordForm';
import { CreateCategoryForm } from '../CreateCategoryForm';

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

// TODO: move to constants maybe )
const headerHeight = 65;
const addFormContainerHeight = 65;
// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(currentTheme => ({
  root: {
    flexGrow: 1
  },
  headContainer: {
    height: headerHeight
  },
  bodyContainer: {
    height: `calc(100vh - ${headerHeight}px - ${addFormContainerHeight}px)`
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
          <Grid container className={classes.root} spacing={0}>
            <Grid item xs={12} className={classes.headContainer}>
              <AppBar />
            </Grid>

            <Grid container spacing={0}>
              <Grid item xs={12} sm={4}>
                <CreateCategoryForm />
              </Grid>
              <Grid item xs={false} sm={3} />
              <Grid item xs={12} sm={5}>
                <CreateWordForm />
              </Grid>
            </Grid>

            <Grid item xs={3} sm={4} className={classes.bodyContainer}>
              <CategoriesList />
            </Grid>

            <Grid item xs={9} sm={8} className={classes.bodyContainer}>
              <CategoryContent />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default withApollo(App);
