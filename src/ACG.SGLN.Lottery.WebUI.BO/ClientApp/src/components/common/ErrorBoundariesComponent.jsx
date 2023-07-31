import React from "react";
import PropTypes from 'prop-types';
import { Container } from "reactstrap";
import Pages404 from "./Pages404";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error) {
    this.setState({
      hasError: true,
      error: error.toString(),
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Container className='mt-5'>
            <Pages404 />
          <div className='text-center'>
            <h2 className='text-danger mt-2'>{this.state.error}</h2>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node,
  };
export default ErrorBoundary;
