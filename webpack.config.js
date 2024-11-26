// webpack.config.js

const path = require('path');

module.exports = {
  entry: {
    content: './src/content.js',
    background: './src/background.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  // Ensure that the build doesn't include code that requires 'eval()'
  devtool: false,
};
