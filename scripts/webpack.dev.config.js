const path = require('path')
const webpack = require('webpack')
const webpackConfigBase = require('./webpack.base.config')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let selfIp
try {
  selfIp = getIpAddress()
} catch (e) {
  selfIp = 'localhost'
}

const PORT = 9527

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
    new HtmlWebpackPlugin({
      template: resolve('../public/index.html')
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    host: selfIp,
    compress: true,
    hot: true,
    port: PORT
  }
}

module.exports = merge(webpackConfigBase, webpackConfigDev)
