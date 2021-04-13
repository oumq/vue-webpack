const path = require('path')
const webpack = require('webpack')
const webpackConfigBase = require('./webpack.base.config')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { moduleList } = require('./modules')

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const htmlWebpackPlugins = []
for (let i = 0, len = moduleList.length; i < len; i++) {
  htmlWebpackPlugins.push(
    new HtmlWebpackPlugin({
      filename: `${moduleList[i]}/index.html`,
      template: `./src/modules/${moduleList[i]}/index.html`,
      inject: true,
      chunks: [moduleList[i]]
    })
  )
}

const webpackConfigDev = {
  mode: 'production',
  devtool: false,
  plugins: [new CleanWebpackPlugin()].concat(htmlWebpackPlugins)
}

module.exports = merge(webpackConfigBase, webpackConfigDev)
