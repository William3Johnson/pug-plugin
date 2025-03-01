const path = require('path');
const PugPlugin = require('../../../');

module.exports = {
  mode: 'production',

  resolve: {
    alias: {
      Styles: path.join(__dirname, 'src/assets/styles/'),
    },
  },

  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].[contenthash:8].js',
    publicPath: '', // test url() in CSS with relative public path
  },

  entry: {
    index: './src/views/index.pug',
  },

  plugins: [
    new PugPlugin({
      extractCss: {
        filename: 'assets/css/[name].[contenthash:8].css',
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
        options: {
          method: 'render',
        },
      },
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|ico)/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name].[hash:8][ext]',
        },
      },
    ],
  },
};