const path = require('path');
const PugPlugin = require('../../../');

const basePath = path.resolve(__dirname);

module.exports = {
  mode: 'production',
  devtool: 'source-map',

  resolve: {
    alias: {
      Images: path.join(basePath, 'src/assets/images/'),
    },
  },

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/',
  },

  entry: {
    //
    index: './src/views/index.pug',
    'assets/css/styles': './src/views/index.css',
    //
    about: './src/views/about/template.pug',
    'assets/css/about': './src/views/about/styles.css',
    //
    'pages/page01': './src/views/page01/template.pug',
    'assets/css/page01': './src/views/page01/styles.css',
  },

  plugins: [
    new PugPlugin({
      // for test coverage
      verbose: true,
      modules: [
        // test plugin module to extract css
        PugPlugin.extractCss({
          // for test coverage
          verbose: true,
        }),
      ],
    }),
  ],

  module: {
    rules: [
      // Templates
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
      },
      // Styles
      {
        test: /\.(css)$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              //sourceMap: true,
            },
          },
        ],
      },
      // Images
      {
        test: /\.(png|jpg|jpeg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash:8][ext]',
        },
      },
    ],
  },
};