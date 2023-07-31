import React from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';
import PropTypes from "prop-types";
import ErrorBoundar from "../../components/common/ErrorBoundariesComponent"

const Authmiddleware = ({ component: Component, layout: Layout }) => (
  <ErrorBoundar>
  <Route
    render={(props) => {
      // here you can apply condition
      if (!localStorage.getItem("loginInfo")) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }

      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }}
  />
  </ErrorBoundar>
);

Authmiddleware.propTypes = {
	location: PropTypes.object.isRequired,
	component: PropTypes.elementType,
	layout: PropTypes.object
}

export default withRouter(Authmiddleware);
