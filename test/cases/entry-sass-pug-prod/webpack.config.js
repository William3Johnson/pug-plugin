const path = require('path');
const PugPlugin = require('../../../');

const isProduction = true;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : 'source-map',

  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/',
  },

  entry: {
    styles: './src/assets/main.scss',
    index: './src/index.pug',
  },

  plugins: [
    new PugPlugin({
      extractCss: {
        filename: isProduction ? '[name].[contenthash:8].css' : '[name].css',
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(pug)$/,
        loader: PugPlugin.loader,
        options: {
          method: 'render',
        },
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            loader: 'css-loader',
            // test ESM
            options: { esModule: true },
          },
          'sass-loader',
        ],
      },
    ],
  },
};