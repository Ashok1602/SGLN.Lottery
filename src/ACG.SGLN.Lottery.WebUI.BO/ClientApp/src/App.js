import React from 'react';
import PropTypes from 'prop-types';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

// Import Routes all
import { userRoutes, authRoutes } from './routes/allRoutes';

// Import all middleware
import Authmiddleware from './routes/middleware/Authmiddleware';

// layouts Format
import VerticalLayout from './components/verticalLayout/index';
import HorizontalLayout from './components/horizontalLayout/index';
import NonAuthLayout from './components/NonAuthLayout';

// Import scss
import './assets/scss/theme.scss';

const App = (props) => {
  function getLayout() {
    let layoutCls = VerticalLayout;

    switch (props.layout.layoutType) {
      case 'horizontal':
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout = getLayout();

  const NonAuthmiddleware = ({ component: Component, layout: Layout }) => (
    <Route
      render={(props) => {
        return (
          <Layout>
            <Component {...props} />
          </Layout>
        );
      }}
    />
  );

  return (
    <React.Fragment>
      <Router>
        <Switch>
          {authRoutes.map((route, idx) => (
            <NonAuthmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
            />
          ))}

          {userRoutes.map((route, idx) => {
            if (route.submenu && route.submenu.length) {
              route.submenu.map((link, idx1) => {
                return (
                  <Authmiddleware
                    path={link.path}
                    layout={Layout}
                    component={link.component}
                    key={idx1}
                  />
                );
              });
            } else {
              return (
                <Authmiddleware
                  path={route.path}
                  layout={Layout}
                  component={route.component}
                  key={idx}
                />
              );
            }
            return null;
          })}
        </Switch>
      </Router>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

App.propTypes = {
  layout: PropTypes.object.isRequired,
  component: PropTypes.elementType,
};
export default connect(mapStateToProps, null)(App);
