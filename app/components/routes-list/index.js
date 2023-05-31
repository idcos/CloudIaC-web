/* eslint-disable no-useless-constructor */
import React from 'react';
import { Switch } from 'react-router-dom';
import PT from 'prop-types';

import PrivateRoute from '../private-route';

class RoutesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { routes = [], routesParams } = this.props;
    return (
      <Switch>
        {routes.map((item, index) => (
          <PrivateRoute key={index} {...item} routesParams={routesParams} />
        ))}
      </Switch>
    );
  }
}

RoutesList.propTypes = {
  routes: PT.array.isRequired,
};

RoutesList.defaultProps = {
  routes: [],
};

export default RoutesList;
