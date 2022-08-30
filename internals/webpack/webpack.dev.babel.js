const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

const htmlChunks = [ 'app', 'login', 'register', 'activation', 'find-password' ];
const getExcludeHtmlChunks = (value) => htmlChunks.filter((htmlChunk) => value !== htmlChunk);

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  entry: {
    app: [ require.resolve('react-app-polyfill/ie11'), 'webpack-hot-middleware/client?reload=true', path.join(process.cwd(), 'app/app.js') ],
    login: [ require.resolve('react-app-polyfill/ie11'), 'webpack-hot-middleware/client?reload=true', path.join(process.cwd(), 'login/login.js') ],
    register: [ require.resolve('react-app-polyfill/ie11'), 'webpack-hot-middleware/client?reload=true', path.join(process.cwd(), 'register/register.js') ],
    activation: [ require.resolve('react-app-polyfill/ie11'), 'webpack-hot-middleware/client?reload=true', path.join(process.cwd(), 'activation/activation.js') ],
    'find-password': [ require.resolve('react-app-polyfill/ie11'), 'webpack-hot-middleware/client?reload=true', path.join(process.cwd(), 'find-password/find-password.js') ]
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendor'
    }
  },
  plugins: [
    new ErrorOverlayPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'app/index.html',
      excludeChunks: getExcludeHtmlChunks('app')
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'login.html',
      template: 'login/login.html',
      excludeChunks: getExcludeHtmlChunks('login')
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'register.html',
      template: 'register/register.html',
      excludeChunks: getExcludeHtmlChunks('register')
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'activation.html',
      template: 'activation/activation.html',
      excludeChunks: getExcludeHtmlChunks('activation')
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'find-password.html',
      template: 'find-password/find-password.html',
      excludeChunks: getExcludeHtmlChunks('find-password')
    }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: false
    })
  ],
  devtool: 'cheap-module-source-map',
  performance: {
    hints: false
  }
});
