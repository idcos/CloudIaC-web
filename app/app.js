import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from 'utils/history';
import configureStore from './configureStore';
import App from 'containers/App';
import LanguageProvider from 'containers/LanguageProvider';
import { translationMessages } from './i18n';
import './publicPath';
import { ConfigProvider, notification } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'inner-modules/idcos-antd-theme/default/override.less';
import 'containers/App/styles/index.less';
moment.locale('zh-cn');

const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

const ConnectedApp = props => (
  <Provider store={store}>
    <LanguageProvider messages={props.messages}>
      <ConfigProvider locale={zhCN}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </ConfigProvider>
    </LanguageProvider>
  </Provider>
);

ConnectedApp.propTypes = {
  messages: PropTypes.object
};

const render = messages => {
  ReactDOM.render(<ConnectedApp messages={messages} />, MOUNT_NODE);
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}


// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

const fetchGlobal = () => {
  store.dispatch({
    type: 'global/getOrgs',
    payload: {
      status: 'enable'
    }
  });
  store.dispatch({
    type: 'global/getUserInfo'
  });
};

if (!window.__POWERED_BY_QIANKUN__) { // do sth not in qiankun
  fetchGlobal();
  render(translationMessages);
}

export async function bootstrap() { // do sth in qiankun
  // console.log('[boilerplate] react app bootstraped');
}

export async function mount(props) {
  // console.log('[boilerplate] props from main framework', props);
  render(translationMessages);
}

export async function unmount() {
  ReactDOM.unmountComponentAtNode(MOUNT_NODE);
}
