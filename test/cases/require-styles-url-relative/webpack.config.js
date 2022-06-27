const path = require('path');
const PugPlugin = require('../../../');

module.exports = {
  mode: 'production',
  //devtool: 'source-map',

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/',
  },

  entry: {
    home: './src/pages/home/index.pug',
    about: './src/pages/about/index.pug',
    contact: './src/pages/contact/index.pug',
  },

  plugins: [
    new PugPlugin({
      verbose: true,
      modules: [
        PugPlugin.extractCss({
          //verbose: true,
          // test conflict: Multiple chunks emit assets to the same filename
          filename: 'assets/css/[name].css',
        }),
      ],
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
        //use: ['css-loader', 'sass-loader'],
        use: [
          {
            loader: 'css-loader',
            options: {
              import: false, // disable @import at-rules handling in CSS
            },
          },
          'sass-loader',
        ],
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext][query]',
        },
      },
    ],
  },
};