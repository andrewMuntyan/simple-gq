import React, { useState } from 'react';

const defaultContextValue = {
  selectedCategory: ''
};

export const AppContext = React.createContext([defaultContextValue, () => {}]);

// TODO: add proptypes
// eslint-disable-next-line react/prop-types
export const AppContextProvider = ({ children }) => {
  const [appContext, setAppContext] = useState(defaultContextValue);
  return (
    <AppContext.Provider value={[appContext, setAppContext]}>
      {children}
    </AppContext.Provider>
  );
};
