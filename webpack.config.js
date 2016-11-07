'use strict'

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const nodeEnv = process.env.NODE_ENV || 'development';

const rules = [
  (
    isProduction ?
      {test: /\.css$/, loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]'
      })}
    :
      {test: /\.css$/, use: [
        {loader: 'style-loader'},
        {loader: 'css-loader', options: {modules: true}}
      ]}
  ),
  {test: /\.svg/, use: [{loader: 'url-loader'}, {
    loader: 'svgo-loader', options: {
      plugins: [
        {removeTitle: true},
        {convertColors: {shorthex: false}},
        {convertPathData: false}
      ]
    }
  }]},
  {test: /\.png/, use: [{loader: 'url-loader', options: {limit: 1000}}]},
  {test: /\.jpg/, use: [{loader: 'url-loader', options: {limit: 1000}}]},
  {test: /\.woff/, use: [{loader: 'url-loader'}]},
  {
    test: /\.js?$/,
    include: [
      path.resolve('client'),
      path.resolve('utils')
    ],
    use: [{
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          require.resolve('babel-preset-es2015'),
          require.resolve('babel-preset-react'),
          require.resolve('babel-preset-stage-0')
        ],
        plugins: [
          require.resolve('babel-plugin-transform-decorators-legacy')
        ]
      }
    }]
  }
];

let common = [
  'react',
  'react-dom',
  'moment',
  'cerebral',
  'cerebral-view-react',
  'cerebral-module-router',
  'cerebral-module-forms',
  'cerebral-module-http',
  'cerebral-module-firebase',
  'classnames',
  'firebase'
];

let plugins = [
  new HtmlWebpackPlugin({
    title: 'Ducky',
    template: path.resolve('index.template.html'),
    inject: true,
    chunksSortMode: 'dependency'
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
      DUCKY_FIREBASE_APP: JSON.stringify(process.env.DUCKY_FIREBASE_APP)
    }
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/)
];

if (isProduction) {
  plugins = plugins.concat([
    new WebpackMd5Hash(),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['common', 'manifest']
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true
      },
      mangle: {
        except: ['webpackJsonp'],
        screw_ie8: true
      }
    }),
    new ExtractTextPlugin('[name].[chunkhash].css')
  ]);
}

module.exports = {
  target: 'web',
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  entry: {
    main: path.resolve('client', 'main.js'),
    common: common
  },
  output: {
    path: path.resolve('public'),
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    chunkFilename: isProduction ? '[chunkhash].js' : '[id].js',
    publicPath: '/'
  },
  devServer: isProduction ? {} : {
    port: 3000,
    historyApiFallback: true,
    inline: true,
    stats: 'errors-only'
  },
  resolve: {
    modules: [path.resolve('node_modules')],
    alias: {
      common: path.resolve('client', 'common'),
      modules: path.resolve('client', 'modules'),
      computed: path.resolve('client', 'computed'),
      images: path.resolve('public', 'images'),
      config: isProduction ? path.resolve('config', 'herokuConfig.js') : path.resolve('config', 'developerConfig.js'),
      utils: path.resolve('utils')
    }
  },
  module: {
    rules: rules
  },
  plugins: plugins
};
