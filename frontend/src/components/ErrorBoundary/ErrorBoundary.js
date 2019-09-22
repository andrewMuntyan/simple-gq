import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // you can log it somewhere
    // logErrorToMyService(error, info);
    console.error(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <h1>Something went really wrong...</h1>;
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node // or PropTypes.node.isRequired to make it required
};
ErrorBoundary.defaultProps = {
  children: null
};
export default ErrorBoundary;
