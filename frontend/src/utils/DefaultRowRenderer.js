import React from 'react';
import PropTypes from 'prop-types';

const DefaultRowRenderer = ({ data: { name } }) => {
  return <div>{name}</div>;
};

DefaultRowRenderer.propTypes = {
  data: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired
};

export default DefaultRowRenderer;
