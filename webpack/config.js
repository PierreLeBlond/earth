const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

const config = require(`./${process.env.NODE_ENV}.config`);

const common = {
  mode: config.mode,
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|hdr)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      }
    ],
  },

  resolve: { extensions: ['*', '.ts', '.js'] },

}

const library = {
  ...common,
  entry: './src/index.ts',

  output: {
    path: path.resolve(__dirname, '../dist/lib'),
    publicPath: config.publicPath,
    filename: 'index.js',
    library: {
      type: "module"
    },
    assetModuleFilename: `assets/${config.mediaFilename}`,
    chunkFilename: `chunks/${config.chunkFilename}`,
    clean: true
  },
  experiments: {
    outputModule: true
  },
  externalsType: 'var',
  externals: {
    '@s0rt/3d-viewer': 'VIEWER'
  },
  devtool: config.devtool,
  devServer: config.devServer,
};

const iife = {
  ...common,
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: config.publicPath,
    filename: 'main.js',
    assetModuleFilename: `assets/${config.mediaFilename}`,
    chunkFilename: `chunks/${config.chunkFilename}`
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: './' },
      ],
    }),
  ],
}

module.exports = [library, iife];