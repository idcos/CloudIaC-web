import React from 'react';
import { Switch } from 'react-router-dom';
import PT from 'prop-types';

import PrivateRoute from 'components/private-route';

class RoutesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { routes = [] } = this.props;
    return (
      <Switch>
        {routes.map((item, index) => (
          <PrivateRoute key={index} {...item} />
        ))}
      </Switch>
    );
  }
}

RoutesList.propTypes = {
  routes: PT.array.isRequired
};

RoutesList.defaultProps = {
  routes: []
};

export default RoutesList;
