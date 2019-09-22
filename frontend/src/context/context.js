import React from 'react';
import PropTypes from 'prop-types';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { ErrorBoundary } from '../components';

import { getMessage } from '../utils';

const defaultContextValue = {
  selectedCategory: '',
  searchInProgress: false,
  searchTerm: ''
};

export const AppStateCtx = React.createContext(defaultContextValue);
export const AppStateSetterCtx = React.createContext(null);
export const SnackBarCtx = React.createContext({});

// TODO: move `SnackBarProviderWrapper` and `SnackBarContextProvider` to separate file

const SnackBarProviderWrapper = ({ children }) => (
  <SnackbarProvider maxSnack={3}>
    <SnackBarContextProvider>{children}</SnackBarContextProvider>
  </SnackbarProvider>
);
SnackBarProviderWrapper.propTypes = {
  children: PropTypes.node // or PropTypes.node.isRequired to make it required
};
SnackBarProviderWrapper.defaultProps = {
  children: null
};

const SnackBarContextProvider = ({ children }) => {
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
  return (
    <SnackBarCtx.Provider value={{ onActionDone }}>
      {children}
    </SnackBarCtx.Provider>
  );
};

SnackBarContextProvider.propTypes = {
  children: PropTypes.node // or PropTypes.node.isRequired to make it required
};
SnackBarContextProvider.defaultProps = {
  children: null
};

export class AppSharedStateProvider extends React.Component {
  constructor(props) {
    super(props);
    // const { enqueueSnackbar } = useSnackbar();
    this.state = {
      appState: { ...defaultContextValue }
    };
  }

  setAppState = (newValues = {}) => {
    this.setState(prevState => ({
      ...prevState,
      appState: { ...prevState.appState, ...newValues }
    }));
  };

  render() {
    const { appState } = this.state;
    const { children } = this.props;
    return (
      <AppStateCtx.Provider value={appState}>
        <AppStateSetterCtx.Provider value={this.setAppState}>
          {children}
        </AppStateSetterCtx.Provider>
      </AppStateCtx.Provider>
    );
  }
}
AppSharedStateProvider.propTypes = {
  children: PropTypes.node // or PropTypes.node.isRequired to make it required
};
AppSharedStateProvider.defaultProps = {
  children: null
};

export const AppProvider = ({ children }) => (
  <SnackBarProviderWrapper>
    <AppSharedStateProvider>
      <ErrorBoundary>{children}</ErrorBoundary>
    </AppSharedStateProvider>
  </SnackBarProviderWrapper>
);

AppProvider.propTypes = {
  children: PropTypes.node // or PropTypes.node.isRequired to make it required
};
AppProvider.defaultProps = {
  children: null
};
