var path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, 'src/index.jsx')
  ],
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'js'),
    publicPath: './js/',
    filename: 'bundle.js'
  },
  watch: true,
  plugins: [
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./', './build']
      }
    })
  ],
  module: {
    loaders: [
      {
        // "test" is commonly used to match the file extension
        test: /\.jsx?$/,
        // "include" is commonly used to match the directories
        include: path.join(__dirname, 'src'),
        // the "loader"
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
