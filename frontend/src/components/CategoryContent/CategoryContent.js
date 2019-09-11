import React from 'react';
// import PropTypes from 'prop-types';

import { WordContent } from '../WordContent';
import { Grid } from '../Grid';

// TODO: make query for this
const data = [
  { name: 'cars', id: '1' },
  { name: 'fruits', id: '2' },
  { name: 'cells', id: '3' },
  { name: 'cars', id: '4' }
  // { name: 'fruits', id: '2' },
  // { name: 'cells', id: '3' },
  // { name: 'cars', id: '1' },
  // { name: 'fruits', id: '2' },
  // { name: 'cells', id: '3' },
  // { name: 'cars', id: '1' },
  // { name: 'fruits', id: '2' },
  // { name: 'cells', id: '3' },
  // { name: 'cars', id: '1' },
  // { name: 'fruits', id: '2' },
  // { name: 'cells', id: '3' },
  // { name: 'cars', id: '1' },
  // { name: 'fruits', id: '2' },
  // { name: 'cells', id: '3' },
  // { name: 'cars', id: '1' },
  // { name: 'fruits', id: '2' },
  // { name: 'cells', id: '3' },
  // { name: 'cars', id: '1' },
  // { name: 'fruits', id: '2' },
  // { name: 'cells', id: '3' },
  // { name: 'cars', id: '1' },
  // { name: 'fruits', id: '2' },
  // { name: 'cells', id: '3' },
  // { name: 'cars', id: '1' },
  // { name: 'fruits', id: '2' },
  // { name: 'cells', id: '3' },
  // { name: 'dogs', id: '4' }
];

// eslint-disable-next-line no-unused-vars
const CategoryContent = props => {
  return <Grid itemsData={data} CellRenderer={WordContent} />;
};

CategoryContent.propTypes = {};

export default CategoryContent;
