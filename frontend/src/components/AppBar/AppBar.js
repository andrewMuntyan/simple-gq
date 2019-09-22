import React, { useContext, useState, useCallback, useEffect } from 'react';
import MaterialAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

import { AppStateCtx, AppStateSetterCtx } from '../../context';
import { useDebounce } from '../../utils';

import getClasses from './styles';

export default function AppBar() {
  const classes = getClasses();

  const [searchTerm, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1500);
  const { selectedCategory, searchTerm: appStateSearchTerm } = useContext(
    AppStateCtx
  );

  const setAppState = useContext(AppStateSetterCtx);

  useEffect(() => {
    setAppState({
      searchTerm: debouncedSearchTerm
    });
  }, [debouncedSearchTerm, setAppState]);

  // to reset value after selectedCategory is changed
  useEffect(() => {
    setSearchInput(appStateSearchTerm);
  }, [appStateSearchTerm, selectedCategory]);

  const onChangeHandler = useCallback(
    e => {
      setSearchInput(e.target.value);
    },
    [setSearchInput]
  );

  return (
    <div className={classes.root}>
      <MaterialAppBar position="static" color="inherit">
        <Toolbar>
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton> */}
          <Typography className={classes.title} variant="h6" noWrap>
            Keyword Manager
          </Typography>
          {selectedCategory && (
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>

              <InputBase
                value={searchTerm}
                onChange={onChangeHandler}
                placeholder="Search word..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          )}
        </Toolbar>
      </MaterialAppBar>
    </div>
  );
}
