import React, { useEffect } from 'react';
import RoutesList from 'components/routes-list';
import routes from 'routes';
import { connect } from 'react-redux';
import { compose } from 'redux';

import reducer from './reducer';
import saga from './saga';
import { injectReducer, injectSaga } from "redux-injectors";

import { Link, withRouter } from 'react-router-dom';

import AppHeader from 'components/AppHeader';

const KEY = 'global';

const AppNav = [
  {
    key: 'ct',
    name: '云模板',
    link: '/ct'
  },
  {
    key: 'setting',
    name: '设置',
    link: '/setting'
  }
];

function App(props) {
  const { location, dispatch, orgs, curOrg, userInfo } = props;
  const { pathname } = location;

  useEffect(() => {
    if (pathname.indexOf('org') == -1) {
      dispatch({
        type: 'global/set-curOrg',
        payload: {
          orgId: null
        }
      });
    }
  }, [pathname]);

  return (
    <div className='idcos-app'>
      <AppHeader
        theme='dark'
        navs={AppNav}
        locationPathName={pathname}
        orgs={orgs.list || []}
        curOrg={curOrg}
        userInfo={userInfo}
        dispatch={dispatch}
      />
      <RoutesList routes={routes()}/>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    orgs: state[KEY].get('orgs').toJS(),
    curOrg: state[KEY].get('curOrg'),
    userInfo: state[KEY].get('userInfo').toJS()
  };
};

const withConnect = connect(
  mapStateToProps
);

const withReducer = injectReducer({ key: KEY, reducer });
const withSaga = injectSaga({ key: KEY, saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(withRouter(App));
