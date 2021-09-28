import { createBrowserHistory } from 'history';
const packageName = require('../../package.json').name;
const history = createBrowserHistory({ basename: window.__POWERED_BY_QIANKUN__ ? packageName : '' });
export default history;
