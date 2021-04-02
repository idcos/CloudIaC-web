/**
 * 方便做权限路由用
 */
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

class PrivateRoute extends Component {
  render() {
    const { routes, component, path, routesParams, ...restProps } = this.props;
    const Wrapper = component;
    return (
      <Route
        path={path}
        {...restProps}
        render={props => {
          return <Wrapper {...props} routes={routes} routesParams={routesParams} />;
        }}
      />
    );
  }
}

export default PrivateRoute;
