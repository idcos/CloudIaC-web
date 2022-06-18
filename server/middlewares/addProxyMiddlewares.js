/* eslint-disable no-console */
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const logger = require('../logger');

// Proxy middleware
const addProxyMiddlewares = (app, options = {}) => {
  let proxyConfig = {};
  let customProxyConfig = {};
  const proxyConfigPath = path.resolve(process.cwd(), 'proxy.json');
  const customProxyConfigPath = path.resolve(process.cwd(), '.proxy');

  if (fs.existsSync(proxyConfigPath)) {
    try {
      proxyConfig = JSON.parse(fs.readFileSync(proxyConfigPath, 'utf-8'));
    } catch (error) {
      logger.error(`parse ./proxy.json: ${error.message}`);
    }
  }

  if (fs.existsSync(customProxyConfigPath)) {
    try {
      customProxyConfig = JSON.parse(
        fs.readFileSync(customProxyConfigPath, 'utf-8')
      );
    } catch (error) {
      logger.error(`parse ./.proxy: ${error.message}`);
    }
  }

  try {
    const servicesKeys = Object.keys(proxyConfig);
    const customKeys = Object.keys(customProxyConfig);

    customKeys.forEach(k => {
      proxyConfig[k] = customProxyConfig[k];
    });

    const finalKeys = customKeys.concat(servicesKeys);

    console.log('proxy config:');
    console.log(JSON.stringify(proxyConfig, 0, 4));
    finalKeys.forEach(key => {
      const service = proxyConfig[key];
      console.log('service', service);
      const { api, pathRewrite } = service;
      const logLevel = service.logLevel || 'info';
      const Proxy = createProxyMiddleware({
        target: api,
        logLevel,
        changeOrigin: true,
        pathRewrite
      });
      service.endpoints.forEach(endpoint => {
        app.all(endpoint, (req, res, next) => {
          console.log(
            `${chalk.bold('->')}: ${chalk.bold(req.url)} to ${chalk.gray(api)}`
          );
          return Proxy(req, res, next);
        });
      });
      logger.proxyReversed(api, service.endpoints);
    });
  } catch (error) {
    logger.error(`proxy config error: ${error.message}`);
  }
};

module.exports = (app, options) => {
  addProxyMiddlewares(app, options);
  return app;
};
