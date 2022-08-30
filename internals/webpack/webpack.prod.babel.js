// Webpack Config - Production
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const htmlChunks = [ 'app', 'login', 'register', 'activation', 'find-password' ];
const getExcludeHtmlChunks = (value) => htmlChunks.filter((htmlChunk) => value !== htmlChunk);

module.exports = require('./webpack.base.babel')({
  mode: 'production',
  entry: {
    app: path.join(process.cwd(), 'app/app.js'),
    login: path.join(process.cwd(), 'login/login.js'),
    register: path.join(process.cwd(), 'register/register.js'),
    activation: path.join(process.cwd(), 'activation/activation.js'),
    'find-password': path.join(process.cwd(), 'find-password/find-password.js')
  },
  output: {
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].chunk.js'
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
    ],
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 10,
      minSize: 0,
      cacheGroups: {},
      name: 'vendor'
    }
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true,
      excludeChunks: getExcludeHtmlChunks('app')
    }),
    new HtmlWebpackPlugin({
      template: 'login/login.html',
      filename: 'login.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      excludeChunks: getExcludeHtmlChunks('login'),
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: 'register/register.html',
      filename: 'register.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      excludeChunks: getExcludeHtmlChunks('register'),
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: 'activation/activation.html',
      filename: 'activation.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      excludeChunks: getExcludeHtmlChunks('activation'),
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: 'find-password/find-password.html',
      filename: 'find-password.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      excludeChunks: getExcludeHtmlChunks('find-password'),
      inject: true
    }),
    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20
    })
  ],
  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)
  }
});
