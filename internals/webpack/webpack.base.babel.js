// Webpack Config - Base
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBar = require('progress-bar-webpack-plugin');
const packageName = require('../../package.json').name;

module.exports = options => ({
  mode: options.mode,
  entry: options.entry,
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`,
    publicPath: '/',
    path: path.resolve(process.cwd(), 'build'),
    ...options.output
  },
  optimization: options.optimization,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.(css|less)$/,
        include: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  'hack': `true; @import "~inner-modules/idcos-antd-theme/default/default.less"`
                }
              }
            }
          }
        ]
      },
      {
        // Preprocess our own .css files
        test: /\.(css|less)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[path][local]-[hash:base64:5]'
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader'
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      }
    ]
  },
  plugins: options.plugins.concat([
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), 'vendor'),
          to: 'vendor'
        },
        {
          from: path.resolve(process.cwd(), 'app/assets'),
          to: 'assets'
        }
      ]
    }),
    new ProgressBar()
  ]),
  resolve: {
    modules: [ 'node_modules', 'app' ],
    extensions: [ '.js', '.jsx', '.react.js' ],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-redux': 'ReactRedux',
    'react-router-dom': 'ReactRouterDOM',
    'connected-react-router': 'ConnectedReactRouter',
    'redux-saga': 'ReduxSaga',
    'redux': 'Redux',
    'js-cookie': 'JsCookie',
    'lodash': 'lodash',
    'moment': 'moment',
    'react-intl': 'ReactIntl',
    'reselect': 'Reselect'
  },
  devtool: options.devtool,
  target: 'web',
  performance: options.performance || {}
});
