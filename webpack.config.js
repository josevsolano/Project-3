// webpack.config.js
const path = require('path');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    entry: path.resolve(__dirname, 'client/src/main.tsx'),
    output: {
      filename: isProd ? '[name].[contenthash].js' : 'bundle.js',
      chunkFilename: isProd ? '[name].[contenthash].js' : '[name].js',
      path: path.resolve(__dirname, 'client/dist'),
      publicPath: '/',
      clean: true,
    },
    devtool: isProd ? false : 'source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
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
      splitChunks: {
        chunks: 'all'
      }
    }
  };
};
