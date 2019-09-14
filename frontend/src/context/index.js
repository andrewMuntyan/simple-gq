import React, { useState } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Shield } from '../components';

import { getMessage } from '../utils';

const defaultContextValue = {
  selectedCategory: ''
};

export const AppContext = React.createContext([defaultContextValue, () => {}]);

// TODO: add proptypes
// eslint-disable-next-line react/prop-types
export const AppContextProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const showMessage = ({ variant, text }) => {
    const isError = variant === 'error';
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(text, {
      variant,
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      autoHideDuration: isError ? 4000 : 2000
      // preventDuplicate: isError
    });
  };

  const onActionDone = result => showMessage(getMessage(result));

  const [appContext, setAppContext] = useState({
    ...defaultContextValue,
    showMessage,
    onActionDone
  });

  return (
    <AppContext.Provider value={[appContext, setAppContext]}>
      {/* Error Boundary */}
      <Shield>{children}</Shield>
    </AppContext.Provider>
  );
};

export const FinalAppContextProvider = props => {
  return (
    <SnackbarProvider maxSnack={3}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <AppContextProvider {...props} />
    </SnackbarProvider>
  );
};
