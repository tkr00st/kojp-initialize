const path = require('path');
const globule = require('globule');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GlobImporter = require('node-sass-glob-importer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const AutoPrefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getEntriesList = (targetTypes) => {
  const entriesList = {};
  for (const [srcType, targetType] of Object.entries(targetTypes)) {
    const filesMatched = globule.find([`**/*.${srcType}`, `!**/_*.${srcType}`], { cwd: `${__dirname}/src` });

    for (const srcName of filesMatched) {
      const targetName = srcName.replace(new RegExp(`.${srcType}$`, 'i'), `.${targetType}`);
      entriesList[targetName] = `${__dirname}/src/${srcName}`;
    }
  }
  return entriesList;
};

const app = {
  entry: {
    app: [
      './src/js/app.js',
      './src/sass/style.scss',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  devServer: {
    contentBase: './dist',
    watchContentBase: true,
    port: 3000,
    open: true,
  },
  module: {
    rules: [{
      test: /\.ejs$/,
      loader: [
        'html-loader',
        'ejs-html-loader',
      ],
    },
    {
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },
    {
      test: /\.scss$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: 'css-loader',
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: [
            AutoPrefixer({
              browsers: ['last 2 versions', 'Android >= 4'],
            }),
          ],
        },
      }, {
        loader: 'sass-loader',
        options: {
          importer: GlobImporter(),
        },
      }],
    },
    {
      test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
      use: [{
        loader: 'url-loader?limit=100000&name=img/[name].[ext]',
      }],
    },
    ],
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
      new UglifyJsPlugin(),
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'src/img/'),
      to: path.resolve(__dirname, 'dist/img/'),
    }]),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: '95-100',
      },
    }),
  ],
};

for (const [targetName, srcName] of Object.entries(getEntriesList({ ejs: 'html' }))) {
  app.plugins.push(new HtmlWebpackPlugin({
    filename: targetName,
    template: srcName,
  }));
};

module.exports = app;