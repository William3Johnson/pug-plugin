const path = require('path');
const PugPlugin = require('pug-plugin'); // use it in your code
//const PugPlugin = require('../../'); // use local code of pug-plugin for development

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'inline-source-map',

    stats: {
      preset: 'minimal',
    },

    resolve: {
      // aliases used in pug, scss, js
      alias: {
        Views: path.join(__dirname, 'src/views/'),
        Images: path.join(__dirname, 'src/assets/images/'),
        Fonts: path.join(__dirname, 'src/assets/fonts/'),
        Styles: path.join(__dirname, 'src/assets/styles/'),
        Scripts: path.join(__dirname, 'src/assets/scripts/'),
      },
    },

    output: {
      path: path.join(__dirname, 'dist'),
      // build for GitHub Page: https://webdiscus.github.io/pug-plugin/hello-world/
      publicPath: isProd ? '/pug-plugin/hello-world/' : '/',
      // output filename of scripts
      filename: 'assets/js/[name].[contenthash:8].js',
      chunkFilename: 'assets/js/[name].[id].js',
    },

    entry: {
      // !!! ATTENTION !!!
      //
      // The pug-plugin enable to use script and style source files directly in Pug, so easy:
      //
      //   link(href=require('./styles.scss') rel='stylesheet')
      //   script(src=require('./main.js'))
      //
      // Don't define styles and js files in entry. You can require source files of js and scss directly in Pug.
      // Don't use `html-webpack-plugin` to render Pug files in HTML. Pug plugin do it directly from here and much faster.
      // Don't use `mini-css-extract-plugin` to extract CSS from styles. Pug plugin extract CSS from style sources required in Pug.

      // Please, see more details under https://github.com/webdiscus/pug-plugin

      // Yes, You can define Pug files directly in entry, so easy:
      index: 'src/views/pages/home/index.pug',
      contact: 'src/views/pages/contact/index.pug',
      about: 'src/views/pages/about/index.pug',
    },

    plugins: [
      // enable processing of Pug files from entry
      new PugPlugin({
        verbose: !isProd, // output information about the process to console
        pretty: !isProd, // formatting of HTML
        modules: [
          // module extracts CSS from style source files required directly in Pug
          PugPlugin.extractCss({
            // output filename of styles
            filename: 'assets/css/[name].[contenthash:8].css',
          }),
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: PugPlugin.loader, // PugPlugin already contain the pug-loader
          options: {
            method: 'render', // fastest method to generate static HTML files
            // enable filters only those used in pug
            embedFilters: {
              // :escape
              escape: true,
              // :code
              code: {
                className: 'language-',
              },
              // :highlight
              highlight: {
                verbose: !isProd,
                use: 'prismjs', // name of a highlighting npm package, must be extra installed
              },
            },
          },
        },

        // styles
        {
          test: /\.(css|sass|scss)$/,
          use: ['css-loader', 'sass-loader'],
        },

        // fonts
        {
          test: /\.(woff2?|ttf|otf|eot|svg)$/,
          type: 'asset/resource',
          include: /assets\/fonts/, // fonts from `assets/fonts` directory only
          generator: {
            // output filename of fonts
            filename: 'assets/fonts/[name][ext][query]',
          },
        },

        // images
        {
          test: /\.(png|svg|jpe?g|webp)$/i,
          resourceQuery: { not: [/inline/] }, // ignore images with `?inline` query
          type: 'asset/resource',
          include: /assets\/images/, // images from `assets/images` directory only
          generator: {
            // output filename of images
            filename: 'assets/img/[name].[hash:8][ext]',
          },
        },

        // inline images: png or svg icons with size < 4 KB
        {
          test: /\.(png|svg)$/i,
          type: 'asset',
          include: /assets\/images/,
          exclude: /favicon/, // don't inline favicon
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024,
            },
          },
        },

        // force inline svg file containing `?inline` query
        {
          test: /\.(svg)$/i,
          resourceQuery: /inline/,
          type: 'asset/inline',
        },
      ],
    },

    performance: {
      hints: isProd ? 'error' : 'warning',
      // in development mode the size of assets is bigger than in production
      maxEntrypointSize: isProd ? 1024000 : 4096000,
      maxAssetSize: isProd ? 1024000 : 4096000,
    },

    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      //port: 8080,
      https: false,
      compress: true,
      open: true, // open in default browser

      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: true,
        },
      },
    },
  };
};
