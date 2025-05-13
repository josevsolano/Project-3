// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',

    entry: path.resolve(__dirname, 'client/src/main.tsx'),

    output: {
      filename:      isProd ? '[name].[contenthash].js' : 'bundle.js',
      chunkFilename: isProd ? '[name].[contenthash].js' : '[name].js',
      path:          path.resolve(__dirname, 'client/dist'),
      publicPath:    '/',
      clean:         true,
    },

    // no eval in dev; no sourcemaps in prod
    devtool: isProd ? false : 'source-map',

    resolve: {
      // **NO extra spaces** here:
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.html']
    },

    plugins: [
      new HtmlWebpackPlugin({
        // point at your real template
        template: path.resolve(__dirname, 'client', 'public', 'index.html'),
        filename: 'index.html'
      }),
      new webpack.DefinePlugin({
        'process.env.REACT_APP_GRAPHQL_ENDPOINT': JSON.stringify(
          process.env.REACT_APP_GRAPHQL_ENDPOINT
        )
      })
    ],

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              // point at your client tsconfig
              configFile: path.resolve(__dirname, 'client/tsconfig.json')
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },

    devServer: {
      static: {
        directory: path.resolve(__dirname, 'client/dist')
      },
      historyApiFallback: true,
      hot: true,
      port: 3000
    },

    optimization: {
      minimize: isProd,
      splitChunks: { chunks: 'all' }
    }
  };
};
