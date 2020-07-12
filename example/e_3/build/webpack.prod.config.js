const { resolve } = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssets = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpack = require('clean-webpack-plugin').CleanWebpackPlugin
const BaseConfig = require('./webpack.base.config')

module.exports = merge(BaseConfig, {
  mode: 'production',

  devtool: 'false',

  output: {
    path: resolve(__dirname, '../dist'),
    filename: './static/js/[name].[contenthash].js',
    chunkFilename: './static/js/[name].[contenthash].chunk.js',
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new OptimizeCssAssets()
    ],
    splitChunks: {
      minChunks: 1,
      minSize: 10,
      cacheGroups: {
        ui: {
          test: /[\\/]node_modules[\\/](react-ui-components-library)[\\/]/,
          name: 'ui',
          chunks: 'all',
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'less-loader'
          },
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpack(),
    new HtmlWebpackPlugin({
      filename: resolve(__dirname, './../dist/index.html'),
      template: resolve(__dirname, './../public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: './static/css/[contenthash].css'
    }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256'
    }),
    new BundleAnalyzerPlugin()
  ]
})
