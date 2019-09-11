import React, { useState } from 'react';

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

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(currentTheme => ({
  root: {
    flexGrow: 1
  }
}));

function App() {
  const classes = useStyles();

  const [selectedCategory, setSelectedCategory] = useState(null);

  const onPickCategoryHandler = e => setSelectedCategory(e.target.textContent);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Container maxWidth="md">
        <Box>
          <Grid container className={classes.root} spacing={0}>
            <Grid item xs={12}>
              <AppBar />
            </Grid>

            <Grid container spacing={0}>
              <Grid item xs={12} sm={4}>
                <CreateCategoryForm />
              </Grid>
              <Grid item xs={12} sm={8}>
                <CreateWordForm selectedCategory={selectedCategory} />
              </Grid>
            </Grid>

            <Grid item xs={12} sm={4}>
              <CategoriesList
                onCategoryPick={onPickCategoryHandler}
                selectedCategory={selectedCategory}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              {selectedCategory && (
                <CategoryContent selectedCategory={selectedCategory} />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default withApollo(App);
