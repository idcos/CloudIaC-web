import React from 'react';
import { connect } from 'react-redux';
import RoutesList from 'components/routes-list';


const OrgWrapper = ({ routes, curOrg }) => {
  return curOrg && <RoutesList
    routes={routes}
    routesParams={{
      curOrg
    }}
  />;
};

export default connect(
  (state) => ({ curOrg: state.global.get('curOrg') })
)(OrgWrapper);
