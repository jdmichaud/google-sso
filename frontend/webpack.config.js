var path = require('path');
var webpack = require('webpack');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
          presets: ['@babel/preset-env']
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'templates/index.html',
      chunksSortMode: 'dependency',
    }),
    new CopyWebpackPlugin([{ from: 'templates' }]),
  ],
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],
    extensions: ['.js'],
  },
  devtool: 'source-map'
};