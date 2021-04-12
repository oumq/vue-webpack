const path = require('path')
const webpack = require('webpack')
const webpackConfigBase = require('./webpack.base.config')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const webpackConfigDev = {
  mode: 'production',
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('../public/index.html')
    }),
    new CleanWebpackPlugin()
  ]
}

module.exports = merge(webpackConfigBase, webpackConfigDev)
