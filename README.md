<div align="center">
    <h1>
        <a href="https://pugjs.org">
            <img height="135" src="https://cdn.rawgit.com/pugjs/pug-logo/eec436cee8fd9d1726d7839cbe99d1f694692c0c/SVG/pug-final-logo-_-colour-128.svg">
        </a>
        <a href="https://github.com/webpack/webpack">
            <img height="120" src="https://webpack.js.org/assets/icon-square-big.svg">
        </a>
        <a href="https://github.com/webdiscus/pug-plugin"><br>
        Pug Plugin
        </a>
    </h1>
  <div>Pug plugin for webpack compiles Pug files into HTML and extract CSS, JS hashed files from theirs sources used in Pug</div>
</div>

---
[![npm](https://img.shields.io/npm/v/pug-plugin?logo=npm&color=brightgreen "npm package")](https://www.npmjs.com/package/pug-plugin "download npm package")
[![node](https://img.shields.io/node/v/pug-plugin)](https://nodejs.org)
[![node](https://img.shields.io/github/package-json/dependency-version/webdiscus/pug-plugin/peer/webpack)](https://webpack.js.org/)
[![codecov](https://codecov.io/gh/webdiscus/pug-plugin/branch/master/graph/badge.svg?token=Q6YMEN536M)](https://codecov.io/gh/webdiscus/pug-plugin)
[![node](https://img.shields.io/npm/dm/pug-plugin)](https://www.npmjs.com/package/pug-plugin)


Pug plugin enable to define Pug files in webpack entry.
Pug plugin extract JavaScript and CSS from Pug files.

>💡 See the demo site [Hello World](https://webdiscus.github.io/pug-plugin/hello-world/) and [sources](https://github.com/webdiscus/pug-plugin/tree/master/examples/hello-world).

Define Pug files in webpack entry, so easy:
```js
const PugPlugin = require('pug-plugin');
module.exports = {
  entry: {
    index: './src/views/index.pug',      // output index.html
    about: './src/views/about/index.pug' // output about.html
    // ..
  },
  plugins: [
    new PugPlugin(), // enable using Pug files in entry
  ],
  // ...
};
```

Use source files of styles and scripts directly in pug:
```pug
link(href=require('./styles.scss') rel='stylesheet')
script(src=require('./main.js'))
```

Generated HTML contains hashed CSS and JS output filenames:
```html
<link href="/assets/css/styles.05e4dd86.css" rel="stylesheet">
<script src="/assets/js/main.f4b855d8.js"></script>
```

> 💡 The Pug file is entry point for all assets. 
> Do not need more to define styles and scripts in the webpack entry and inject them via other plugins.
> All required resources in Pug will be automatically processed.


The single Pug plugin perform the most commonly used functions of the following packages:

| Package                                                                                   | Features                                                         | 
|-------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)                    | extract HTML and save in a file                                  |
| [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)     | extract CSS and save in a file                                   |
| [webpack-remove-empty-scripts](https://github.com/webdiscus/webpack-remove-empty-scripts) | remove empty js files generated by the `mini-css-extract-plugin` |
| [resolve-url-loader](https://github.com/bholloway/resolve-url-loader)                     | resolve url in CSS                                               |
| [svg-url-loader](https://github.com/bhovhannes/svg-url-loader)                            | encode SVG data-URL as utf8                                      |
| [posthtml-inline-svg](https://github.com/andrey-hohlov/posthtml-inline-svg)               | inline SVG icons in HTML                                         |
| [pug-loader](https://github.com/webdiscus/pug-loader)                                     | the Pug loader is already included in the Pug plugin             |

You can replace all of the above packages with just one Pug plugin.

> ⚠️ **NOT RECOMMENDED** to use the `pug-plugin` together with `html-webpack-plugin` and `mini-css-extract-plugin`.
> 
> The `pug-plugin` is designed to replace these plugins. The `pug-plugin` does the same thing, but much easy, more efficiently and faster.

## Contents

---
1. [Install and Quick start](#install)
2. [Features](#features)
3. [Plugin options](#plugin-options)
4. [Usage examples](#usage-examples)
5. [Recipes](#recipes)

## Features
<a id="features" name="features" href="#features"></a>

- you can define Pug files in webpack entry
- you can use source files of scripts and styles directly in Pug
- generated HTML contains already hashed CSS and JS output filenames
- resolves URL in CSS for relative and module path, extract resolved resource to output path\
  not need more additional plugin such as [resolve-url-loader](https://github.com/bholloway/resolve-url-loader)
- support the `pretty` formatting  of generated HTML
- support the module type `asset/resource`
- support the module type `asset/inline`
- support the module type `asset` to automatically choose between `resource` and `inline`
- support the base64 encoding of binary images as data-URL in HTML and CSS
- support the `inline SVG` in HTML
- support the `inline SVG` as data-URL in CSS
  ```scss
  background: url('./icons/iphone.svg') // CSS: url("data:image/svg+xml,<svg>...</svg>")
  ```
- support the plugin modules to define a separate source / output path and filename for each file type
- support the `post process` for modules to handle the extracted content
- pug-plugin already contains the [pug-loader](https://github.com/webdiscus/pug-loader)
- support the [responsive-loader](https://github.com/dazuaz/responsive-loader), see [usage example](https://github.com/webdiscus/pug-plugin/tree/master/test/manual/require-responsive-image)


## Install and Quick start
<a id="install" name="install" href="#install"></a>

Install the `pug-plugin`:
```bash
npm install pug-plugin --save-dev
```

Install additional packages for styles:
```bash
npm install css-loader sass sass-loader --save-dev
```

Change your `webpack.config.js` according to the following minimal configuration:

```js
const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/', // must be defined any path, `auto` is not supported
    // output filename for JS files
    filename: 'assets/js/[name].[contenthash:8].js'
  },

  entry: {
    // all scripts and styles can be used in Pug,
    // do not need to define JS and SCSS in the webpack entry

    // define Pug files in entry:
    index: './src/views/index.pug',      // output index.html
    about: './src/views/about/index.pug' // output about.html
    // ...
  },

  plugins: [
    // enable processing of Pug files from entry
    new PugPlugin({
      modules: [
        // module extracts CSS from style source files required in Pug
        PugPlugin.extractCss({
          // output filename of CSS files
          filename: 'assets/css/[name].[contenthash:8].css'
        })
      ]
    })
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader, // pug-plugin already contain the pug-loader
        options: {
          method: 'render', // fastest method to generate static HTML files
        }
      },
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'sass-loader']
      },
    ],
  },
};
```

Pug template `src/views/index.pug`:
```pug
html
  head
    //- add styles in head
    link(href=require('./styles.scss') rel='stylesheet')
  body
    h1 Hello Pug!
    
    //- add scripts at last position in body
    script(src=require('./main.js'))
```

Generated HTML:
```html
<html>
  <head>
    <link href="/assets/css/styles.f57966f4.css" rel="stylesheet">
  </head>
  <body>
    <h1>Hello Pug!</h1>
    <script src="/assets/js/main.b855d8f4.js"></script>
  </body>
</html>
```

> ⚠️ **ATTENTION**
> 
> - Don't define styles and JS files in entry. You can use `require()` for source files of JS and SCSS in Pug.
> - Don't import styles in JS. Use `require()` for style files in Pug.
> - Don't use `html-webpack-plugin` to render Pug files in HTML. The Pug plugin processes files from webpack entry.
> - Don't use `mini-css-extract-plugin` to extract CSS from styles. The Pug plugin extract CSS from styles required in Pug.

<a id="plugin-options" name="plugin-options" href="#plugin-options"></a>
## Plugin options

The plugin options are default options for self plugin and all plugin `modules`. 
In a defined `module` any option can be overridden.

### `enabled`
Type: `boolean` Default: `true`<br>
Enable/disable the plugin.

### `verbose`
Type: `boolean` Default: `false`<br>
Show the file information at processing of entry.

### `pretty`
Type: `boolean` Default: `false`<br>
Pretty formatting the resulting HTML. Use this option for debugging only. For production build should be disabled.
This option only works for Pug files defined in the webpack entry.
> ⚠️ The `pretty` option of the `pug-loader` is deprecated, therefore use this `pretty` option in `pug-plugin`.
```js
const PugPlugin = require('pug-plugin');
module.exports = {
  plugins: [
    new PugPlugin({
      pretty: true, // use this to format HTML
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
        options: {
          pretty: false, // deprecated, is always false, don't use it
        }
      },
    ],
  },
};
```

### `test`
Type: `RegExp` Default: `/\.pug$/`<br>
Use the `test` to match module options by source filename of a resource.\
For example, save all extracted  `svg` files from `fonts/` to the separate output directory:
```js
const PugPlugin = require('pug-plugin');
module.exports = {
  plugins: [
    new PugPlugin({
      modules: [
        {
          test: /fonts\/.+\.svg$/,
          outputPath: path.join(__dirname, 'dist/some/other/path/'),
        },
      ],
    }),
  ],
};
```

### `sourcePath`
Type: `string` Default: `webpack.options.context`<br>
The absolute path to sources.

### `outputPath`
Type: `string` Default: `webpack.options.output.path`<br>
The output directory for processed entries. This directory can be relative by `webpack.options.output.path` or absolute.

### `filename`
Type: `string | Function` Default: `webpack.output.filename || '[name].html'`<br>
The name of output file.
- If type is `string` then following substitutions (see [output.filename](https://webpack.js.org/configuration/output/#outputfilename) for chunk-level) are available in template string:
  - `[id]` The ID of the chunk.
  - `[name]` Only filename without extension or path.
  - `[contenthash]` The hash of the content.
  - `[contenthash:nn]` The `nn` is the length of hashes (defaults to 20).
- If type is `Function` then following parameters are available in the function:
  - `@param {webpack PathData} pathData` See the description of this type [here](https://webpack.js.org/configuration/output/#template-strings)
  - `@param {webpack AssetInfo} assetInfo`
  - `@return {string}` The name or template string of output file.

### `postprocess`
Type: `Function` Default: `null`<br>
The post process for extracted content from compiled entry.
The following parameters are available in the function:
  - `@param {string} content` The content of compiled entry.
  - `@param {ResourceInfo} info` The info of current asset.
  - `@param {webpack Compilation} compilation` The webpack [compilation object](https://webpack.js.org/api/compilation-object/).
  - `@return {string | null}` Return string content to save to output directory.\
    If return `null` then the compiled content of the entry will be ignored, and will be saved original content compiled as JS module.
    Returning `null` can be useful for debugging to see the source of the compilation of the webpack loader.

```js
/**
 * @typedef {Object} ResourceInfo
 * @property {boolean} [verbose = false] Whether information should be displayed.
 * @property {boolean} isEntry True if is the asset from entry, false if asset is required from pug.
 * @property {string} outputFile The absolute path to generated output file (issuer of asset).
 * @property {string | (function(PathData, AssetInfo): string)} filename The filename template or function.
 * @property {string} sourceFile The absolute path to source file.
 * @property {string} assetFile The output asset file relative by `output.publicPath`.
 */
```

### `modules`
Type: `PluginOptions[]` Default: `[]`<br>
The array of objects of type `PluginOptions` to separately handles of files of different types.\
The description of `@property` of the type `PluginOptions` see above, by Plugin options.
```js
/**
 * @typedef {Object} PluginOptions
 * @property {boolean} enabled
 * @property {boolean} verbose
 * @property {RegExp} test
 * @property {string} sourcePath
 * @property {string} outputPath
 * @property {string | function(PathData, AssetInfo): string} filename
 * @property {function(string, ResourceInfo, Compilation): string | null} postprocess
 */
```

<a id="usage-examples" name="usage-examples" href="#usage-examples"></a>
## Usage examples

### Using source files of JS, SCSS, images and fonts
The simple example of resolving the asset resources via require() in Pug and via url() in scss.

The webpack config:
```js
const PugPlugin = require('pug-plugin');
module.exports = {
  entry: {
    index: './src/pages/home/index.pug', // one entry point for all assets
    // ... here can be defined many Pug templates
  },

  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/',
    // output filename for JS files
    filename: 'assets/js/[name].[contenthash:8].js'
  },
  
  resolve: {
    alias: {
      // use alias to avoid relative paths like `./../../images/`
      Images: path.join(__dirname, './src/images/'),
      Fonts: path.join(__dirname, './src/fonts/')
    }
  },

  plugins: [
    new PugPlugin({
      modules: [
        PugPlugin.extractCss({
          // output filename for CSS files
          filename: 'assets/css/[name].[contenthash:8].css'
        })
      ]
    })
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
        options: {
          method: 'render',
        }
      },
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|jpeg|ico)/,
        type: 'asset/resource',
        generator: {
          // output filename for images
          filename: 'assets/img/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset/resource',
        generator: {
          // output filename for fonts
          filename: 'assets/fonts/[name][ext][query]',
        },
      },
    ],
  },
};
```

The Pug template `./src/pages/home/index.pug`:
```pug
html
  head
    link(rel="icon" type="image/png" href=require('~Images/favicon.png'))
    link(rel='stylesheet' href=require('./styles.scss'))
  body
    .header Here is the header with background image
    h1 Hello Pug!
    img(src=require('~Images/pug-logo.jpg') alt="pug logo")
    script(src=require('./main.js'))
```

The source script `./src/pages/home/main.js`
```js
console.log('Hello Pug!');
```

The source styles `./src/pages/home/styles.scss`
```scss
// Pug plugin can resolve styles in node_modules. 
// The package 'material-icons' must be installed in packages.json.
@import 'material-icons'; 

// Resolve the font in the directory using the webpack alias.
@font-face {
  font-family: 'Montserrat';
  src: url('~Fonts/Montserrat/Montserrat-Regular.woff2'); // pug-plugin can resolve url
  font-style: normal;
  font-weight: 400;
}

body {
  font-family: 'Montserrat', serif;
}

.header {
  width: 100%;
  height: 120px;
  background-image: url('~Images/header.png'); // pug-plugin can resolve url
}
```

>💡The Pug plugin can resolve an url (as relative path, with alias, from node_modules) without requiring `source-maps`. Do not need additional loader such as `resolve-url-loader`.

The generated CSS `dist/assets/css/styles.f57966f4.css`:
```css
/*
 * All styles of npm package 'material-icons' are included here.
 * The imported fonts from `node_modules` will be coped in output directory. 
 */
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: 
      url(/assets/fonts/material-icons.woff2) format("woff2"),
      url(/assets/fonts/material-icons.woff) format("woff");
}
.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  /* ... */
}
/* ... */

/* 
 * Fonts from local directory. 
 */
@font-face {
  font-family: 'Montserrat';
  src: url(/assets/fonts/Montserrat-Regular.woff2);
  font-style: normal;
  font-weight: 400;
}

body {
  font-family: 'Montserrat', serif;
}

.header {
  width: 100%;
  height: 120px;
  background-image: url(/assets/img/header.4fe56ae8.png);
}
```

>💡All resolved files will be coped to the output directory, so no additional plugin is required, such as `copy-webpack-plugin`.

The generated HTML `dist/index.html` contains the hashed output filenames of the required assets:
```html
<html>
  <head>
    <link rel="stylesheet" href="/assets/css/styles.f57966f4.css">
  </head>
  <body>
    <div class="header">Here is the header with background image</div>
    <h1>Hello Pug!</h1>
    <img src="/assets/img/pug-logo.85e6bf55.jpg" alt="pug logo">
    <script src="/assets/js/main.b855d8f4.js"></script>
  </body>
</html>
```

All this is done by one Pug plugin, without additional plugins and loaders. To save build time, to keep your webpack config clear and clean, just use this plugin.

---

### Save the `.html` file in separate file 

Dependency: `html-loader`  This loader is need to handle the `.html` file type.\
Install: `npm install html-loader --save-dev`

webpack.config.js
```js
const path = require('path');
const PugPlugin = require('pug-plugin');
module.exports = {
  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/',
  },
  entry: {
    'example': './vendor/pages/example.html', // output to /static/example.html
  },
  plugins: [
    new PugPlugin({
      modules: [
        // add the module to match `.html` files in webpack entry
        {
          test: /\.html$/,
          filename: '[name].html', // output filename
          outputPath: 'static/', // output path for all .html files defined in entry
        },
      ],
    }),
  ],
  module: {
    rules: [
      // add the loader to handle `.html` files
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          sources: false, // disable processing of resources in static HTML, leave as is
          esModule: false, // webpack use CommonJS module
        },
      },
    ],
  },
};
```
---

### Extract CSS from SASS defined in webpack entry

Dependencies:
- `css-loader` handles `.css` files and prepare CSS for any CSS extractor
- `sass-loader` handles `.scss` files
- `sass` compiles Sass to CSS

Install: `npm install css-loader sass sass-loader --save-dev`

webpack.config.js
```js
const path = require('path');
const PugPlugin = require('pug-plugin');
module.exports = {
  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/',
  },
  entry: {
    'css/styles': './src/assets/main.scss', // output to public/css/styles.css
  },
  plugins: [
    new PugPlugin({
      modules: [
        // add the module to extract CSS
        // see options https://github.com/webdiscus/pug-plugin#options
        PugPlugin.extractCss({
          filename: '[name].[contenthash:8].css',
        })
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'sass-loader'],
      },
    ],
  },
};
```

> 
> When using `PugPlugin.extractCss()` to extract CSS from `webpack entry` the following plugins are not needed:
> - [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
> - [webpack-remove-empty-scripts](https://github.com/webdiscus/webpack-remove-empty-scripts) - fix plugin for mini-css-extract-plugin
> 
> The plugin module `PugPlugin.extractCss` extract and save pure CSS without empty JS files.
> 
> ⚠️ When using `PugPlugin.extractCss()` don't use the `style-loader`. 

> ⚠️ **Limitation for CSS**\
> The `@import` CSS rule is not supported. 
> This is a [BAD practice](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/page-speed-rules-and-recommendations?hl=en#avoid_css_imports), avoid CSS imports.
> Use any CSS preprocessor like the Sass to create a style bundle using the preprocessor import.
---

### Usage `pug-plugin` and `pug-loader` with `html` render method.

> Don't use it if you don't know why you need it.\
> It's only the example of the solution for possible trouble by usage the `html-loader`.\
> Usually is used the `render` or `compile` method in `pug-loader` options.

For example, by usage in Pug both static and dynamic resources.

index.pug
```pug
html
  head
    //- Static resource URL from public web path should not be parsed, leave as is.
    link(rel='stylesheet' href='/absolute/assets/about.css')
    //- Required resource must be processed.
        Output to /assets/css/styles.8c1234fc.css
    link(rel='stylesheet' href=require('./styles.scss'))
  body
    h1 Hello World!
    
    //- Static resource URL from public web path should not be parsed, leave as is.
    img(src='relative/assets/logo.jpeg')
    //- Required resource must be processed.
        Output to /assets/images/image.f472de4f4.jpg
    img(src=require('./image.jpeg'))

```

webpack.config.js
```js
const fs = require('fs');
const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'public/'),
    publicPath: '/',
  },

  entry: {
    index: './src/index.pug',
  },

  plugins: [
    new PugPlugin({
      modules: [
        PugPlugin.extractCss({
          filename: 'assets/css/[name].[contenthash:8].css',
        })
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              // Webpack use CommonJS module
              esModule: false,
              sources: {
                // ignore not exists sources
                urlFilter: (attribute, value) => path.isAbsolute(value) && fs.existsSync(value),
              },
            },
          },
          {
            loader: PugPlugin.loader,
            options: {
              method: 'html', // usually is used the `render` method
            },
          },
        ],
      },

      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'sass-loader'],
      },

      {
        test: /\.(png|jpg|jpeg)/,
        type: 'asset/resource', // process required images in pug
        generator: {
          filename: 'assets/images/[name].[hash:8][ext]',
        },
      },
    ],
  },
};
```

> ### ⚠️ When used `PugPlugin` and `html-loader` 
>
> A static resource URL from a public web path should not be parsed by the `html-loader`. Leave the URL as is:
> ```html
> img(src='/assets/image.jpg')
> link(rel='stylesheet' href='assets/styles.css')
> ```
> Loading a resource with `require()` should be handled via webpack:
> ```html
> img(src=require('./image.jpg'))
> link(rel='stylesheet' href=require('./styles.css'))
> ```
> For this case add to `html-loader` the option:\
> `sources: { urlFilter: (attribute, value) => path.isAbsolute(value) && fs.existsSync(value) }`


<a id="recipes" name="recipes" href="#recipes"></a>
## Recipes

### HMR live reload

To enable live reload by changes any file add in the webpack config following options:
```js
devServer: {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  watchFiles: {
    paths: ['src/**/*.*'], 
      options: {
        usePolling: true,
      },
  },
  port: 8080,
},
```
> **Note:** Live reload works only if in Pug used a JS file.
> If your Pug template has not a JS, then create one empty JS file and add it in Pug:
> ```js
> script(src=require('./dummy.js'))
> ```
> Don't forget disable this dummy script for production build:
> ```js
> //- script(src=require('./dummy.js'))
> ```


## Testing

`npm run test` will run the unit and integration tests.\
`npm run test:coverage` will run the tests with coverage.

## Also See

- more examples of usages see in [test cases](https://github.com/webdiscus/pug-plugin/tree/master/test/cases)
- [ansis][ansis] - ANSI color styling of text in terminal
- [pug-loader][pug-loader]
- [pug GitHub][pug]
- [pug API Reference][pug-api]

## License

[ISC](https://github.com/webdiscus/pug-loader/blob/master/LICENSE)

[ansis]: https://github.com/webdiscus/ansis
[pug]: https://github.com/pugjs/pug
[pug-api]: https://pugjs.org/api/reference.html
[pug-loader]: https://github.com/webdiscus/pug-loader
