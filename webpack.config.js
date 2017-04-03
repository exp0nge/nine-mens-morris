var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/game.js',
  output: { path: __dirname, filename: 'lib/bundle.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
};
