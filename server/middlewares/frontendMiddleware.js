/* eslint-disable global-require */
const addProxyMiddlewares = require('./addProxyMiddlewares');

/**
 * Front-end middleware
 */
module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  addProxyMiddlewares(app, options);
  
  if (isProd) {
    const addProdMiddlewares = require('./addProdMiddlewares');
    addProdMiddlewares(app, options);
  } else {
    const webpackConfig = require('../../internals/webpack/webpack.dev.babel');
    const addDevMiddlewares = require('./addDevMiddlewares');
    addDevMiddlewares(app, webpackConfig);
  }
  return app;
};
