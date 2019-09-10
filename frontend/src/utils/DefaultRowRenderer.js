import React from 'react';
import PropTypes from 'prop-types';

const DefaultRowRenderer = ({ name }) => {
  return <div>{name}</div>;
};

DefaultRowRenderer.propTypes = {
  name: PropTypes.string.isRequired
};

export default DefaultRowRenderer;
