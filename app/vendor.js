import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import * as ReactRouterDOM from 'react-router-dom';
import * as ConnectedReactRouter from 'connected-react-router';
import * as ReduxSaga from 'redux-saga';
import * as Redux from 'redux';
import * as JsCookie from 'js-cookie';
import * as lodash from 'lodash';
import * as ReactIntl from 'react-intl';
import * as Reselect from 'reselect';
import * as moment from 'moment';

const libs = {
  React,
  ReactDOM,
  ReactRedux,
  ReactRouterDOM,
  ConnectedReactRouter,
  ReduxSaga,
  Redux,
  JsCookie,
  lodash,
  ReactIntl,
  Reselect,
  moment,
};

Object.keys(libs).forEach(key => {
  window[key] = libs[key];
});
