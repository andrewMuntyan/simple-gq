import React from 'react';
// import PropTypes from "prop-types";

import { ListRow } from '../ListRow';
import { List } from '../List';

// TODO: change with request result
const data = [
  { name: 'cars', id: '1' },
  { name: 'fruits', id: '2' },
  { name: 'cells', id: '3' },
  { name: 'dogs', id: '4' }
];

const CategoryContent = () => {
  return <List itemsData={data} RowRenderer={ListRow} />;
};

export default CategoryContent;
