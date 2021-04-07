import React from 'react';
import RoutesList from 'components/routes-list';
import routes from 'routes';
import reducer from './reducer';
import saga from './saga';
import { useInjectReducer, useInjectSaga } from "redux-injectors";

import { withRouter } from 'react-router-dom';

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
  const { location } = props;
  const { pathname } = location;
  useInjectReducer({ key: KEY, reducer });
  useInjectSaga({ key: KEY, saga });
  return (
    <div className='idcos-app'>
      <AppHeader
        theme='dark'
        navs={AppNav}
        locationPathName={pathname}
      />
      <RoutesList routes={routes()}/>
    </div>
  );
}

export default withRouter(App);
