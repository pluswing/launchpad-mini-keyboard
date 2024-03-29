import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TailwindCss from 'tailwindcss';
import Autoprefixer from 'autoprefixer';

const isDev = process.env.NODE_ENV === 'development';

const baseModuleRules = [
  {
    test: /\.(j|t)sx?$/,
    exclude: /node_modules/,
    use: [
      { loader: 'ts-loader' },
      { loader: 'ifdef-loader', options: { DEBUG: false } },
    ],
  },
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: isDev,
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [TailwindCss, Autoprefixer],
          },
        },
      },
    ],
  },
  {
    test: /\.(ico|gif|jpe?g|png|svg|webp|ttf|otf|eot|woff?2?)$/,
    type: 'asset/resource',
  },
];

const nativeModulesRule = [
  {
    test: /\.node$/,
    loader: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: true },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
];

const base: Configuration = {
  mode: isDev ? 'development' : 'production',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: '[name].js',
    assetModuleFilename: 'assets/[name][ext]',
  },
  module: {
    rules: [...nativeModulesRule, ...baseModuleRules],
  },
  stats: 'errors-only',
  performance: { hints: false },
  optimization: { minimize: !isDev },
  devtool: isDev ? 'inline-source-map' : undefined,
};

const main: Configuration = {
  ...base,
  target: 'electron-main',
  entry: {
    main: './src/main.ts',
  },
  // see: https://www.utakata.work/entry/2020/05/11/231612
  externals: [{ '../build/Debug/iconv.node': 'debug-iconv-node' }],
};

const preload: Configuration = {
  ...base,
  target: 'electron-preload',
  entry: {
    preload: './src/preload.ts',
  },
};

const renderer: Configuration = {
  ...base,
  target: 'web',
  module: {
    rules: baseModuleRules,
  },
  entry: {
    index: './src/web/index.tsx',
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './src/web/index.html',
      minify: !isDev,
      inject: 'body',
      filename: 'index.html',
      scriptLoading: 'blocking',
    }),
  ],
};

export default [main, preload, renderer];
