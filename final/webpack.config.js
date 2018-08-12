const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app/javascripts/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: "index.html" },
      { from: './app/GetHighestBidder.html', to: "GetHighestBidder.html" },
      { from: './app/buy.html', to: "buy.html" },
      { from: './app/transferfrom.html', to: "transferFrom.html" },
      { from: './app/transfer.html', to: "transfer.html" },
      { from: './app/authorize.html', to: "authorize.html" },
      { from: './app/allowance.html', to: "allowance.html" },
      { from: './app/mint.html', to: "mint.html" },
      { from: './app/GetBalance.html', to: "GetBalance.html" },
      { from: './app/burn.html', to: "burn.html" },
      { from: './app/bidding.html', to: "bidding.html" },
      { from: './app/landing.html', to: "landing.html" }
    ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
