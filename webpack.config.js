const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWrbpackPlugin = require('copy-webpack-plugin');
const CssMinimizerExtractPlugin = require('css-minimizer-webpack-plugin');
const TraserWebpackPlugin = require('terser-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

const optimizeJs = isDevelopment ? 'main.js' : 'main.[contenthash].js';
const optimizeCss = isDevelopment ? 'main.css' : 'main.[contenthash].css';

module.exports = {
   entry: './src/app/main.js',

   output: {
      filename: optimizeJs,
      path: path.resolve(__dirname, 'dist'),
   },

   devtool: 'source-map',

   optimization: {
      minimizer: [new CssMinimizerExtractPlugin(), new TraserWebpackPlugin()],
   },

   plugins: [
      new HtmlWebpackPlugin({
         template: './src/index.html',
         minify: {
            removeAttributeQuotes: isProduction,
            collapseWhitespace: isProduction,
            removeComments: isProduction,
         },
      }),
      new CleanWebpackPlugin(),

      new MiniCssExtractPlugin({
         filename: 'main.scss',
         filename: optimizeCss,
      }),

      new CopyWrbpackPlugin({
         patterns: [
            {
               from: path.resolve(__dirname, './src/assets'),
               to: path.resolve(__dirname, 'dist'),
               noErrorOnMissing: true,
            },
         ],
      }),
   ],

   module: {
      rules: [
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
         },

         {
            test: /\.s[ca]ss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
         },
      ],
   },
};
