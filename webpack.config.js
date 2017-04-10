var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/game.js',
    control: './src/events.js'
  },
  output: { path: __dirname, filename: 'lib/[name]-bundle.js' },
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
