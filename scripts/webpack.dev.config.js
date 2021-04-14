const path = require('path')
const webpack = require('webpack')
const webpackConfigBase = require('./webpack.base.config')
const { merge } = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { moduleList } = require('./modules')

let selfIp
try {
  selfIp = getIpAddress()
} catch (e) {
  selfIp = 'localhost'
}

const PORT = 9527

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

// 精确的获取本机ip地址
function getIpAddress() {
  const interfaces = require('os').networkInterfaces
  for (let devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i += 1) {
      let alias = iface[i]
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const webpackConfigDev = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: resolve('../public'), to: 'static' }]
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css'
    })
  ].concat(htmlWebpackPlugins),
  devServer: {
    host: selfIp,
    compress: true,
    hot: true,
    port: PORT
  }
}

module.exports = merge(webpackConfigBase, webpackConfigDev)
