import './App.css';
import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import logo from './logo.svg';

export const GET_CATEGORIES = gql`
  query GET_CATEGORIES {
    categories {
      id
      name
    }
  }
`;

function App() {
  const { data, loading, error, fetchMore } = useQuery(GET_CATEGORIES);

  // eslint-disable-next-line no-console
  console.log({ data, loading, error, fetchMore });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
      </header>
    </div>
  );
}

export default App;
