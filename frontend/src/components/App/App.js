import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { withApollo } from '../withApollo';
import { AppBar } from '../AppBar';
import { CategoriesList } from '../CategoriesList';
import { CategoryContent } from '../CategoryContent';
import CreateWordForm from '../CreateWordForm/CreateWordForm';
import { CreateCategoryForm } from '../CreateCategoryForm';
import { AppContextProvider } from '../../context';

import theme from './theme';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  }
}));

function App() {
  const classes = useStyles();

  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Container maxWidth="md">
          <Box>
            <Grid container className={classes.root} spacing={2}>
              <Grid item xs={12}>
                <AppBar />
              </Grid>

              <Grid item xs={12} sm={5} md={4}>
                <CreateCategoryForm />
              </Grid>
              <Grid item xs={12} sm={7} md={8}>
                <CreateWordForm />
              </Grid>

              <Grid item xs={12} sm={5} md={4}>
                <CategoriesList />
              </Grid>

              <Grid item xs={12} sm={7} md={8}>
                <CategoryContent />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default withApollo(App);
