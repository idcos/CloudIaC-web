const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

module.exports = require('./webpack.base.babel')({
  mode: 'development',
  entry: {
    app: [ require.resolve('react-app-polyfill/ie11'), 'webpack-hot-middleware/client?reload=true', path.join(process.cwd(), 'app/app.js') ],
    login: [ require.resolve('react-app-polyfill/ie11'), 'webpack-hot-middleware/client?reload=true', path.join(process.cwd(), 'login/login.js') ]
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
      excludeChunks: ['login']
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'login.html',
      template: 'login/login.html',
      excludeChunks: ['app']
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
