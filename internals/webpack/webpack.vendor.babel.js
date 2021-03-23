// Webpack Config - Vendor
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.resolve(process.cwd(), 'app/vendor.js'),
  output: {
    filename: 'vendors.js',
    path: path.resolve(process.cwd(), 'vendor/react/'),
    library: '[name]',
    libraryTarget: 'window'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            comparisons: false
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      })
    ]
  },
  resolve: {
    modules: [ 'app', 'node_modules' ],
    aliasFields: ['main'],
    descriptionFiles: ['package.json'],
    mainFields: [ 'main', 'browser', 'module' ],
    extensions: [ '.js', '.jsx' ]
  }
};
